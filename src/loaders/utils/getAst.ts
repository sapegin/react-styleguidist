import { parse, ParserOptions } from '@babel/parser';
import { Program } from 'estree';
import Logger from 'glogg';

const logger = Logger('rsg');

const startsWithJsx = (code: string): boolean => !!code.trim().match(/^</);

const wrapCodeInFragment = (code: string): string => `<React.Fragment>${code}</React.Fragment>;`;

export const BABEL_OPTIONS: ParserOptions = {
	allowReturnOutsideFunction: true,
	allowAwaitOutsideFunction: true,
	errorRecovery: true,
	sourceType: 'module',
	plugins: [
		'jsx',
		// TODO: How to support flow? We can't use `flow` and `typescript` plugins together
		'typescript',
		// Generate AST compatible with ESTree
		// TODO: We may want to rewrite the code to use Babel AST instead
		'estree',
	],
};

/**
 * Try to parse source code using Babel parser, return AST.
 * If failed, return undefined.
 */
export default function getAst(code: string): Program | undefined {
	const wrappedCode = startsWithJsx(code) ? wrapCodeInFragment(code) : code;
	try {
		return (parse(wrappedCode, BABEL_OPTIONS) as unknown) as Program; // TODO: @babel/types.File
	} catch (err) {
		// TODO: Remove console.log
		console.log(`Babel cannot parse code: ${err.message}\n\nCode:\n${code}`);
		logger.debug(`Babel cannot parse code: ${err.message}\n\nCode:\n${code}`);
		return undefined;
	}
}
