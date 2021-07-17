import { walk } from 'estree-walker';
import { Node } from 'estree';
import getAst from './getAst';

/**
 * Returns a list of all strings used in import statements or require() calls
 */
export default function getImports(code: string): string[] {
	// Parse example source code, but ignore errors:
	// 1. Adjacent JSX elements must be wrapped in an enclosing tag (<X/><Y/>) -
	//    imports/requires are not allowed in this case, and we'll wrap the code
	//    in React.Fragment on the frontend
	// 2. All other errors - we'll deal with them on the frontend
	const ast = getAst(code);
	if (!ast) {
		return [];
	}

	const imports: string[] = [];
	walk(ast, {
		enter: (nodeRaw) => {
			const node = nodeRaw as Node;

			// import foo from 'foo'
			// import 'foo'
			if (node.type === 'ImportDeclaration') {
				if (node.source) {
					imports.push(node.source.value as string);
				}
			}

			// require('foo')
			else if (node.type === 'CallExpression') {
				if (
					node.callee &&
					node.callee.type === 'Identifier' &&
					node.callee.name === 'require' &&
					node.arguments[0]?.type === 'Literal' &&
					node.arguments[0].value
				) {
					imports.push(node.arguments[0].value as string);
				}
			}
		},
	});
	return imports;
}
