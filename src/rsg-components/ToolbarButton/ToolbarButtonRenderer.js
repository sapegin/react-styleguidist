import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'rsg-components/Styled';
import cx from 'classnames';

export const styles = ({ space, color }) => ({
	button: {
		padding: 2, // Increase clickable area a bit
		color: color.light,
		background: 'transparent',
		transition: 'color 750ms ease-out',
		cursor: 'pointer',
		'&:hover, &:focus': {
			isolate: false,
			color: color.linkHover,
			transition: 'color 150ms ease-in',
		},
		'&:focus': {
			isolate: false,
			outline: [[1, 'dotted', color.linkHover]],
		},
		'& + &': {
			isolate: false,
			marginLeft: space[1],
		},
		// Style react-icons icon passed as children
		'& svg': {
			width: space[3],
			height: space[3],
			color: 'currentColor',
			cursor: 'pointer',
		},
	},
	small: {
		'& svg': {
			width: space[2],
			height: space[2],
		},
	},
});

export function ToolbarButtonRenderer({
	classes,
	className,
	onClick,
	href,
	title,
	children,
	small,
}) {
	const classNames = cx(classes.button, className, {
		[classes.small]: small,
	});

	if (href !== undefined) {
		return (
			<a href={href} title={title} className={classNames}>
				{children}
			</a>
		);
	}

	return (
		<button type="button" onClick={onClick} title={title} className={classNames}>
			{children}
		</button>
	);
}

ToolbarButtonRenderer.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string,
	href: PropTypes.string,
	onClick: PropTypes.func,
	title: PropTypes.string,
	children: PropTypes.node,
	small: PropTypes.bool,
};

export default Styled(styles)(ToolbarButtonRenderer);
