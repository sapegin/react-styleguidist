import deepfreeze from 'deepfreeze';
import findSection from '../findSection';
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

describe('findSection', () => {
	it('should return top level section', () => {
		const result = findSection(sections, 'General');
		expect(result).toEqual(sections[0]);
	});

	it('should return nested sections', () => {
		const result = findSection(sections, 'Particles');
		expect(result).toEqual(sections?.[0].sections?.[0]);
	});

	it('should return undefined when no sections found', () => {
		const result = findSection(sections, 'Pizza');
		expect(result).toBeFalsy();
	});
});
