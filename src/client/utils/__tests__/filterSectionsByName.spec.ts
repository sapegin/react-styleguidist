import deepfreeze from 'deepfreeze';
import filterSectionsByName from '../filterSectionsByName';
import * as Rsg from '../../../typings';

const sectionsRaw: Rsg.Section[] = [
	{
		name: 'General',
		visibleName: 'General',
		slug: 'general',
		hashPath: ['General'],
		exampleMode: 'collapse',
		components: [],
		sections: [
			{
				name: 'Particles',
				visibleName: 'Particles',
				slug: 'particles',
				hashPath: ['Particles'],
				exampleMode: 'collapse',
				sections: [],
				components: [
					{
						name: 'Button',
						visibleName: 'Button',
						slug: 'button',
						hashPath: ['Components', 'Button'],
						metadata: {},
						filepath: 'button.tsx',
						pathLine: '',
						hasExamples: false,
						props: { displayName: 'Button' },
					},
					{
						name: 'Image',
						visibleName: 'Image',
						slug: 'image',
						hashPath: ['Components', 'Image'],
						metadata: {},
						filepath: 'image.tsx',
						pathLine: '',
						hasExamples: false,
						props: { displayName: 'Image' },
					},
				],
			},
		],
	},
];
const sections = deepfreeze(sectionsRaw);

describe('filterSectionsByName', () => {
	it('should recursively filter sections and components by name', () => {
		const result = filterSectionsByName(sections, 'button');
		expect(result).toEqual([
			expect.objectContaining({
				sections: [
					expect.objectContaining({ components: [expect.objectContaining({ name: 'Button' })] }),
				],
			}),
		]);
	});

	it('should skip sections without matches inside', () => {
		const result = filterSectionsByName(sections, 'general');
		expect(result).toEqual([
			expect.objectContaining({
				name: 'General',
				sections: [],
				components: [],
			}),
		]);
	});

	it('should return empty array if no components of sections match query', () => {
		const result = filterSectionsByName(sections, 'pizza');
		expect(result).toEqual([]);
	});
});
