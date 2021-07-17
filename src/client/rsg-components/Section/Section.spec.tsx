import React from 'react';
import Section from 'rsg-components/Section';
import { render, Provider } from '../../test';
import * as Rsg from '../../../typings';

const section: Rsg.Section = {
	name: 'A',
	visibleName: 'A',
	slug: 'a',
	hashPath: ['A'],
	usageMode: 'collapse',
	exampleMode: 'collapse',
	sections: [],
	components: [],
};

test('should render nested sections', () => {
	const { getByTestId } = render(
		<Section
			section={{
				name: 'Outer section',
				visibleName: 'Outer section',
				slug: 'outer-section',
				hashPath: ['Outer-section'],
				usageMode: 'collapse',
				exampleMode: 'collapse',
				components: [],
				sections: [
					{
						name: 'Nested section',
						visibleName: 'Nested section',
						slug: 'nested-section',
						hashPath: ['Outer-secton', 'Nested-section'],
						usageMode: 'collapse',
						exampleMode: 'collapse',
						sections: [],
						components: [],
					},
				],
			}}
			depth={3}
		/>
	);
	expect(getByTestId('section-outer-section')).toContainElement(
		getByTestId('section-nested-section')
	);
});

test('should render components inside a section', () => {
	const { getByTestId, getByText } = render(
		<Section
			section={{
				name: 'Components',
				visibleName: 'Components',
				slug: 'components',
				hashPath: ['/#/Compons'],
				usageMode: 'collapse',
				exampleMode: 'collapse',
				sections: [],
				components: [
					{
						name: 'Foo',
						visibleName: 'Foo',
						slug: 'foo',
						hashPath: ['/#o'],
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
						slug: 'bar',
						hashPath: ['/#r'],
						pathLine: 'components/bar.js',
						filepath: 'components/bar.js',
						props: {
							displayName: 'Bar',
						},
						metadata: {},
						hasExamples: false,
					},
				],
			}}
			depth={3}
		/>
	);
	expect(getByTestId('section-components')).toContainElement(getByText('components/foo.js'));
	expect(getByTestId('section-components')).toContainElement(getByText('components/bar.js'));
});

test('should not render section in isolated mode by default', () => {
	const { getByLabelText } = render(<Section section={section} depth={3} />);
	expect(getByLabelText(/open isolated/i)).toBeInTheDocument();
});

test('should render section in isolated mode', () => {
	const { queryByLabelText } = render(
		<Provider isolated>
			<Section section={section} depth={3} />
		</Provider>
	);
	expect(queryByLabelText(/open isolated/i)).toBeNull();
});
