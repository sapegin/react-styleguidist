import { PrismTheme } from 'prism-react-renderer';
import * as Rsg from '../../typings';

/**
 * prism-react-renderer theme
 */
const prismTheme = ({ color }: Pick<Rsg.Theme, 'color'>): PrismTheme => ({
	plain: {
		color: color.codeBase,
		// Remove the background to make react-simple-code-editor work
		// The background is set on the container of either the editor
		// or the static code example
		backgroundColor: 'transparent',
	},
	styles: [
		{
			types: ['comment', 'prolog', 'doctype', 'cdata'],
			style: {
				color: color.codeComment,
			},
		},
		{
			types: ['punctuation'],
			style: {
				color: color.codePunctuation,
			},
		},
		{
			types: ['namespace'],
			style: {
				opacity: 0.7,
			},
		},
		{
			types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'],
			style: {
				color: color.codeProperty,
			},
		},
		{
			types: ['deleted'],
			style: {
				color: color.codeDeleted,
			},
		},
		{
			types: ['inserted'],
			style: {
				color: color.codeInserted,
			},
		},
		{
			types: ['char', 'builtin', 'keyword', 'attr-name', 'selector', 'string'],
			style: {
				color: color.codeString,
			},
		},
		{
			types: ['operator', 'entity', 'url'],
			style: {
				color: color.codeOperator,
			},
		},
		{
			types: ['string'],
			languages: ['css', 'scss', 'sass', 'stylus', 'less'],
			style: {
				color: color.codeOperator,
			},
		},
		{
			types: ['atrule', 'attr-value', 'keyword'],
			style: {
				color: color.codeKeyword,
			},
		},
		{
			types: ['regex', 'important', 'variable', 'function-variable'],
			style: {
				color: color.codeVariable,
			},
		},
		{
			types: ['function', 'class-name'],
			style: {
				color: color.codeFunction,
			},
		},
		{
			types: ['important', 'bold'],
			style: {
				fontWeight: 'bold',
			},
		},
		{
			types: ['italic'],
			style: {
				fontStyle: 'italic',
			},
		},
	],
});

export default prismTheme;
