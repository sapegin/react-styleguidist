/**
 * Return module from a given map (like {react: require('react')}) or throw.
 * We allow to require modules only from Markdown examples (won’t work
 * dynamically because we need to know all required modules in advance
 * to be able to bundle them with the code).
 */
export default function requireInRuntime(
	requireMap: Record<string, unknown>
): (filename: string) => unknown {
	return function (filepath: string) {
		if (!(filepath in requireMap)) {
			throw new Error(
				`import or require() statements can be added only by editing a Markdown or Mdx example file: ${filepath}`
			);
		}

		return requireMap[filepath];
	};
}
