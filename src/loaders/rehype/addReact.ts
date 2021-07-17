import { Parent, Node } from 'unist';

/**
 * Import React to make it available in the Mdx document scope
 *
 * // ...
 *
 * ->
 *
 *
 * import React from 'react'
 * // ...
 */
export default () => (treeRaw: Node) => {
	const tree = treeRaw as Parent;

	// Generate import
	tree.children.push({
		type: 'import',
		value: `import React from 'react'`,
	});

	return tree;
};
