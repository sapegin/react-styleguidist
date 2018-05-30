import React from 'react';
import PropTypes from 'prop-types';
import MdFullscreen from 'react-icons/lib/md/fullscreen';
import MdFullscreenExit from 'react-icons/lib/md/fullscreen-exit';
import ToolbarButton from 'rsg-components/ToolbarButton';
import getUrl from '../../utils/getUrl';

const IsolateButton = ({ slug, example, isolated }) =>
	isolated ? (
		<ToolbarButton href={getUrl({ anchor: true, slug: '/' })} title="Show all components">
			<MdFullscreenExit />
		</ToolbarButton>
	) : (
		<ToolbarButton href={getUrl({ slug, example, isolated: true })} title="Open isolated">
			<MdFullscreen />
		</ToolbarButton>
	);

IsolateButton.propTypes = {
	slug: PropTypes.string.isRequired,
	example: PropTypes.number,
	isolated: PropTypes.bool,
};

export default IsolateButton;
