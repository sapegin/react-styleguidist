import deabsDeep from 'deabsdeep';
import { vol } from 'memfs';
import getExamples from '../getExamples';

jest.mock('fs', () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	return require('memfs').fs;
});

const file = '../pizza.js';
const examplesFile = './Pizza.md';

afterEach(() => {
	vol.reset();
});

test('require an example file if component has example file', () => {
	vol.fromJSON({ [examplesFile]: 'pizza' });

	const result = getExamples(file, examplesFile);
	expect(result && deabsDeep(result).require).toMatchInlineSnapshot(
		`"!!~/src/loaders/mdx-loader.js?component=.%2F..%2Fpizza.js!./Pizza.md"`
	);
});

test('return undefined if component has no example file', () => {
	const result = getExamples(file);
	expect(result).toBeUndefined();
});
