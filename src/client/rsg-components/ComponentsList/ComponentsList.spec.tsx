/* eslint-disable compat/compat */
import React from 'react';
import { render, fireEvent, Provider } from '../../test';
import ComponentsList from './ComponentsList';
import * as Rsg from '../../../typings';

const defaultItemProps = {
	heading: false,
	shouldOpenInNewTab: false,
	selected: false,
	initialOpen: false,
	forcedOpen: false,
	sections: [],
	components: [],
};

const context = { config: { pagePerSection: false, tocMode: 'collapse' } } as const;

it('should not render any links when the list is empty', () => {
	const { queryAllByRole } = render(<ComponentsList items={[]} />);

	expect(queryAllByRole('link')).toHaveLength(0);
});

it('should ignore items without visibleName', () => {
	const components: Rsg.TOCItem[] = [
		{
			...defaultItemProps,
			name: 'Button',
			visibleName: 'Button',
			slug: 'button',
			href: '#button',
		},
		{
			...defaultItemProps,
			name: 'Input',
			visibleName: '',
			slug: 'input',
			href: '#input',
		},
	];

	const { getAllByRole } = render(<ComponentsList items={components} />);

	expect(Array.from(getAllByRole('link')).map((node) => (node as HTMLAnchorElement).href)).toEqual([
		'http://localhost/#button',
	]);
});

it('should show content of items that are open and not what is closed', () => {
	const components: Rsg.TOCItem[] = [
		{
			...defaultItemProps,
			visibleName: 'Button',
			name: 'Button',
			slug: 'button',
			href: '#buttton',
			content: <div data-testid="content">Content for Button</div>,
		},
		{
			...defaultItemProps,
			visibleName: 'Input',
			name: 'Input',
			slug: 'input',
			href: '#input',
			content: <div data-testid="content">Content for Input</div>,
		},
	];

	const { getAllByTestId, getByText } = render(
		<Provider {...context}>
			<ComponentsList items={components} />
		</Provider>
	);

	fireEvent.click(getByText('Button'));

	expect(
		Array.from(getAllByTestId('content')).map((node) => (node as HTMLDivElement).innerHTML)
	).toEqual(['Content for Button']);
});

it('should show content of initialOpen items even if they are not active', () => {
	const components: Rsg.TOCItem[] = [
		{
			...defaultItemProps,
			visibleName: 'Button',
			name: 'Button',
			slug: 'button',
			href: '#button',
			content: <div data-testid="content">Content for Button</div>,
		},
		{
			...defaultItemProps,
			visibleName: 'Input',
			name: 'Input',
			slug: 'input',
			href: '#input',
			content: <div data-testid="content">Content for Input</div>,
			initialOpen: true,
		},
	];

	const { getAllByTestId, getByText } = render(<ComponentsList items={components} />);

	fireEvent.click(getByText('Button'));

	expect(
		Array.from(getAllByTestId('content')).map((node) => (node as HTMLDivElement).innerHTML)
	).toEqual(['Content for Button', 'Content for Input']);
});

it('should show content of forcedOpen items even if they are initially collapsed', () => {
	const components: Rsg.TOCItem[] = [
		{
			...defaultItemProps,
			visibleName: 'Button',
			name: 'Button',
			slug: 'button',
			href: '#button',
			content: <div data-testid="content">Content for Button</div>,
			initialOpen: true,
		},
		{
			...defaultItemProps,
			visibleName: 'Input',
			name: 'Input',
			slug: 'input',
			href: '#input',
			content: <div data-testid="content">Content for Input</div>,
			initialOpen: true,
			forcedOpen: true,
		},
	];

	const { getAllByTestId, getByText } = render(
		<Provider {...context}>
			<ComponentsList items={components} />
		</Provider>
	);

	fireEvent.click(getByText('Input'));

	expect(
		Array.from(getAllByTestId('content')).map((node) => (node as HTMLDivElement).innerHTML)
	).toEqual(['Content for Button', 'Content for Input']);
});
