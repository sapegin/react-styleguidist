import { Parent, Node } from 'unist';

const getLocalName = () => `__ex_component`;

/**
 * Bundle the current component, and add an export statement with the component
 * module.
 *
 * import * as __ex_component from './Button'
 * export const __currentComponent = __ex_component
 */
export default ({ componentPath }: { componentPath: string }) => () => (treeRaw: Node) => {
	const tree = treeRaw as Parent;

	// Generate import
	tree.children.push({
		type: 'import',
		value: `import * as ${getLocalName()} from '${componentPath}'`,
	});

	// Generate export
	const exportCode = `export const __currentComponent = ${getLocalName()}`;
	tree.children.push({
		type: 'export',
		value: exportCode,
	});

	return tree;
};
