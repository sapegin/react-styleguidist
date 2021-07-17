import React from 'react';
import { mount } from 'enzyme';
import SectionHeadingRenderer from './SectionHeadingRenderer';

describe('SectionHeading', () => {
	const FakeToolbar = () => <div>Fake toolbar</div>;

	test('render a section heading', () => {
		const actual = mount(
			<SectionHeadingRenderer id="section" href="/section" depth={2} toolbar={<FakeToolbar />}>
				A Section
			</SectionHeadingRenderer>
		);

		expect(actual.find('h2')).toMatchSnapshot();
	});

	test('render a deprecated section heading', () => {
		const actual = mount(
			<SectionHeadingRenderer
				id="section"
				href="/section"
				depth={2}
				toolbar={<FakeToolbar />}
				deprecated
			>
				A Section
			</SectionHeadingRenderer>
		);

		expect(actual.find('h2')).toMatchSnapshot();
	});

	test('prevent the heading level from exceeding the maximum allowed by the Heading component', () => {
		const actual = mount(
			<SectionHeadingRenderer id="section" href="/section" depth={7} toolbar={<FakeToolbar />}>
				A Section
			</SectionHeadingRenderer>
		);

		expect(actual.find('h6')).toHaveLength(1);
	});
});
