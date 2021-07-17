import React from 'react';
import { render, Provider } from '../../test';
import Ribbon from './Ribbon';

const url = 'http://example.com/';
const text = 'Share the repo';

it('should render ribbon if the ribbon is present in the config', () => {
	const { getByRole } = render(
		<Provider config={{ ribbon: { url } }}>
			<Ribbon />
		</Provider>
	);

	expect(getByRole('link')).toHaveAttribute('href', url);
});

it('should render ribbon with custom text', () => {
	const { getByText } = render(
		<Provider
			config={{
				ribbon: {
					url,
					text,
				},
			}}
		>
			<Ribbon />
		</Provider>
	);

	expect(getByText(text)).toBeInTheDocument();
});

it('should not render anything if the ribbon is not present in the config', () => {
	const { queryByRole } = render(
		<Provider config={{}}>
			<Ribbon />
		</Provider>
	);

	expect(queryByRole('link')).not.toBeInTheDocument();
});
