import React from 'react';
import PropTypes from 'prop-types';
import ExamplesRenderer from 'rsg-components/Examples/ExamplesRenderer';
import * as Rsg from '../../../typings';

export interface ExamplesRenderer {
	content: Rsg.ExamplesModule;
	componentName: string;
	componentHashPath: string[];
	exampleMode: string;
}

const Examples: React.FunctionComponent<ExamplesRenderer> = ({
	content,
	componentName,
	componentHashPath,
	exampleMode,
}) => {
	const ExampleComponent = content.default;
	return (
		<ExamplesRenderer componentName={componentName}>
			<ExampleComponent
				componentName={componentName}
				componentHashPath={componentHashPath}
				exampleMode={exampleMode}
			/>
		</ExamplesRenderer>
	);
};

Examples.propTypes = {
	content: PropTypes.any.isRequired,
	componentName: PropTypes.string.isRequired,
	componentHashPath: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
	exampleMode: PropTypes.string.isRequired,
};

export default Examples;
