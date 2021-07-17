/* eslint-disable @typescript-eslint/naming-convention */

import React from 'react';
import { render, Provider } from '../../test';
import ReactComponent from './ReactComponent';
import * as Rsg from '../../../typings';

const module: Rsg.ExamplesModule = {
	default: ({ componentName, exampleMode }) => (
		<h1>
			{componentName}/{exampleMode}
		</h1>
	),
	__esModule: true,
	__documentScope: {},
	__exampleScope: {},
	__storiesScope: {},
	__currentComponent: () => null,
	__examples: [],
	__namedExamples: {},
};

const component: Rsg.Component = {
	name: 'Foo',
	visibleName: 'Foo',
	slug: 'foo',
	hashPath: ['Foo'],
	pathLine: 'foo/bar.js',
	props: {
		displayName: 'Bar',
		methods: [],
	},
	metadata: {},
	filepath: 'foo/bar.js',
	hasExamples: false,
};

const componentWithEverything: Rsg.Component = {
	name: 'Foo',
	visibleName: 'Foo',
	slug: 'foo',
	hashPath: ['Foo'],
	pathLine: 'foo/bar.js',
	props: {
		displayName: 'Bar',
		methods: [
			{
				name: 'set',
				params: [
					{
						name: 'newValue',
						description: 'New value for the counter.',
						type: { type: 'NameExpression', name: 'Number' },
					},
				],
				returns: null,
				description: 'Sets the counter to a particular value.',
			},
		],
		content: module,
	},
	metadata: {
		tags: ['one', 'two'],
	},
	filepath: 'foo/bar.js',
	hasExamples: false,
};

test('should render an example placeholder', () => {
	const { getByText } = render(
		<ReactComponent component={component} depth={3} exampleMode="collapse" usageMode="collapse" />
	);
	expect(getByText(/add examples to this component/i)).toBeInTheDocument();
});

test('should render example component', () => {
	const { getByText } = render(
		<ReactComponent
			component={componentWithEverything}
			depth={3}
			exampleMode="collapse"
			usageMode="collapse"
		/>
	);
	expect(getByText(/Foo\/collapse/i)).toBeInTheDocument();
});

test('should render usage closed by default when usageMode is "collapse"', () => {
	const { getByText } = render(
		<ReactComponent
			component={componentWithEverything}
			depth={3}
			exampleMode="collapse"
			usageMode="collapse"
		/>
	);
	expect(getByText(/props & methods/i)).toHaveAttribute('aria-pressed', 'false');
});

test('should render usage opened by default when usageMode is "expand"', () => {
	const { getByText } = render(
		<ReactComponent
			component={componentWithEverything}
			depth={3}
			exampleMode="collapse"
			usageMode="expand"
		/>
	);
	expect(getByText(/props & methods/i)).toHaveAttribute('aria-pressed', 'true');
});

test('should not render usage when usageMode is "hide"', () => {
	const { queryByText } = render(
		<ReactComponent
			component={componentWithEverything}
			depth={3}
			exampleMode="collapse"
			usageMode="hide"
		/>
	);
	expect(queryByText(/props & methods/i)).not.toBeInTheDocument();
});

// TODO: Why do we need this? When component can have no name?
test('should not render anything when component has no name', () => {
	const { container } = render(
		<ReactComponent
			component={{ slug: 'foo', props: {} } as any}
			depth={3}
			exampleMode="collapse"
			usageMode="collapse"
		/>
	);
	expect(container).toBeEmptyDOMElement();
});

test('should not render component in isolated mode by default', () => {
	const { getByLabelText } = render(
		<ReactComponent component={component} depth={3} exampleMode="collapse" usageMode="collapse" />
	);
	expect(getByLabelText(/open isolated/i)).toBeInTheDocument();
});

test('should render component in isolated mode', () => {
	const { getByLabelText } = render(
		<Provider isolated>
			<ReactComponent component={component} depth={3} exampleMode="collapse" usageMode="collapse" />
		</Provider>
	);
	expect(getByLabelText(/show all components/i)).toBeInTheDocument();
});

test('should prefix description with deprecated label when @deprecated is present in tags', () => {
	const { getByText } = render(
		<ReactComponent
			component={{
				...component,
				props: {
					...component.props,
					tags: {
						deprecated: [
							{
								title: 'deprecated',
								description: 'I am deprecated',
							},
						],
					},
				},
			}}
			depth={3}
			exampleMode="collapse"
			usageMode="collapse"
		/>
	);
	expect(getByText(/deprecated:/i)).toBeInTheDocument();
});
