import React from 'react';
import { render, within } from '../../test';
import StyleGuide, { StyleGuideProps } from './StyleGuide';
import slots from '../slots';
import * as Rsg from '../../../typings';

const sections: Rsg.Section[] = [
	{
		exampleMode: 'collapse',
		usageMode: 'collapse',
		name: 'Section',
		visibleName: 'Section',
		slug: 'section',
		hashPath: ['Section'],
		sections: [],
		components: [
			{
				name: 'Foo',
				visibleName: 'Foo',
				hashPath: ['Foo'],
				slug: 'foo',
				pathLine: 'components/foo.js',
				filepath: 'components/foo.js',
				props: {
					displayName: 'Foo',
				},
				metadata: {},
				hasExamples: false,
			},
			{
				name: 'Bar',
				visibleName: 'Bar',
				hashPath: ['Bar'],
				slug: 'bar',
				pathLine: 'components/bar.js',
				filepath: 'components/bar.js',
				props: {
					displayName: 'Bar',
				},
				metadata: {},
				hasExamples: false,
			},
		],
	},
];

const config = {
	title: 'HelloStyleGuide',
	version: '1.0.0',
	showSidebar: true,
	pagePerSection: false,
} as Rsg.ProcessedStyleguidistConfig;

const defaultProps: StyleGuideProps = {
	codeRevision: 1,
	cssRevision: '1',
	config,
	pagePerSection: false,
	sections: [],
	allSections: [],
	slots: slots(),
	isolated: false,
	patterns: ['components/**.js'],
};

test('should render components', () => {
	const { getByText } = render(
		<StyleGuide {...defaultProps} sections={sections} allSections={sections} />
	);
	expect(getByText('components/foo.js')).toBeInTheDocument();
	expect(getByText('components/bar.js')).toBeInTheDocument();
});

test('should render welcome screen', () => {
	const { getByText } = render(<StyleGuide {...defaultProps} welcomeScreen />);
	expect(getByText('Welcome to React Styleguidist!')).toBeInTheDocument();
});

test('should render a sidebar if showSidebar is not set', () => {
	const { getByTestId } = render(
		<StyleGuide {...defaultProps} sections={sections} allSections={sections} />
	);
	const sidebar = within(getByTestId('sidebar'));
	const links = sidebar.getAllByRole('link');
	expect(links.map((node: any) => node.href)).toEqual([
		'http://localhost/#foo',
		'http://localhost/#bar',
	]);
	expect(links.map((node) => node.textContent)).toEqual(['Foo', 'Bar']);
});

test('should not render a sidebar if showSidebar is false', () => {
	const { queryByTestId } = render(
		<StyleGuide
			{...defaultProps}
			config={{
				...config,
				showSidebar: false,
			}}
			sections={sections}
			allSections={sections}
		/>
	);
	expect(queryByTestId('sidebar')).not.toBeInTheDocument();
});

test('should not render a sidebar in isolated mode', () => {
	const { queryByTestId } = render(
		<StyleGuide {...defaultProps} sections={sections} allSections={sections} isolated />
	);
	expect(queryByTestId('sidebar')).not.toBeInTheDocument();
});

test('should render a sidebar if pagePerSection is true', () => {
	const { getByTestId } = render(
		<StyleGuide {...defaultProps} sections={sections} allSections={sections} pagePerSection />
	);
	expect(getByTestId('sidebar')).toBeInTheDocument();
});

describe('error handling', () => {
	const console$error = console.error;
	beforeAll(() => {
		console.error = jest.fn();
	});
	afterAll(() => {
		console.error = console$error;
	});
	test('should render an error when componentDidCatch() is triggered', () => {
		const { getByText } = render(
			<StyleGuide {...defaultProps} patterns={null as any} welcomeScreen />
		);
		expect(getByText(/Page not found/i)).toBeInTheDocument();
	});
});
