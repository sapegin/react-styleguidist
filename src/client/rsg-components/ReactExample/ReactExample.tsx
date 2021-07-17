import React from 'react';
import PropTypes from 'prop-types';
import Wrapper from 'rsg-components/Wrapper';
import evalInContext from '../../utils/evalInContext';
import compileCode from '../../utils/compileCode';
import * as Rsg from '../../../typings';

interface ReactExampleProps {
	code: string;
	documentScope: Record<string, unknown>;
	exampleScope: Record<string, unknown>;
	compileExample: Rsg.SanitizedStyleguidistConfig['compileExample'];
	onError(err: Error): void;
}

export default function ReactExample({
	onError,
	code,
	documentScope,
	exampleScope,
	compileExample,
}: ReactExampleProps) {
	const compiledCode = compileCode(code, compileExample, onError);
	const ExampleComponent = evalInContext(compiledCode, { documentScope, exampleScope });
	return (
		<Wrapper onError={onError}>
			<ExampleComponent />
		</Wrapper>
	);
}

ReactExample.propTypes = {
	code: PropTypes.string.isRequired,
	documentScope: PropTypes.object.isRequired,
	exampleScope: PropTypes.object.isRequired,
	compileExample: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
};
