import React from 'react';
import { render, screen } from '../../test';
import Components from './Components';
import { ExampleModes, UsageModes } from '../../consts';
import * as Rsg from '../../../typings';

const exampleMode = ExampleModes.collapse;
const usageMode = UsageModes.collapse;
const components: Rsg.Component[] = [
	{
		name: 'Foo',
		visibleName: 'Foo',
		hashPath: ['Foo'],
		slug: 'foo',
		pathLine: 'components/foo.js',
		filepath: 'components/foo.js',
		hasExamples: false,
		metadata: {},
		props: {
			displayName: 'Foo',
			description: 'Foo foo',
		},
	},
	{
		name: 'Bar',
		visibleName: 'Bar',
		hashPath: ['Bar'],
		slug: 'bar',
		pathLine: 'components/bar.js',
		filepath: 'components/bar.js',
		hasExamples: false,
		metadata: {},
		props: {
			displayName: 'Bar',
			description: 'Bar bar',
		},
	},
];

it('should render components list', () => {
	render(
		<Components components={components} exampleMode={exampleMode} usageMode={usageMode} depth={3} />
	);

	expect(screen.getByText(/components\/foo\.js/)).toBeInTheDocument();
	expect(screen.getByText(/components\/bar\.js/)).toBeInTheDocument();
});
