import React from 'react';
import PropTypes from 'prop-types';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import Argument, { ArgumentProps } from 'rsg-components/Argument';
import Heading from 'rsg-components/Heading';
import * as Rsg from '../../../typings';

export const styles = ({ space }: Rsg.Theme) => ({
	root: {
		marginBottom: space[2],
		fontSize: 'inherit',
	},
	headingWrapper: {
		marginBottom: space[0],
	},
});

interface ArgumentsProps extends JssInjectedProps {
	heading?: boolean;
	args: ArgumentProps[];
}

export const ArgumentsRenderer: React.FunctionComponent<ArgumentsProps> = ({
	classes,
	args,
	heading,
}) => {
	if (args.length === 0) {
		return null;
	}

	return (
		<div className={classes.root}>
			{heading && (
				<div className={classes.headingWrapper}>
					<Heading level={5}>Arguments</Heading>
				</div>
			)}
			{args.map((arg) => (
				<Argument key={arg.name} {...arg} />
			))}
		</div>
	);
};

ArgumentsRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	args: PropTypes.array.isRequired,
	heading: PropTypes.bool,
};

export default Styled<ArgumentsProps>(styles)(ArgumentsRenderer);
