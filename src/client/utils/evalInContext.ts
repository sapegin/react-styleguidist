import requireInRuntime from './requireInRuntime';

/**
 * Returns a React component that evals the example code with:
 *
 * 1. The document scope: the context (modules imported into Mdx document,
 * current component and modules defined via the `context` config option) as
 * function parameters.
 * 2. The example scope: a custom `require()` function that allows to require
 * modules from Markdown examples, which won’t work dinamically becasue we need
 * to know all imported/required modules in advance to be able to bundle them
 * with the code using webpack.
 */
export default function evalInContext(
	code: string,
	{
		documentScope,
		exampleScope,
	}: {
		documentScope: Record<string, unknown>;
		exampleScope: Record<string, unknown>;
	}
): () => React.ReactElement {
	const scopeNames = Object.keys(documentScope);
	const scopeModules = Object.values(documentScope);

	// eslint-disable-next-line no-new-func
	const func = new Function('require', ...scopeNames, code);

	// Define custom name instead of default `anonymous`
	Object.defineProperty(func, 'name', { value: 'evalInContext(Example)', writable: false });

	const require = requireInRuntime(exampleScope);

	// Bind function parameters
	return func.bind(null, require, ...scopeModules);
}
