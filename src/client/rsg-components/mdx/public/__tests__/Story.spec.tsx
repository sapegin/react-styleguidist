import { getLocalExampleNameById } from '../Story';

describe('getLocalExampleNameById()', () => {
	test('single word', () => {
		const result = getLocalExampleNameById('foo-bar--name');
		expect(result).toBe('name');
	});

	test('multiple words', () => {
		const result = getLocalExampleNameById('foo-bar--long-long-name');
		expect(result).toBe('longLongName');
	});
});
