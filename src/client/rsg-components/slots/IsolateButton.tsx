import React from 'react';
import PropTypes from 'prop-types';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import ToolbarButton from 'rsg-components/ToolbarButton';

export interface IsolateButtonProps {
	name: string;
	href: string;
	isolated?: boolean;
	exampleIndex?: number | string;
}

const IsolateButton = ({ name, href, isolated, exampleIndex }: IsolateButtonProps) => {
	// TODO: Rewrite Cypress tests to use Cypress Testing Library and remove this ID
	const testID = exampleIndex ? `${name}-${exampleIndex}-isolate-button` : `${name}-isolate-button`;

	return isolated ? (
		<ToolbarButton href={href} title="Show all components" testId={testID}>
			<MdFullscreenExit />
		</ToolbarButton>
	) : (
		<ToolbarButton href={href} title="Open isolated" testId={testID}>
			<MdFullscreen />
		</ToolbarButton>
	);
};

IsolateButton.propTypes = {
	name: PropTypes.string.isRequired,
	href: PropTypes.string.isRequired,
	isolated: PropTypes.bool,
	exampleIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default IsolateButton;
