import React from 'react';
import PropTypes from 'prop-types';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import Heading from 'rsg-components/Heading';
import * as Rsg from '../../../typings';

const styles = ({ space }: Rsg.Theme) => ({
	spacing: {
		marginBottom: space[2],
	},
});

export interface MdxHeadingProps extends JssInjectedProps {
	children?: React.ReactNode;
	level?: number;
	id?: string;
}

const MdxHeading: React.FunctionComponent<MdxHeadingProps> = ({ classes, level, children, id }) => {
	return (
		<Heading level={level} id={id} className={classes.spacing}>
			{children}
		</Heading>
	);
};

MdxHeading.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
	children: PropTypes.node,
	id: PropTypes.string,
};

export default Styled<MdxHeadingProps>(styles)(MdxHeading);
