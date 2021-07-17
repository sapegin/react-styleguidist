import React from 'react';
import { render } from '@testing-library/react';
import Heading from './index';

describe('Heading', () => {
	it('should render a heading according to the level', () => {
		const { container } = render(<Heading level={3}>The heading</Heading>);
		expect(container.querySelector('h3')).toBeInTheDocument();
	});
});
