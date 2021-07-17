import path from 'path';
import getProps from '../getProps';

it('should return an object for props', () => {
	const result = getProps({
		displayName: 'Button',
		description: 'The only true button.',
		methods: [],
		props: {
			children: {
				name: 'children',
				type: {
					name: 'object',
				},
				required: true,
				description: 'Button label.',
			},
			color: {
				name: 'color',
				type: {
					name: 'string',
				},
				required: false,
				description: '',
			},
		},
	});

	expect(result).toMatchSnapshot();
});

it('should return an object for props without description', () => {
	const result = getProps({
		displayName: 'Button',
		props: {
			children: {
				name: 'children',
				type: {
					name: 'object',
				},
				required: true,
				description: 'Button label.',
			},
		},
	});

	expect(result).toMatchSnapshot();
});

it('should remove non-public methods', () => {
	const result = getProps(
		{
			displayName: 'Button',
			methods: [
				{
					docblock: `Public method.
@public`,
				},
				{
					docblock: `Private method.
@private`,
				},
				{
					docblock: 'Private method by default.',
				},
			] as any,
		},
		__filename
	);

	expect(result).toMatchSnapshot();
});

it('should get method info from docblock and merge it', () => {
	const result = getProps(
		{
			displayName: 'Button',
			methods: [
				{
					docblock: `
Baz method with foo param

@public
@returns {string} test
`,
				},
			] as any,
		},
		__filename
	);

	expect(result.methods).toMatchSnapshot();
});

it('should accept @return as a synonym of @returns', () => {
	const result = getProps(
		{
			displayName: 'Button',
			methods: [
				{
					docblock: `
Baz method with foo param

@public
@return {string} test
`,
				},
			] as any,
		},
		__filename
	);

	expect(result.methods).toMatchSnapshot();
});

it('should get method params info from docblock and merge it with passed method info', () => {
	const result = getProps(
		{
			displayName: 'Button',
			methods: [
				{
					docblock: `
Foo method with baz param

@public
@param {string} [baz=bar]
@arg {string} foo param described with @arg tag
@argument {string} test param described with @argument tag
@returns {string} test
`,
					params: [
						{
							name: 'baz',
						},
						{
							name: 'foo',
						},
						{
							name: 'test',
						},
					],
				},
			] as any,
		},
		__filename
	);

	expect(result.methods).toMatchSnapshot();
});

it('should return an object for props with doclets', () => {
	const result = getProps(
		{
			displayName: 'Button',
			description: `
The only true button.

@foo Foo
@bar Bar
`,
		},
		__filename
	);

	expect(result).toMatchSnapshot();
});

it('should return require statement for @example doclet', () => {
	const result = getProps(
		{
			displayName: 'Button',
			description: `
The only true button.

@example ../../../test/components/Placeholder/examples.md
`,
		},
		__filename
	);

	expect(result).toMatchSnapshot();
});

it('should return require statement for @example doclet only when the file exists', () => {
	const result = getProps(
		{
			displayName: 'Button',
			description: `
The only true button.

@example example.md
`,
		},
		__filename
	);

	expect(result).toMatchSnapshot();
});

// TODO: This doesn't work anymore for some reason
it.skip('should highlight code in description (fenced code block)', () => {
	const result = getProps({
		description: `
The only true button.

\`\`\`js
alert('Hello world');
\`\`\`
`,
	});

	expect(result).toMatchSnapshot();
});

it("should not crash when using doctrine to parse a default prop that isn't in the props list", () => {
	const result = getProps({
		description: 'The only true button.',
		methods: [],
		props: {
			crash: {
				description: undefined,
			},
		} as any,
	});

	expect(result).toMatchSnapshot();
});

it('should not crash when using doctrine to parse a return method that does not have type in it', () => {
	const result = getProps(
		{
			displayName: 'Button',
			methods: [
				{
					docblock: `
Public Method

@public
@returns {Boolean} return a Boolean Value
`,
					returns: {
						description: 'return a Boolean Value',
						type: { name: 'boolean' },
					},
				},
			] as any,
		},
		__filename
	);

	// @ts-ignore
	expect(result.methods[0].returns).toEqual(
		expect.objectContaining({
			description: 'return a Boolean Value',
			type: {
				name: 'boolean',
				type: 'NameExpression',
			},
		})
	);
});

it('should guess a displayName for components that react-docgen was not able to recognize', () => {
	const result = getProps(
		{
			methods: [],
			props: {},
		},
		path.join('an', 'absolute', 'path', 'to', 'YourComponent.js')
	);
	expect(result).toHaveProperty('displayName', 'YourComponent');
});

describe('with @visibleName tag present in the description', () => {
	const result = getProps({
		description: 'bar\n@visibleName foo',
	});
	it('should set visibleName property on the docs object', () => {
		expect(result).toHaveProperty('visibleName', 'foo');
	});

	it('should delete visibleName from doclets on the docs object', () => {
		expect(result.doclets).not.toHaveProperty('visibleName');
	});

	it('should delete visibleName from tags on the docs object', () => {
		expect(result.tags).not.toHaveProperty('visibleName');
	});
});
