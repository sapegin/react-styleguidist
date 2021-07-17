import React from 'react';
import { render, Provider } from '../../test';
import Preview from '.';

/* eslint-disable no-console */

const code = 'import React from "react"; <button>Code: OK</button>';
const newCode = 'import React from "react"; <button>Code: Cancel</button>';

const defaultProps = {
	code,
	documentScope: {},
	exampleScope: { react: React },
};

const console$error = console.error;
const console$clear = console.clear;

afterEach(() => {
	console.error = console$error;
	console.clear = console$clear;
});

it('should unmount Wrapper component', () => {
	const { unmount, getByTestId } = render(<Preview {...defaultProps} />);

	const node = getByTestId('mountNode');

	expect(node.innerHTML).toMatch('<button');
	unmount();
	expect(node.innerHTML).toBe('');
});

it('should not fail when Wrapper wasn’t mounted', () => {
	const consoleError = jest.fn();
	console.error = consoleError;

	const { unmount, getByTestId } = render(<Preview {...defaultProps} code="pizza" />);

	const node = getByTestId('mountNode');

	expect(
		consoleError.mock.calls.find((call) =>
			call[0].toString().includes('ReferenceError: pizza is not defined')
		)
	).toBeTruthy();

	expect(node.innerHTML).toBe('');
	unmount();
	expect(node.innerHTML).toBe('');
});

it('should update', () => {
	const { rerender, getByText } = render(<Preview {...defaultProps} />);

	expect(getByText('Code: OK')).toBeInTheDocument();

	rerender(<Preview {...defaultProps} code={newCode} />);

	expect(getByText('Code: Cancel')).toBeInTheDocument();
});

it('should handle no code', () => {
	console.error = jest.fn();
	render(<Preview {...defaultProps} code="" />);

	expect(console.error).not.toHaveBeenCalled();
});

it('should handle errors', () => {
	const consoleError = jest.fn();

	console.error = consoleError;
	render(<Preview {...defaultProps} code={'<invalid code'} />);

	expect(
		consoleError.mock.calls.find((call) =>
			call[0].toString().includes('SyntaxError: Unexpected token')
		)
	).toBeTruthy();
});

it('should not clear console on initial mount', () => {
	console.clear = jest.fn();
	render(<Preview {...defaultProps} code={code} />);
	expect(console.clear).toHaveBeenCalledTimes(0);
});

it('should clear console on second mount', () => {
	console.clear = jest.fn();
	render(
		<Provider codeRevision={1}>
			<Preview {...defaultProps} code={code} />
		</Provider>
	);
	expect(console.clear).toHaveBeenCalledTimes(1);
});
