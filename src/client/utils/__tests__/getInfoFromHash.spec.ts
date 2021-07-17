import getInfoFromHash from '../getInfoFromHash';
import * as Rsg from '../../../typings';

const component: Rsg.Component = {
	name: 'Button',
	visibleName: 'Button',
	slug: 'button',
	hashPath: ['Components', 'Button'],
	metadata: {},
	filepath: 'button.tsx',
	pathLine: '',
	hasExamples: false,
	props: { displayName: 'Button' },
};
const section: Rsg.Section = {
	name: 'Section',
	visibleName: 'Section',
	slug: 'section',
	hashPath: ['Section'],
	exampleMode: 'collapse',
	components: [],
	sections: [],
};
const sectionWrapper: Rsg.Section = {
	...section,
	name: '',
	components: [component],
};

describe('getInfoFromHash', () => {
	test('handle page URLs', () => {
		const result = getInfoFromHash({
			sections: [sectionWrapper],
			hash: '#/Button',
			pagePerSection: true,
		});
		expect(result).toEqual({
			isolated: false,
			hashArray: ['Button'],
			exampleIndex: undefined,
		});
	});

	test('handle isolated URLs', () => {
		const result = getInfoFromHash({
			sections: [sectionWrapper],
			hash: '#!/Button',
			pagePerSection: true,
		});
		expect(result).toEqual({
			isolated: true,
			hashArray: ['Button'],
			exampleIndex: undefined,
		});
	});

	test('return name of the first section by default', () => {
		const result = getInfoFromHash({
			sections: [section],
			hash: '',
			pagePerSection: true,
		});
		expect(result).toEqual({
			isolated: false,
			hashArray: ['Section'],
			exampleIndex: undefined,
		});
	});

	test('return name of the first component by default', () => {
		const result = getInfoFromHash({
			sections: [sectionWrapper],
			hash: '',
			pagePerSection: true,
		});
		expect(result).toEqual({
			isolated: false,
			hashArray: ['Button'],
			exampleIndex: undefined,
		});
	});

	test('return decoded names', () => {
		const result = getInfoFromHash({
			sections: [sectionWrapper],
			hash: '#!/Api%20%E7%BB%84%E4%BB%B6',
			pagePerSection: true,
		});
		expect(result).toEqual({
			isolated: true,
			hashArray: ['Api 组件'],
			exampleIndex: undefined,
		});
	});

	test('return an array of hashes', () => {
		const result = getInfoFromHash({
			sections: [sectionWrapper],
			hash: '#/Documentation/Files/Buttons',
			pagePerSection: true,
		});
		expect(result).toEqual({
			isolated: false,
			hashArray: ['Documentation', 'Files', 'Buttons'],
			exampleIndex: undefined,
		});
	});

	test('extract example index (number)', () => {
		const result = getInfoFromHash({
			sections: [sectionWrapper],
			hash: '#/Documentation/Files/Buttons//5',
			pagePerSection: true,
		});
		expect(result).toEqual({
			isolated: false,
			hashArray: ['Documentation', 'Files', 'Buttons'],
			exampleIndex: 5,
		});
	});

	test('extract example index (string)', () => {
		const result = getInfoFromHash({
			sections: [sectionWrapper],
			hash: '#/Documentation/Files/Buttons//pizza',
			pagePerSection: true,
		});
		expect(result).toEqual({
			isolated: false,
			hashArray: ['Documentation', 'Files', 'Buttons'],
			exampleIndex: 'pizza',
		});
	});

	test('correctly handles leading numbers in hashes', () => {
		const result = getInfoFromHash({
			sections: [sectionWrapper],
			hash: '#/1.Documentation',
			pagePerSection: true,
		});
		expect(result).toEqual({
			isolated: false,
			hashArray: ['1.Documentation'],
			exampleIndex: undefined,
		});
	});
});
