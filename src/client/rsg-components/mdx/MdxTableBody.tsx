import React from 'react';
import PropTypes from 'prop-types';

export const MdxTableBody: React.FunctionComponent = ({ children }) => {
	return <tbody>{children}</tbody>;
};

MdxTableBody.propTypes = {
	children: PropTypes.node,
};

export default MdxTableBody;
