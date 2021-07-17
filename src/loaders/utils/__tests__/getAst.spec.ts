import getAst from '../getAst';

describe('getAst', () => {
	test('return AST', () => {
		const result = getAst(`42`);
		expect(result).toHaveProperty('type', 'File');
	});

	test('understands JSX', () => {
		const result = getAst(`<X />`);
		expect(result).toHaveProperty('type', 'File');
	});

	test('understands multiple JSX elements without a root element', () => {
		const result = getAst(`<X /><Y />`);
		expect(result).toHaveProperty('type', 'File');
	});

	test('understands new ECMAScript syntax', () => {
		const result = getAst(`foo?.bar?.baz()`);
		expect(result).toHaveProperty('type', 'File');
	});

	test('understands TypeScript', () => {
		const result = getAst(`const pizza = [1, 2, 3] as const`);
		expect(result).toHaveProperty('type', 'File');
	});
});
