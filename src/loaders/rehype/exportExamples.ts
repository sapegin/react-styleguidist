import { Parent, Node } from 'unist';
import visit from 'unist-util-visit';
import { generate } from 'escodegen';
import toAst from 'to-ast';
import { CodeNode } from './types';
import * as Rsg from '../../typings';

// TODO: deduplicate
const getCodeValue = (node: CodeNode): string =>
	node.children[0].type === 'text' ? String(node.children[0].value) : '';

// TODO: deduplicate
const getCodeLang = (node: CodeNode): string =>
	node.properties.className?.find((s) => s.startsWith('language-'))?.replace(/^language-/, '') ||
	'';

const getAllExamples = (tree: Parent): Rsg.CodeExample[] => {
	const examples: Rsg.CodeExample[] = [];
	visit<CodeNode>(tree, { type: 'element', tagName: 'code' }, (node) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { className, metastring, ...modifiers } = node.properties;
		examples.push({
			content: getCodeValue(node),
			lang: getCodeLang(node),
			settings: modifiers,
		});
	});
	return examples;
};

/**
 * Generate export with all code examples.
 *
 * ```jsx noeditor
 * <Button />
 * ```
 *
 * ->
 *
 * export const __examples = [
 *   {content: '<Button />', lang: 'jsx', settings: {noeditor: true}}
 * ]
 */
export default () => (treeRaw: Node) => {
	const tree = treeRaw as Parent;

	const examples = getAllExamples(tree);

	// Generate export
	const exportCode = `export const __examples = ${generate(toAst(examples))}`;
	tree.children.push({
		type: 'export',
		value: exportCode,
	});

	return tree;
};
