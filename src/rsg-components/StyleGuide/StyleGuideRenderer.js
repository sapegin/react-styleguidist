import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'rsg-components/Logo';
import Markdown from 'rsg-components/Markdown';
import Styled from 'rsg-components/Styled';
import cx from 'classnames';

const styles = ({ font, base, light, sidebarWidth, border, baseBackground, codeBackground, small, spacing }) => ({
	root: {
		color: base,
		backgroundColor: baseBackground,
	},
	hasSidebar: {
		paddingLeft: sidebarWidth,
		[small]: {
			paddingLeft: 0,
		},
	},
	content: {
		maxWidth: 1000,
		padding: [[spacing.space16, spacing.space32]],
		margin: [[0, 'auto']],
		[small]: {
			padding: spacing.space16,
		},
		display: 'block',
	},
	sidebar: {
		backgroundColor: codeBackground,
		border: [[border, 'solid']],
		borderWidth: [[0, 1, 0, 0]],
		position: 'fixed',
		top: 0,
		left: 0,
		bottom: 0,
		width: sidebarWidth,
		overflow: 'auto',
		[small]: {
			position: 'static',
			width: 'auto',
			borderWidth: [[1, 0, 0, 0]],
			paddingBottom: spacing.space4,
		},
	},
	logo: {
		padding: spacing.space16,
		borderBottom: [[1, border, 'solid']],
	},
	footer: {
		display: 'block',
		color: light,
		fontFamily: font,
		fontSize: 12,
	},
});

export function StyleGuideRenderer({
	classes,
	title,
	homepageUrl,
	children,
	toc,
	hasSidebar,
}) {
	return (
		<div className={cx(classes.root, hasSidebar && classes.hasSidebar)}>
			<main className={classes.content}>
				{children}
				<footer className={classes.footer}>
					<Markdown text={`Generated with [React Styleguidist](${homepageUrl})`} />
				</footer>
			</main>
			{hasSidebar &&
				<div className={classes.sidebar}>
					<div className={classes.logo}>
						<Logo>{title}</Logo>
					</div>
					{toc}
				</div>
			}
		</div>
	);
}

StyleGuideRenderer.propTypes = {
	classes: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	homepageUrl: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	toc: PropTypes.node.isRequired,
	hasSidebar: PropTypes.bool,
};

export default Styled(styles)(StyleGuideRenderer);
