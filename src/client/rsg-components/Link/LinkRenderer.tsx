import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

const styles = ({ color }: Rsg.Theme) => ({
	link: {
		'&, &:link, &:visited': {
			fontSize: 'inherit',
			color: color.link,
			textDecoration: 'none',
		},
		'&:hover, &:active': {
			isolate: false,
			color: color.linkHover,
			cursor: 'pointer',
		},
	},
});

export interface LinkProps extends JssInjectedProps {
	children?: React.ReactNode;
	className?: string;
	href?: string;
	target?: string;
	onClick?: () => void;
}

export const LinkRenderer: React.FunctionComponent<LinkProps> = ({
	classes,
	children,
	...props
}) => {
	return (
		<a {...props} className={cx(classes.link, props.className)}>
			{children}
		</a>
	);
};

LinkRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	children: PropTypes.node,
	className: PropTypes.string,
	href: PropTypes.string,
};

export default Styled<LinkProps>(styles)(LinkRenderer);
