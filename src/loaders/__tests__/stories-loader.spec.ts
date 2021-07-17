import { loader } from 'webpack';
import storiesLoader from '../stories-loader';

const query = {
	componentPath: '/Pizza/Pizza.tsx',
	mdxDocumentPath: '/Pizza/Pizza.stories.tsx',
};

describe('stories', () => {
	it('camel case names stays as camel case', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
export const camelCaseStory = () => <Container><Button /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'camelCaseStory': '<Container><Button /></Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	it('pascal case names are converted to camel case', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
export const PascalCaseStory = () => <Container><Button /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'pascalCaseStory': '<Container><Button /></Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	it('remove extra indentation, tabs', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
export const tabIndentedStory = () => (
	<Container>
		<Button />
	</Container>
);
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'tabIndentedStory': '<Container>\\\\n\\\\t<Button />\\\\n</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	it('remove extra indentation, spaces', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
export const tabIndentedStory = () => (
  <Container>
    <Button />
  </Container>
);
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'tabIndentedStory': '<Container>\\\\n  <Button />\\\\n</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});
});

describe('imports', () => {
	test('default import', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import Container from './Container';
export const basic = () => <Container><Button /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'import Container from \\\\'./Container\\\\';\\\\n\\\\n<Container><Button /></Container>' }
		import * as __stories_import_0 from './Container'
		export const __stories_storiesScope = { './Container': __stories_import_0 }"
	`);
	});

	test('named import', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import { Button, Input } from './components';
export const basic = () => <Container><Button /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'import { Button, Input } from \\\\'./components\\\\';\\\\n\\\\n<Container><Button /></Container>' }
		import * as __stories_import_0 from './components'
		export const __stories_storiesScope = { './components': __stories_import_0 }"
	`);
	});

	test('mixed import', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import Input, { Button } from './components';
export const basic = () => <Container><Button /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'import Input, { Button } from \\\\'./components\\\\';\\\\n\\\\n<Container><Button /></Container>' }
		import * as __stories_import_0 from './components'
		export const __stories_storiesScope = { './components': __stories_import_0 }"
	`);
	});

	test('named import with renaming', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import { Input as Button } from './components';
export const basic = () => <Container><Button /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'import { Input as Button } from \\\\'./components\\\\';\\\\n\\\\n<Container><Button /></Container>' }
		import * as __stories_import_0 from './components'
		export const __stories_storiesScope = { './components': __stories_import_0 }"
	`);
	});

	test('wildcard import', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import * as Buttons from './Buttons';
export const basic = () => <Container><Buttons.Button /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'import * as Buttons from \\\\'./Buttons\\\\';\\\\n\\\\n<Container><Buttons.Button /></Container>' }
		import * as __stories_import_0 from './Buttons'
		export const __stories_storiesScope = { './Buttons': __stories_import_0 }"
	`);
	});

	test('skips current component', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import Pizza from './Pizza';
import Container from './Container';
export const basic = () => <Container><Pizza /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'import Container from \\\\'./Container\\\\';\\\\n\\\\n<Container><Pizza /></Container>' }
		import * as __stories_import_0 from './Pizza'
		import * as __stories_import_1 from './Container'
		export const __stories_storiesScope = {
		    './Pizza': __stories_import_0,
		    './Container': __stories_import_1
		}"
	`);
	});

	test('skips current component (named import)', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import { Pizza } from '.';
import Container from './Container';
export const basic = () => <Container><Pizza /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'import Container from \\\\'./Container\\\\';\\\\n\\\\n<Container><Pizza /></Container>' }
		import * as __stories_import_0 from '.'
		import * as __stories_import_1 from './Container'
		export const __stories_storiesScope = {
		    '.': __stories_import_0,
		    './Container': __stories_import_1
		}"
	`);
	});

	test('includes the current component when it is not the only import', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import Pizza, { cheese } from './Pizza';
import Container from './Container';
export const basic = () => <Container><Pizza toppings={[cheese]} /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'import Pizza, { cheese } from \\\\'./Pizza\\\\';\\\\nimport Container from \\\\'./Container\\\\';\\\\n\\\\n<Container><Pizza toppings={[cheese]} /></Container>' }
		import * as __stories_import_0 from './Pizza'
		import * as __stories_import_1 from './Container'
		export const __stories_storiesScope = {
		    './Pizza': __stories_import_0,
		    './Container': __stories_import_1
		}"
	`);
	});

	test('unused imports', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import * as React from 'react';
import { Coffee, Milk } from './drinks';
export const basic = () => <Container><Button /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': '<Container><Button /></Container>' }
		import * as __stories_import_0 from 'react'
		import * as __stories_import_1 from './drinks'
		export const __stories_storiesScope = {
		    'react': __stories_import_0,
		    './drinks': __stories_import_1
		}"
	`);
	});

	test('adds semicolon', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
import Container from './Container'
export const basic = () => <Container><Button /></Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'import Container from \\\\'./Container\\\\';\\\\n\\\\n<Container><Button /></Container>' }
		import * as __stories_import_0 from './Container'
		export const __stories_storiesScope = { './Container': __stories_import_0 }"
	`);
	});
});

describe('local variables', () => {
	test('const', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
const pizza = 'pizza';
export const basic = () => <Container>{pizza}</Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'const pizza = \\\\'pizza\\\\';\\\\n\\\\n<Container>{pizza}</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	test('destructuring', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
const { coffee } = {coffee: 'V60'};
export const basic = () => <Container>{coffee}</Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'const { coffee } = {coffee: \\\\'V60\\\\'};\\\\n\\\\n<Container>{coffee}</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	test('destructuring with renaming', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
const { coffee: pizza } = {coffee: 'V60'};
export const basic = () => <Container>{pizza}</Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'const { coffee: pizza } = {coffee: \\\\'V60\\\\'};\\\\n\\\\n<Container>{pizza}</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	test('destructuring with rest', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
const { coffee, ...rest } = {coffee: 'V60'};
export const basic = () => <Container>{rest.map(x => <p>{x}</p>)}</Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'const { coffee, ...rest } = {coffee: \\\\'V60\\\\'};\\\\n\\\\n<Container>{rest.map(x => <p>{x}</p>)}</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	test('unused variable', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
const coffee = 'V60';
export const basic = () => <Container>pizza</Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': '<Container>pizza</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	test('partial name', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
const java = 'Java is to JavaScript as ham is to hamster';
export const basic = () => <Container>{javascript}</Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': '<Container>{javascript}</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	test('adds semicolon', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
const pizza = 'pizza'
export const basic = () => <Container>{pizza}</Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'const pizza = \\\\'pizza\\\\';\\\\n\\\\n<Container>{pizza}</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});

	test('understands TypeScript', () => {
		let result: string | Buffer | undefined = '';
		storiesLoader.call(
			{
				query,
				async: () => (_, c) => (result = c),
			} as loader.LoaderContext,
			`
const nums = ['eins', 'zwei', 'polizei'] as const;
export const basic = () => <Container>{nums.map(x => x)}</Container>
`
		);
		expect(result).toMatchInlineSnapshot(`
		"export const __stories_namedExamples = { 'basic': 'const nums = [\\\\'eins\\\\', \\\\'zwei\\\\', \\\\'polizei\\\\'] as const;\\\\n\\\\n<Container>{nums.map(x => x)}</Container>' }
		export const __stories_storiesScope = {}"
	`);
	});
});
