import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Styled from 'rsg-components/Styled';

export const styles = ({ base, link, linkHover, spacing, fonts }) => ({
	heading: {
		color: base,
		position: 'relative',
		overflow: 'visible',
		marginLeft: `-${spacing.space32}`,
		paddingLeft: spacing.space32,
		'&:hover > $anchor': {
			isolate: false,
			visibility: 'visible',
		},
	},
	anchor: {
		position: 'absolute',
		top: '50%',
		transform: 'translateY(-50%)',
		left: spacing.space8,
		display: 'block',
		color: link,
		fontSize: fonts.h3,
		fontWeight: 'normal',
		textDecoration: 'none',
		visibility: 'hidden',
		'&:hover, &:active': {
			isolate: false,
			color: linkHover,
			cursor: 'pointer',
		},
	},
});

export function HeadingRenderer({ classes, children, slug, level, ...props }) {
	const Tag = `h${level}`;
	return (
		<Tag {...props} id={slug} className={cx(classes.heading, props.className)}>
			<a className={classes.anchor} href={`#${slug}`} aria-hidden>#</a>
			{children}
		</Tag>
	);
}

HeadingRenderer.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	classes: PropTypes.object.isRequired,
	slug: PropTypes.string.isRequired,
	level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
};

export default Styled(styles)(HeadingRenderer);
