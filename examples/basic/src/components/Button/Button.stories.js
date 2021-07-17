import React from 'react';
import Button from './Button';

const test = 'test';

export const basic = () => <Button>Push Me</Button>;

export const pink = () => (
	<Button size="large" color="deeppink">
		Click Me, {test}
	</Button>
);
