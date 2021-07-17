import React from 'react';
import PropTypes from 'prop-types';
import Pathline from 'rsg-components/Pathline';
import Styled, { JssInjectedProps } from 'rsg-components/Styled';
import * as Rsg from '../../../typings';

const styles = ({ color, fontSize, space }: Rsg.Theme) => ({
	root: {
		marginBottom: space[6],
	},
	header: {
		marginBottom: space[3],
	},
	tabs: {
		marginBottom: space[3],
	},
	tabButtons: {
		marginBottom: space[1],
	},
	tabBody: {
		overflowX: 'auto',
		maxWidth: '100%',
		WebkitOverflowScrolling: 'touch',
	},
	docs: {
		color: color.base,
		fontSize: fontSize.text,
	},
});

interface ReactComponentRendererProps extends JssInjectedProps {
	componentName: string;
	heading: React.ReactNode;
	filepath?: string;
	slug?: string;
	pathLine?: string;
	tabButtons?: React.ReactNode;
	tabBody?: React.ReactNode;
	description?: React.ReactNode;
	docs?: React.ReactNode;
	examples?: React.ReactNode;
	isolated?: boolean;
}

export const ReactComponentRenderer: React.FunctionComponent<ReactComponentRendererProps> = ({
	classes,
	componentName,
	heading,
	pathLine,
	description,
	docs,
	examples,
	tabButtons,
	tabBody,
}) => {
	return (
		<div className={classes.root} data-testid={`${componentName}-container`}>
			<header className={classes.header}>
				{heading}
				{pathLine && <Pathline>{pathLine}</Pathline>}
			</header>
			{(description || docs) && (
				<div className={classes.docs}>
					{description}
					{docs}
				</div>
			)}
			{tabButtons && (
				<div className={classes.tabs}>
					<div className={classes.tabButtons}>{tabButtons}</div>
					<div className={classes.tabBody}>{tabBody}</div>
				</div>
			)}
			{examples}
		</div>
	);
};

ReactComponentRenderer.propTypes = {
	classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
	componentName: PropTypes.string.isRequired,
	heading: PropTypes.node.isRequired,
	filepath: PropTypes.string,
	pathLine: PropTypes.string,
	tabButtons: PropTypes.node,
	tabBody: PropTypes.node,
	description: PropTypes.node,
	docs: PropTypes.node,
	examples: PropTypes.node,
	isolated: PropTypes.bool,
};

export default Styled<ReactComponentRendererProps>(styles)(ReactComponentRenderer);
