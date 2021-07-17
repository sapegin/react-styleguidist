import { Parent, Node } from 'unist';
import visit from 'unist-util-visit';
import { generate } from 'escodegen';
import toAst from 'to-ast';
import { builders as b } from 'ast-types';
import getImports from '../utils/getImports';
import { CodeNode, ModuleMap } from './types';

const getCodeValue = (node: CodeNode): string =>
	node.children[0].type === 'text' ? String(node.children[0].value) : '';

const getLocalName = (index: number) => `__ex_import_${index}`;

const getAllImportedModules = (tree: Parent): string[] => {
	const imports: string[] = [];
	visit<CodeNode>(tree, { type: 'element', tagName: 'code' }, (node) => {
		if (!node.properties.static) {
			const code = getCodeValue(node);
			imports.push(...getImports(code));
		}
	});
	return [...new Set(imports)];
};

const getModulePathToModuleMap = (modules: string[]) => {
	const moduleMap: ModuleMap = {};
	modules.forEach((module, index) => {
		moduleMap[module] = { toAST: () => b.identifier(getLocalName(index)) };
	});
	return moduleMap;
};

/**
 * 1. Import each module imported in any non-static example into the Mdx document,
 *    so they are bundled by webpack and available at runtime.
 * 2. Export the map of these modules that will be used in the custom `require`
 *    method during the example code execution.
 *
 * ```jsx
 * import Button from './Button'
 * ...
 * ```
 *
 * ->
 *
 * import * as __ex_import_0 from './Button'
 * export const __exampleScope = {'./Button': __ex_import_0}
 * ...
 */
export default () => (treeRaw: Node) => {
	const tree = treeRaw as Parent;

	const modules = getAllImportedModules(tree);

	// Generate imports
	modules.forEach((module, index) => {
		tree.children.push({
			type: 'import',
			value: `import * as ${getLocalName(index)} from '${module}'`,
		});
	});

	// Generate export
	const modulesMap = getModulePathToModuleMap(modules);
	const exportCode = `export const __exampleScope = ${generate(toAst(modulesMap))}`;
	tree.children.push({
		type: 'export',
		value: exportCode,
	});

	return tree;
};
