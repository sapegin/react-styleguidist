import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

const styles = ({ space }: Rsg.Theme) => ({
	preContainer: {
		marginTop: 0,
		marginBottom: space[2],
	},
});

export interface PreProps {
	className?: string;
	children?: React.ReactNode;
}

type PrePropsWithClasses = JssInjectedProps & PreProps;

/**
 * This is a container for the interactive playground and static code examples,
 * so we render it using the <div> element. The <pre> element will be added by
 * the MdxCode component in the appropriate place.
 */
export const MdxPre: React.FunctionComponent<PrePropsWithClasses> = ({
	classes,
	className,
	children,
}) => {
	const classNames = cx(className, classes.preContainer);
	return <div className={classNames}>{children}</div>;
};

MdxPre.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	className: PropTypes.string,
	children: PropTypes.node,
};

export default Styled<PrePropsWithClasses>(styles)(MdxPre);
