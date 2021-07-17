import React from 'react';
import PropTypes from 'prop-types';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

export const styles = ({ space, color, fontFamily, fontSize }: Rsg.Theme) => ({
	para: {
		marginTop: 0,
		marginBottom: space[2],
		color: color.base,
		fontFamily: fontFamily.base,
		fontSize: fontSize.text,
		lineHeight: 1.5,
	},
});

export interface ParaProps extends JssInjectedProps {
	semantic?: 'p';
	children?: React.ReactNode;
}

export const ParaRenderer: React.FunctionComponent<ParaProps> = ({
	classes,
	semantic,
	children,
}) => {
	const Tag = semantic || 'div';

	return <Tag className={classes.para}>{children}</Tag>;
};

ParaRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	semantic: PropTypes.oneOf(['p']),
	children: PropTypes.node,
};

export default Styled<ParaProps>(styles)(ParaRenderer);
