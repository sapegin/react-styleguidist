import React, { CSSProperties } from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

const styles = ({ fontSize, fontFamily }: Rsg.Theme) => ({
	highlightPre: {
		margin: 0,
		fontFamily: fontFamily.monospace,
		fontSize: fontSize.small,
		lineHeight: 1.5,
		whiteSpace: 'pre-wrap',
		wordWrap: 'normal',
		tabSize: 2,
		hyphens: 'none',
		overflow: 'auto',
		// react-simple-code-editor sets ponter-events: none on the container,
		// we need to reapply it here
		pointerEvents: 'inherit',
	},
});

export interface PreProps {
	className?: string;
	style?: CSSProperties;
	children?: React.ReactNode;
}

type PrePropsWithClasses = JssInjectedProps & PreProps;

export const MdxHighlightPre: React.FunctionComponent<PrePropsWithClasses> = ({
	classes,
	className,
	style,
	children,
}) => {
	const classNames = cx(className, classes.highlightPre);
	return (
		<pre className={classNames} style={style}>
			{children}
		</pre>
	);
};

MdxHighlightPre.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	className: PropTypes.string,
	children: PropTypes.node,
};

export default Styled<PrePropsWithClasses>(styles)(MdxHighlightPre);
