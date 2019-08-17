import React from 'react';
import noop from 'lodash/noop';
import TableOfContents from './TableOfContents';
import { TableOfContentsRenderer } from './TableOfContentsRenderer';

const components = [
	{
		name: 'Button',
		slug: 'button',
	},
	{
		name: 'Input',
		slug: 'input',
	},
	{
		name: 'Textarea',
		slug: 'textarea',
	},
];

const sections = [
	{
		name: 'Introduction',
		slug: 'introduction',
		content: 'intro.md',
	},
	{
		name: 'Buttons',
		slug: 'buttons',
		components: [
			{
				name: 'Button',
				slug: 'button',
			},
		],
	},
	{
		name: 'Forms',
		slug: 'forms',
		components: [
			{
				name: 'Input',
				slug: 'input',
			},
			{
				name: 'Textarea',
				slug: 'textarea',
			},
		],
	},
];

it('should render a renderer', () => {
	const actual = shallow(<TableOfContents sections={[{ components }]} />);

	expect(actual).toMatchSnapshot();
});

it('should render renderer with sections with nested components', () => {
	const actual = shallow(<TableOfContents sections={sections} />);

	expect(actual).toMatchSnapshot();
});

it('should filter list when search field contains a query', () => {
	const searchTerm = 'but';
	const actual = shallow(<TableOfContents sections={[{ components }]} />);

	expect(actual).toMatchSnapshot();

	actual.setState({ searchTerm });

	expect(actual).toMatchSnapshot();
});

it('should filter section names', () => {
	const searchTerm = 'frm';
	const actual = shallow(<TableOfContents sections={sections} />);

	expect(actual).toMatchSnapshot();

	actual.setState({ searchTerm });

	expect(actual).toMatchSnapshot();
});

it('renderer should render table of contents', () => {
	const searchTerm = 'foo';
	const actual = shallow(
		<TableOfContentsRenderer
			classes={{}}
			items={<div>foo</div>}
			searchTerm={searchTerm}
			onSearchTermChange={noop}
		/>
	);

	expect(actual).toMatchSnapshot();
});

it('should call a callback when input value changed', () => {
	const onSearchTermChange = jest.fn();
	const searchTerm = 'foo';
	const newSearchTerm = 'bar';
	const actual = shallow(
		<TableOfContentsRenderer
			classes={{}}
			items={<div>foo</div>}
			searchTerm={searchTerm}
			onSearchTermChange={onSearchTermChange}
		/>
	);

	actual.find('input').simulate('change', {
		target: {
			value: newSearchTerm,
		},
	});

	expect(onSearchTermChange).toBeCalledWith(newSearchTerm);
});

it('should render content of subsections of a section that has no components', () => {
	const actual = shallow(
		<TableOfContents
			sections={[{ sections: [{ contents: 'intro.md' }, { contents: 'chapter.md' }] }]}
		/>
	);

	expect(actual.find('ComponentsList').prop('items')).toMatchInlineSnapshot(`
Array [
  Object {
    "components": Array [],
    "content": false,
    "contents": "intro.md",
    "heading": false,
    "sections": Array [],
  },
  Object {
    "components": Array [],
    "content": false,
    "contents": "chapter.md",
    "heading": false,
    "sections": Array [],
  },
]
`);
});

it('should render components of a single top section as root', () => {
	const actual = shallow(<TableOfContents sections={[{ components }]} />);

	expect(actual.find('ComponentsList').prop('items')).toMatchInlineSnapshot(`
Array [
  Object {
    "components": Array [],
    "content": false,
    "heading": false,
    "name": "Button",
    "sections": Array [],
    "slug": "button",
  },
  Object {
    "components": Array [],
    "content": false,
    "heading": false,
    "name": "Input",
    "sections": Array [],
    "slug": "input",
  },
  Object {
    "components": Array [],
    "content": false,
    "heading": false,
    "name": "Textarea",
    "sections": Array [],
    "slug": "textarea",
  },
]
`);
});
