import React from 'react';
import { render, fireEvent } from '../../test';
import Playground from './Playground';

const code = 'import React from "react"; <button>Code: OK</button>';
const newCode = 'import React from "react"; <button>Code: Not OK</button>';
const defaultProps = {
	index: 0,
	componentName: 'name',
	componentHashPath: ['Name'],
	modifiers: {
		index: 1,
	},
	exampleMode: 'collapse',
	documentScope: {},
	exampleScope: { react: React },
	code,
};

it('should update code via props', () => {
	const { rerender, getByText } = render(<Playground {...defaultProps} />);

	expect(getByText('Code: OK')).toBeInTheDocument();

	rerender(<Playground {...defaultProps} code={newCode} />);

	expect(getByText('Code: Not OK')).toBeInTheDocument();
});

it('should open a code editor', () => {
	const { queryByRole, getByText } = render(<Playground {...defaultProps} />);

	expect(queryByRole('textbox')).not.toBeInTheDocument();

	fireEvent.click(getByText(/view code/i));

	expect(queryByRole('textbox')).toBeInTheDocument();
});

it('should not render a code editor if noeditor option passed in example settings', () => {
	const { queryByText } = render(
		<Playground {...defaultProps} modifiers={{ ...defaultProps.modifiers, noeditor: true }} />
	);

	expect(queryByText(/view code/i)).not.toBeInTheDocument();
});

it('should open a code editor by default if showcode=true option passed in example settings', () => {
	const { queryByRole } = render(
		<Playground {...defaultProps} modifiers={{ ...defaultProps.modifiers, showcode: true }} />
	);

	expect(queryByRole('textbox')).toBeInTheDocument();
});

it('should open a code editor by default if exampleMode="expand" option specified in style guide config', () => {
	const { queryByRole } = render(<Playground {...defaultProps} exampleMode="expand" />);

	expect(queryByRole('textbox')).toBeInTheDocument();
});

it('showcode option in example settings should overwrite style guide config option', () => {
	const { queryByRole } = render(
		<Playground
			{...defaultProps}
			exampleMode="expand"
			modifiers={{ ...defaultProps.modifiers, showcode: false }}
		/>
	);

	expect(queryByRole('textbox')).not.toBeInTheDocument();
});

it('should not include padded class if padded option is not passed in example settings', () => {
	const { getByTestId } = render(
		<Playground {...defaultProps} modifiers={{ ...defaultProps.modifiers, padded: false }} />
	);

	expect(getByTestId('preview-wrapper')).not.toHaveAttribute(
		'class',
		expect.stringContaining('rsg--padded-')
	);
});

it('should include padded class if padded option is passed in example settings', () => {
	const { getByTestId } = render(
		<Playground {...defaultProps} modifiers={{ ...defaultProps.modifiers, padded: true }} />
	);

	expect(getByTestId('preview-wrapper')).toHaveAttribute(
		'class',
		expect.stringContaining('rsg--padded-')
	);
});
