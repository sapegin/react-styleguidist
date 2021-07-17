import find from 'lodash/find';
import getAst from './getAst';

// Strip semicolon (;) at the end
const unsemicolon = (s: string): string => s.replace(/;\s*$/, '');

/**
 * Wraps the last top-level expression in a return statement
 * (kind of an implicit return).
 *
 * Example:
 * var a = 1; React.createElement('i', null, a); // =>
 * var a = 1; return (React.createElement('i', null, a));
 */
export default function insertReturnLastExpression(code: string): string {
	const ast = getAst(code);
	if (!ast) {
		return code;
	}

	const lastExpressionPosition = find(ast.body.reverse(), { type: 'ExpressionStatement' });
	if (!lastExpressionPosition) {
		return code;
	}

	// @ts-expect-error: There are no types for location ;-/
	const { start, end } = lastExpressionPosition;
	const head = unsemicolon(code.substring(0, start));
	const lastExpressionCode = unsemicolon(code.substring(start, end));
	return `${head};\nreturn (${lastExpressionCode});`;
}
