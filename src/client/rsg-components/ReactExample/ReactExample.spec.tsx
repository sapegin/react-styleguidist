import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import config from '../../../scripts/schemas/config';
import ReactExample from '.';

const compileExample = config.compileExample.default;

const defaultProps = {
	onError: () => {},
	compileExample,
	documentScope: {},
	exampleScope: { react: React },
};

it('should render code', () => {
	render(<ReactExample {...defaultProps} code="import React from 'react'; <button>OK</button>" />);

	expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
});

it('should set initial state with hooks', () => {
	const code = `
import React from 'react';
const [count, setCount] = React.useState(0);
<button>{count}</button>
	`;
	render(<ReactExample {...defaultProps} code={code} />);

	expect(screen.getByRole('button', { name: /0/i })).toBeInTheDocument();
});

it('should update state with hooks', () => {
	const code = `
import React from 'react';
const [count, setCount] = React.useState(0);
<button onClick={() => setCount(count+1)}>{count}</button>
	`;
	render(<ReactExample {...defaultProps} code={code} />);

	fireEvent.click(screen.getByRole('button', { name: /0/i }));

	expect(screen.getByRole('button', { name: /1/i })).toBeInTheDocument();
});
