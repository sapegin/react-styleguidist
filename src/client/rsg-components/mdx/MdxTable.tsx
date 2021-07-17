import React from 'react';
import PropTypes from 'prop-types';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

const styles = ({ space }: Rsg.Theme) => ({
	table: {
		marginTop: 0,
		marginBottom: space[2],
		borderCollapse: 'collapse',
	},
});

export interface MdxTableProps extends JssInjectedProps {
	children?: React.ReactNode;
}

export const MdxTable: React.FunctionComponent<MdxTableProps> = ({ classes, children }) => {
	return <table className={classes.table}>{children}</table>;
};

MdxTable.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	children: PropTypes.node,
};

export default Styled<MdxTableProps>(styles)(MdxTable);
