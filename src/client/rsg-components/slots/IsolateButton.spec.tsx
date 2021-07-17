import React from 'react';
import { render, screen } from '../../test';
import IsolateButton from './IsolateButton';

it('should renderer a link to isolated mode', () => {
	render(<IsolateButton name="Pizza" href="/!#/Pizza" />);

	expect(screen.getByRole('link', { name: 'Open isolated' })).toHaveAttribute('href', '/!#/Pizza');
});

it('should renderer a link home in isolated mode', () => {
	render(<IsolateButton name="Pizza" href="/#pizza" isolated />);

	expect(screen.getByRole('link', { name: 'Show all components' })).toHaveAttribute(
		'href',
		'/#pizza'
	);
});
