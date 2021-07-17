import path from 'path';
import { flatMap, camelCase } from 'lodash';
import loaderUtils from 'loader-utils';
import { loader } from 'webpack';
import {
	BaseNode,
	Program,
	Declaration,
	VariableDeclaration,
	ExportNamedDeclaration,
	ImportDeclaration,
	VariableDeclarator,
	ImportSpecifier,
	ImportDefaultSpecifier,
	ImportNamespaceSpecifier,
} from 'estree';
import { walk } from 'estree-walker';
import { builders as b } from 'ast-types';
import { generate } from 'escodegen';
import toAst from 'to-ast';
import stripIndent from 'strip-indent';
import getAst from './utils/getAst';
import getNameFromFilePath from './utils/getNameFromFilePath';
import { ModuleMap } from './rehype/types';

// TODO: Unwrap `return ()`

interface Dependency {
	names: string[];
	code: string;
}

const getLocalName = (index: number) => `__stories_import_${index}`;

// Ensure that we have a semicolon (;) at the end: we must put a semicolon
// in front of JSX (`import 'foo'; <Button/>`), otherwise it won't compile
const ensureSemicolon = (s: string): string => s.replace(/(?:;\s*)?$/, ';');

// Returns the indentation (actual whitespace, not a number of spaces)
// of the first line of code example
const getIndent = (code: string, position: number) => code.substring(0, position).match(/[ \t]*$/);

// TODO: Deduplicate?
const getModulePathToModuleMap = (modules: string[]) => {
	const moduleMap: ModuleMap = {};
	modules.forEach((module, index) => {
		moduleMap[module] = { toAST: () => b.identifier(getLocalName(index)) };
	});
	return moduleMap;
};

const getImports = (ast: Program): string[] => {
	const imports: string[] = [];
	walk(ast, {
		enter: (node: BaseNode) => {
			if (node.type === 'ImportDeclaration') {
				const importDeclarationNode = node as ImportDeclaration;
				if (typeof importDeclarationNode?.source?.value === 'string') {
					imports.push(importDeclarationNode.source.value);
				}
			}
		},
	});
	return imports;
};

const getImportDeclarationName = (
	specifier: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
): string => {
	switch (specifier.type) {
		case 'ImportSpecifier':
		case 'ImportDefaultSpecifier':
		case 'ImportNamespaceSpecifier':
			return specifier.local.name;
		default:
			return '';
	}
};

const getImportStatements = (ast: Program, code: string): Dependency[] => {
	const imports: Dependency[] = [];
	walk(ast, {
		enter: (node: BaseNode) => {
			if (node.type === 'ImportDeclaration') {
				const importDeclarationNode = node as ImportDeclaration;
				if (importDeclarationNode.source) {
					// @ts-expect-error: There are no types for location ;-/
					const { start, end } = importDeclarationNode;
					imports.push({
						names: importDeclarationNode.specifiers.map(getImportDeclarationName),
						code: code.substring(start, end),
					});
				}
			}
		},
	});
	return imports;
};

const getVariableDeclarationNames = ({ id }: VariableDeclarator): string[] => {
	switch (id.type) {
		case 'Identifier':
			return [id.name];
		case 'ObjectPattern':
			return id.properties
				.map((property) => {
					switch (property.type) {
						case 'Property':
							switch (property.value.type) {
								case 'Identifier':
									return property.value.name;
							}
							return '';
						case 'RestElement':
							switch (property.argument.type) {
								case 'Identifier':
									return property.argument.name;
							}
							return '';
					}
					return '';
				})
				.filter(Boolean);
		default:
			return [];
	}
};

const getVariableStatements = (ast: Program, code: string): Dependency[] => {
	const variables: Dependency[] = [];
	walk(ast, {
		enter: (node: BaseNode, parent: BaseNode) => {
			if (node.type === 'VariableDeclaration' && parent.type === 'Program') {
				const variableDeclarationNode = node as VariableDeclaration;
				// @ts-expect-error: There are no types for location ;-/
				const { start, end } = variableDeclarationNode;
				variables.push({
					names: flatMap(variableDeclarationNode.declarations, getVariableDeclarationNames),
					code: code.substring(start, end),
				});
			}
		},
	});
	return variables;
};

const getExportCode = (node: Declaration, code: string) => {
	switch (node.type) {
		case 'VariableDeclaration': {
			const variableDeclarationNode = node as VariableDeclaration;

			const [declaration] = variableDeclarationNode.declarations;

			if (!declaration || declaration.type !== 'VariableDeclarator') {
				break;
			}

			const { id, init } = declaration;
			if (id.type !== 'Identifier' || !init) {
				break;
			}

			switch (init.type) {
				case 'ArrowFunctionExpression': {
					// @ts-expect-error 2339: There are no types for location ;-/
					const { start, end } = init.body;
					return {
						name: id.name,
						code: stripIndent(getIndent(code, start) + code.substring(start, end)),
					};
				}
			}
			break;
		}
	}

	return undefined;
};

// This is a very simplified approach: it will add unnecessary dependencies
// because we only check whether the dependency local name is present in the
// example code. However, it won't break the code by not including all the used
// dependencies
const prependExampleWithDependencies = (
	code: string,
	dependencies: Dependency[],
	componentName: string
) => {
	const usedDependencies = dependencies.filter(
		(dependency) =>
			// Ignore the current component import it it's the only import
			!(dependency.names.length === 1 && dependency.names[0] === componentName) &&
			// Include imports when any of the names are present in the code
			dependency.names.some((name) => code.match(new RegExp(`\\b${name}\\b`)))
	);
	return [
		usedDependencies
			.map((dependency) => ensureSemicolon(dependency.code))
			.filter(Boolean)
			.join('\n'),
		code,
	]
		.filter(Boolean)
		.join('\n\n');
};

const getExports = (ast: Program, code: string, componentName: string) => {
	const imports = getImportStatements(ast, code);
	const variables = getVariableStatements(ast, code);

	const exports: Record<string, string> = {};
	walk(ast, {
		enter: (node: BaseNode) => {
			// export const foo = ...
			if (node.type === 'ExportNamedDeclaration') {
				const exportNamedDeclaratioNode = node as ExportNamedDeclaration;
				if (exportNamedDeclaratioNode.declaration) {
					const exportCode = getExportCode(exportNamedDeclaratioNode.declaration, code);
					if (exportCode) {
						exports[camelCase(exportCode.name)] = prependExampleWithDependencies(
							exportCode.code,
							[...imports, ...variables],
							componentName
						);
					}
				}
			}
		},
	});
	return exports;
};

/**
 * 1. Generate export with all modules imported into a Component Story Format
 *    (CSF) file, so they are available in examples when we run them.
 * 2. Generate export with all strories in a CSF files.
 * 3. Generate imports for all modules imported by a CSF file so weback bundles
 *    the modules.
 * 4. Prepend each story example with necessary imports and local variables.
 *
 * import Button from './Button'
 * import Container from './Container'
 * export const basic = () => <Container><Button /></Container>
 *
 * ->
 *
 * import * as __stories_import_0 from './Button'
 * export const __stories_namedExamples = {
 *   basic: 'import Button from './Button'\n\n<Container><Button /></Container>'
 * }
 * export const __stories_storiesScope = {
 *   './Button': __stories_import_0
 * }
 */
export default function storiesLoader(this: loader.LoaderContext, storiesCode: string) {
	const callback = this.async() || (() => '');
	const { componentPath, mdxDocumentPath } = loaderUtils.getOptions(this) || {};

	const storiesAst = getAst(storiesCode);
	if (!storiesAst) {
		return callback(
			null,
			'export const __stories_namedExamples = {}; export const __stories_storiesScope = {};'
		);
	}

	const componentAbsolutePath = path.resolve(path.dirname(mdxDocumentPath), componentPath);
	const componentName = getNameFromFilePath(componentAbsolutePath);

	const lines: string[] = [];

	// Export named examples
	const exports = getExports(storiesAst, storiesCode, componentName);
	lines.push(`export const __stories_namedExamples = ${generate(toAst(exports))}`);

	const imports = getImports(storiesAst);

	// Generate imports so weback bundles the modules
	imports.forEach((module, index) => {
		lines.push(`import * as ${getLocalName(index)} from '${module}'`);
	});

	// Export the mapping of imported modules
	const modulesMap = getModulePathToModuleMap(imports);
	lines.push(`export const __stories_storiesScope = ${generate(toAst(modulesMap))}`);

	return callback(null, lines.join('\n'));
}
