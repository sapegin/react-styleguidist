import React from 'react';
import { CodeRenderer } from './CodeRenderer';

it('renderer should render code', () => {
	const code = '<button>OK</button>';
	const actual = shallow(<CodeRenderer classes={{}}>{code}</CodeRenderer>);

	expect(actual).toMatchSnapshot();
});
