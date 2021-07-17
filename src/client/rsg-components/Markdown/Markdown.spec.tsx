import React from 'react';
import { render, screen } from '@testing-library/react';
import Markdown from './Markdown';

const normalizeClassNames = (html: string): string => html.replace(/(rsg--\w+)-\d+/g, '$1-0');

describe('Markdown', () => {
	test.each([
		['links', 'a [link](http://test.com)'],
		[
			'paragraphs',
			`
a paragraph

another paragraph
		`,
		],
		[
			'unordered lists',
			`
* list
* item
* three
			`,
		],
		[
			'ordered lists',
			`
1. list
1. item
1. three
			`,
		],
		[
			'mixed nested lists',
			`
* list 1
* list 2
	1. Sub-list
	1. Sub-list
	1. Sub-list
* list 3
			`,
		],
		[
			'blockquotes',
			`
> This is a blockquote.
> And this is a second line.
			`,
		],
		[
			'emphasis and strong text',
			`
this text is **strong**

and this is _emphasized_
			`,
		],
		[
			'headings with generated IDs',
			`
# one
## two
### three
#### four
##### five
###### six
			`,
		],
		[
			'pre-formatted text',
			`
    this is preformatted
    so is this
		`,
		],
		[
			'code blocks with highlighting',
			`
\`\`\`html
<foo></foo>
\`\`\`
		`,
		],
		['inline code with escaping', 'Foo `<bar>` baz'],
		['horizontal rules', `---`],
		[
			'tables',
			`
| heading 1 | heading 2 |
| --------- | --------- |
| foo		| bar		|
| more foo	| more bar	|
		`,
		],
		[
			// TODO: fix <input> styles
			'check-lists',
			`
* [ ] to do 1
* [ ] to do 2
* [x] to do 3
			`,
		],
	])('renders %s', (_, markdown) => {
		const { container } = render(<Markdown text={markdown} />);
		expect(normalizeClassNames(container.innerHTML)).toMatchSnapshot();
	});

	test('should forward DOM attributes onto resulting HTML', () => {
		const markdown =
			'<a href="test.com" id="preserve-my-id" class="preserve-my-class">Something</a>';

		const { container } = render(<Markdown text={markdown} />);

		expect(container.querySelector('a')?.id).toEqual('preserve-my-id');
		expect(container.querySelector('a')?.className).toContain('preserve-my-class');
	});

	test('should ignore single line comments', () => {
		const markdown = `Hello World
<!-- This is a single line comment -->
`;
		render(<Markdown text={markdown} />);

		expect(screen.queryByText(/comment/i)).not.toBeInTheDocument();
	});

	test('should ignore multiline comments', () => {
		const markdown = `Hello World
<!--
This is a
multiline
comment
-->
`;
		render(<Markdown text={markdown} />);

		expect(screen.queryByText(/comment/i)).not.toBeInTheDocument();
	});
});

describe('Markdown inline', () => {
	test('should render text in a span', () => {
		const { container } = render(<Markdown text="Hello world!" inline />);
		expect(normalizeClassNames(container.innerHTML)).toMatchSnapshot();
	});
});
