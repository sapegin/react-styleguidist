import getImportsMap from '../getImportsMap';

test('find import statements in code', () => {
	expect(getImportsMap(`import A from 'pizza'; import { A as X, B } from 'lunch';`)).toEqual({
		A: 'pizza',
		B: 'lunch',
		X: 'lunch',
	});
});
