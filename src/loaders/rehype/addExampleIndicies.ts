import { Node } from 'unist';
import visit from 'unist-util-visit';
import { CodeNode } from './types';

/**
 * Add an index to each code example that later could be used to link an
 * isolated mode page
 */
export default () => (tree: Node) => {
	let index = 0;
	visit<CodeNode>(tree, { type: 'element', tagName: 'code' }, (node) => {
		node.properties.index = index;
		index++;
	});

	return tree;
};
