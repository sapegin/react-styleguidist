import { Parent, Node } from 'unist';
import { generate } from 'escodegen';
import toAst from 'to-ast';
import { builders as b } from 'ast-types';
import * as Rsg from '../../typings';
import getImportsMap from '../utils/getImportsMap';
import { ModuleMap } from './types';

const getLocalName = (name: string) => `__context_import_${name}`;

const getScopeName = (module: string) => module.replace(/^__context_import_/, '');

const getImportsMapFromNodes = (importNodes: Node[]) =>
	getImportsMap(importNodes.map((n) => n.value).join('\n'));

const moduleNamesMapToModulesMap = (modulesNamesMap: Record<string, string>) => {
	const moduleMap: ModuleMap = {};
	for (const module of Object.keys(modulesNamesMap)) {
		moduleMap[getScopeName(module)] = { toAST: () => b.identifier(module) };
	}
	return moduleMap;
};

/**
 * 1. Add import statements for all context modules — modules provied by the
 *    user in the style guide config
 * 2. Add an export statement with a map with all imported into an Mdx document
 *    modules, and context modules:
 *
 * import Button from './Button'
 * import Input from './Input'
 *
 * ->
 *
 * ...
 * export const __documentScope = {'Button': Button, 'Input': Input}
 */
export default ({ context }: { context: Rsg.SanitizedStyleguidistConfig['context'] }) => () => (
	treeRaw: Node
) => {
	const tree = treeRaw as Parent;

	// Generate imports for context modules
	Object.entries(context).forEach(([name, module]) => {
		tree.children.push({
			type: 'import',
			value: `import * as ${getLocalName(name)} from '${module}'`,
		});
	});

	const importNodes = tree.children.filter((n) => n.type === 'import');
	const modulesNamesMap = getImportsMapFromNodes(importNodes);
	const modulesMap = moduleNamesMapToModulesMap(modulesNamesMap);
	const exportCode = `export const __documentScope = ${generate(toAst(modulesMap))}`;

	// Generate export
	tree.children.push({
		type: 'export',
		value: exportCode,
	});

	return tree;
};
