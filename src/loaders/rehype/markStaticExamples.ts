import { Node } from 'unist';
import visit from 'unist-util-visit';
import { CodeNode } from './types';

const PLAYGROUND_LANGS = ['javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx'];

const getCodeLang = (node: CodeNode): string =>
	node.properties.className?.find((s) => s.startsWith('language-'))?.replace(/^language-/, '') ||
	'';

/**
 * Add the `static` modifier to each code example that shouldn't be rendered
 * as a dynamic playgound
 */
export default () => (tree: Node) => {
	visit<CodeNode>(tree, { type: 'element', tagName: 'code' }, (node) => {
		const lang = getCodeLang(node);
		if (!PLAYGROUND_LANGS.includes(lang)) {
			node.properties.static = true;
		}
	});

	return tree;
};
