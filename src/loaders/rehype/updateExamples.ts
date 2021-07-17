import { Node } from 'unist';
import visit from 'unist-util-visit';
import { CodeNode } from './types';
import * as Rsg from '../../typings';

// TODO: Deduplicate, we have the same in markStaticExamples
const getCodeLang = (node: CodeNode): string | undefined =>
	node.properties.className?.find((s) => s.startsWith('language-'))?.replace(/^language-/, '') ||
	undefined;

const getCode = (node: CodeNode): string =>
	node.children[0].type === 'text' ? node.children[0].value : '';

/**
 * Update examples in fenced code blocks using the `updateExample()` function from
 * the style guide config
 */
export default ({
	updateExample,
	mdxDocumentPath,
}: {
	updateExample: Rsg.SanitizedStyleguidistConfig['updateExample'];
	mdxDocumentPath: string;
}) => () => (tree: Node) => {
	visit<CodeNode>(tree, { type: 'element', tagName: 'code' }, (node) => {
		const content = getCode(node);
		const lang = getCodeLang(node);
		const { className, metastring, ...settings } = node.properties;

		const nextExample = updateExample({ content, lang, settings }, mdxDocumentPath);

		// TODO: Update lang
		node.children[0].value = nextExample.content.trim();
		node.properties = {
			...nextExample.settings,
			className,
			metastring,
		};
	});

	return tree;
};
