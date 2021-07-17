import React from 'react';
import PropTypes from 'prop-types';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

const styles = ({ color }: Rsg.Theme) => ({
	thead: {
		borderBottom: [[1, color.border, 'solid']],
	},
});

export interface MdxTableHeadProps extends JssInjectedProps {
	children?: React.ReactNode;
}

export const MdxTableHead: React.FunctionComponent<MdxTableHeadProps> = ({ classes, children }) => {
	return <thead className={classes.thead}>{children}</thead>;
};

MdxTableHead.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	children: PropTypes.node,
};

export default Styled<MdxTableHeadProps>(styles)(MdxTableHead);
