import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

const styles = ({ space, color, borderRadius }: Rsg.Theme) => ({
	container: {
		padding: space[2],
		backgroundColor: color.codeBackground,
		border: [[1, color.codeBackground, 'solid']],
		borderRadius,
	},
});

export interface PreProps {
	className?: string;
	children?: React.ReactNode;
}

type PrePropsWithClasses = JssInjectedProps & PreProps;

/**

 */
export const MdxCodeStatic: React.FunctionComponent<PrePropsWithClasses> = ({
	classes,
	className,
	children,
}) => {
	const classNames = cx(className, classes.container);
	return <div className={classNames}>{children}</div>;
};

MdxCodeStatic.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	className: PropTypes.string,
	children: PropTypes.node,
};

export default Styled<PrePropsWithClasses>(styles)(MdxCodeStatic);
