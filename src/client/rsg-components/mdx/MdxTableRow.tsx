import React from 'react';
import PropTypes from 'prop-types';

export const MdxTableRow: React.FunctionComponent = ({ children }) => {
	return <tr>{children}</tr>;
};

MdxTableRow.propTypes = {
	children: PropTypes.node,
};

export default MdxTableRow;
