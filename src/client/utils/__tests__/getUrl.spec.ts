import { getAnchorUrl, getPageUrl, getIsolatedUrl, getSectionUrl } from '../getUrl';

describe('getAnchorUrl', () => {
	test('anchor part of the URL', () => {
		const result = getAnchorUrl('pizza');
		expect(result).toBe('#pizza');
	});
});

describe('getPageUrl', () => {
	test('page URL', () => {
		const result = getPageUrl(['Components', 'Button']);
		expect(result).toBe('/#/Components/Button');
	});

	test('encode parts of URL', () => {
		const result = getPageUrl(['Components', '@foo/bar-documentation']);
		expect(result).toBe('/#/Components/%40foo%2Fbar-documentation');
	});
});

describe('getIsolatedUrl', () => {
	test('page URL', () => {
		const result = getIsolatedUrl(['Components', 'Button']);
		expect(result).toBe('/#!/Components/Button');
	});

	test('page URL with example index (number)', () => {
		const result = getIsolatedUrl(['Components', 'Button'], 11);
		expect(result).toBe('/#!/Components/Button//11');
	});

	test('page URL with example index (number, zero)', () => {
		const result = getIsolatedUrl(['Components', 'Button'], 0);
		expect(result).toBe('/#!/Components/Button//0');
	});

	test('page URL with example index (string)', () => {
		const result = getIsolatedUrl(['Components', 'Button'], 'pizza');
		expect(result).toBe('/#!/Components/Button//pizza');
	});

	test('encode parts of URL', () => {
		const result = getIsolatedUrl(['Components', '@foo/bar-documentation']);
		expect(result).toBe('/#!/Components/%40foo%2Fbar-documentation');
	});
});

describe('getSectionUrl', () => {
	test('page URL', () => {
		const result = getSectionUrl({
			pagePerSection: true,
			slug: 'button',
			hashPath: ['Components', 'Button'],
		});
		expect(result).toBe('/#/Components/Button');
	});

	test('hash URL', () => {
		const result = getSectionUrl({
			pagePerSection: false,
			slug: 'button',
			hashPath: ['Components', 'Button'],
		});
		expect(result).toBe('#button');
	});
});
