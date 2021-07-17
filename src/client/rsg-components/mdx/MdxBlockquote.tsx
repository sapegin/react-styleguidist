import React from 'react';
import PropTypes from 'prop-types';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

const styles = ({ space, color, fontSize, fontFamily }: Rsg.Theme) => ({
	blockquote: {
		margin: [[space[2], space[4]]],
		padding: 0,
		color: color.base,
		fontFamily: fontFamily.base,
		fontSize: fontSize.base,
		lineHeight: 1.5,
	},
});

export interface MdxBlockquote extends JssInjectedProps {
	children?: React.ReactNode;
}

export const MdxBlockquote: React.FunctionComponent<MdxBlockquote> = ({ classes, children }) => {
	return <blockquote className={classes.blockquote}>{children}</blockquote>;
};

MdxBlockquote.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	children: PropTypes.node,
};

export default Styled<MdxBlockquote>(styles)(MdxBlockquote);
