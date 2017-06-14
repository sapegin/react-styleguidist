import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';
import Markdown from 'rsg-components/Markdown';

const styles = ({ color, fontSize, fontFamily, space }) => ({
	root: {
		marginBottom: space[6],
	},
	header: {
		marginBottom: space[3],
	},
	tabs: {
		marginBottom: space[3],
	},
	tabButtons: {
		marginBottom: space[1],
	},
	pathLine: {
		fontFamily: fontFamily.monospace,
		color: color.light,
		fontSize: fontSize.small,
	},
	docs: {
		color: color.base,
		fontSize: fontSize.text,
	},
});

export function ReactComponentRenderer({
	classes,
	name,
	heading,
	pathLine,
	description,
	docs,
	examples,
	tabButtons,
	tabBody,
}) {
	return (
		<div className={classes.root} id={name + '-container'}>
			<header className={classes.header}>
				{heading}
				<div className={classes.pathLine}><Markdown text={pathLine} /></div>
			</header>
			{(description || docs) &&
				<div className={classes.docs}>
					{description}
					{docs}
				</div>}
			{tabButtons &&
				<div className={classes.tabs}>
					<div className={classes.tabButtons}>{tabButtons}</div>
					{tabBody}
				</div>}
			{examples}
		</div>
	);
}

ReactComponentRenderer.propTypes = {
	classes: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
	heading: PropTypes.node.isRequired,
	pathLine: PropTypes.string.isRequired,
	tabButtons: PropTypes.node,
	tabBody: PropTypes.node,
	description: PropTypes.node,
	docs: PropTypes.node,
	examples: PropTypes.node,
	isolated: PropTypes.bool,
};

export default Styled(styles)(ReactComponentRenderer);
