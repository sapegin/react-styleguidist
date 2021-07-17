import React, { Component } from 'react';
import { render } from '../../test';
import Styled, { JssInjectedProps } from './Styled';

/* eslint-disable react/prefer-stateless-function, react/prop-types */

const styles = () => ({
	foo: {
		color: 'red',
	},
});

interface MockProps extends JssInjectedProps {
	testId?: string;
}

class TestRenderer extends Component<MockProps> {
	public render() {
		return <div className={this.props.classes.foo} data-testid={this.props.testId} />;
	}
}

test('should set displayName', () => {
	const WrappedComponent = Styled(styles)(TestRenderer);
	expect(WrappedComponent.displayName).toBe('Styled(Test)');
});

test('should wrap a component and pass props and classes', () => {
	const WrappedComponent = Styled<MockProps>(styles)(TestRenderer);
	const { getByTestId } = render(<WrappedComponent testId="element" />);
	expect(getByTestId('element')).toHaveAttribute('class', expect.stringMatching(/^rsg--foo-\d+$/));
});
