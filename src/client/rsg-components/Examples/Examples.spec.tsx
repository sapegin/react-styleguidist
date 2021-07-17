/* eslint-disable @typescript-eslint/naming-convention */

import React from 'react';
import { render } from '@testing-library/react';
import Examples from '.';
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

test('should render passed examples component', () => {
	const { getByText } = render(
		<Examples
			content={module}
			componentName="button"
			componentHashPath={['Button']}
			exampleMode="collapse"
		/>
	);
	expect(getByText(/button\s*\/\s*collapse/i)).toBeInTheDocument();
});
