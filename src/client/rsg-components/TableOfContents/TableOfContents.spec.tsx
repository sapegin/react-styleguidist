/* eslint-disable @typescript-eslint/naming-convention */

import React from 'react';
import { render, screen, fireEvent } from '../../test';
import TableOfContents from './TableOfContents';
import { TableOfContentsRenderer } from './TableOfContentsRenderer';
import * as Rsg from '../../../typings';

const module: Rsg.ExamplesModule = {
	default: () => null,
	__esModule: true,
	__documentScope: {},
	__exampleScope: {},
	__storiesScope: {},
	__currentComponent: () => null,
	__examples: [],
	__namedExamples: {},
};

const components: Rsg.Component[] = [
	{
		name: 'Button',
		visibleName: 'Button',
		slug: 'button',
		hashPath: ['Buttons', 'Button'],
		metadata: {},
		filepath: 'button.tsx',
		pathLine: '',
		hasExamples: false,
		props: { displayName: 'Button' },
	},
	{
		name: 'Input',
		visibleName: 'Input',
		slug: 'input',
		hashPath: ['Forms', 'Input'],
		metadata: {},
		filepath: 'Input.tsx',
		pathLine: '',
		hasExamples: false,
		props: { displayName: 'Input' },
	},
	{
		name: 'Textarea',
		visibleName: 'Textarea',
		slug: 'textarea',
		hashPath: ['Forms', 'Textarea'],
		metadata: {},
		filepath: 'Textarea.tsx',
		pathLine: '',
		hasExamples: false,
		props: { displayName: 'Textarea' },
	},
];

const sections: Rsg.Section[] = [
	{
		exampleMode: 'collapse',
		visibleName: 'Introduction',
		name: 'Introduction',
		hashPath: ['Introduction'],
		slug: 'introduction',
		content: module,
		components: [],
		sections: [],
	},
	{
		exampleMode: 'collapse',
		visibleName: 'Buttons',
		name: 'Buttons',
		hashPath: ['Buttons'],
		slug: 'buttons',
		components: [components[0]],
		sections: [],
	},
	{
		exampleMode: 'collapse',
		visibleName: 'Forms',
		name: 'Forms',
		hashPath: ['Forms'],
		slug: 'forms',
		components: [components[1], components[2]],
		sections: [],
	},
];

it('should filter list when search field contains a query', () => {
	const searchTerm = 'put';
	render(<TableOfContents sections={sections} tocMode="expand" />);
	expect(screen.getAllByTestId('rsg-toc-link').length).toBe(6);
	fireEvent.change(screen.getByLabelText('Filter by name'), {
		target: { value: searchTerm },
	});
	expect(screen.getAllByTestId('rsg-toc-link')).toHaveLength(2);
	expect(screen.getByRole('link', { name: 'Forms' })).toBeInTheDocument();
	expect(screen.getByRole('link', { name: 'Input' })).toBeInTheDocument();
});

it('should filter section names', () => {
	const searchTerm = 'frm';
	const { getByLabelText, getAllByTestId, getByTestId } = render(
		<TableOfContents sections={sections} />
	);
	expect(getAllByTestId('rsg-toc-link').length).toBe(6);
	fireEvent.change(getByLabelText('Filter by name'), { target: { value: searchTerm } });
	expect(getAllByTestId('rsg-toc-link')).toHaveLength(1);
	expect(getByTestId('rsg-toc-link')).toHaveTextContent('Forms');
});

it('should call a callback when input value changed', () => {
	const onSearchTermChange = jest.fn();
	const searchTerm = 'foo';
	const newSearchTerm = 'bar';
	render(
		<TableOfContentsRenderer
			classes={{}}
			searchTerm={searchTerm}
			onSearchTermChange={onSearchTermChange}
		>
			<div>foo</div>
		</TableOfContentsRenderer>
	);

	fireEvent.change(screen.getByLabelText('Filter by name'), { target: { value: newSearchTerm } });

	expect(onSearchTermChange).toBeCalledWith(newSearchTerm);
});

it('should render anchor links when pagePerSection=false', () => {
	render(<TableOfContents pagePerSection={false} sections={sections} />);

	expect(screen.getByRole('link', { name: 'Input' })).toHaveAttribute('href', '#input');
});

it('should render page links when pagePerSection=true', () => {
	render(<TableOfContents pagePerSection sections={sections} />);

	expect(screen.getByRole('link', { name: 'Input' })).toHaveAttribute('href', '/#/Forms/Input');
});

it('should show sections with expand: true when tocMode is collapse', () => {
	const { getByText } = render(
		<TableOfContents
			tocMode="collapse"
			sections={[
				{
					...sections[0],
					sections: [
						{
							exampleMode: 'collapse',
							visibleName: 'Components',
							name: 'Components',
							hashPath: ['Components'],
							slug: 'components',
							expand: true,
							components: [components[0]],
							sections: [
								{
									exampleMode: 'collapse',
									visibleName: '1.1',
									name: '1.1',
									hashPath: ['NewButton'],
									slug: 'new-button',
									sections: [],
									components: [],
								},
								{
									exampleMode: 'collapse',
									visibleName: '2',
									name: '2',
									hashPath: ['Chap'],
									slug: 'chap',
									content: module,
									components: [],
									sections: [
										{
											exampleMode: 'collapse',
											visibleName: '2.1',
											name: '2.1',
											hashPath: ['Chapter-1'],
											slug: 'chapter-1',
											sections: [],
											components: [],
										},
									],
								},
								{
									exampleMode: 'collapse',
									visibleName: '3',
									name: '3',
									href: 'https://react-styleguidist.com',
									hashPath: [],
									slug: 'react-styleguidist',
									sections: [],
									components: [],
								},
							],
						},
					],
				},
			]}
		/>
	);
	expect(getByText('1.1')).toBeVisible();
});
