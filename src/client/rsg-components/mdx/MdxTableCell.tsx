import React from 'react';
import PropTypes from 'prop-types';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

const styles = ({ space, color, fontSize, fontFamily }: Rsg.Theme) => ({
	td: {
		padding: [[space[0], space[2], space[0], 0]],
		fontFamily: fontFamily.base,
		fontSize: fontSize.base,
		color: color.base,
		lineHeight: 1.5,
	},
	th: {
		composes: '$td',
		fontWeight: 'bold',
	},
});

export interface MdxTableCellProps extends JssInjectedProps {
	children?: React.ReactNode;
	header?: boolean;
}

export const MdxTableCell: React.FunctionComponent<MdxTableCellProps> = ({
	classes,
	header,
	children,
}) => {
	if (header) {
		return <th className={classes.th}>{children}</th>;
	}

	return <td className={classes.td}>{children}</td>;
};

MdxTableCell.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	header: PropTypes.bool,
	children: PropTypes.node,
};
MdxTableCell.defaultProps = {
	header: false,
};

export default Styled<MdxTableCellProps>(styles)(MdxTableCell);
