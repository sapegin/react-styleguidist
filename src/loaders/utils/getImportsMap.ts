import { walk } from 'estree-walker';
import { Node } from 'estree';
import getAst from './getAst';

/**
 * Returns a mapping of all import statements
 */
export default function getImportsMap(code: string): Record<string, string> {
	// Parse example source code, but ignore errors:
	// we'll deal with them on the frontend
	const ast = getAst(code);
	if (!ast) {
		return {};
	}

	const imports: Record<string, string> = {};
	walk(ast, {
		enter: (nodeRaw) => {
			const node = nodeRaw as Node;

			// import foo from 'foo'
			if (node.type === 'ImportDeclaration') {
				if (node.source) {
					node.specifiers.forEach((specifier) => {
						if (specifier.local.name) {
							imports[specifier.local.name] = node.source.value as string;
						}
					});
				}
			}
		},
	});
	return imports;
}
