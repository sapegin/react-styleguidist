import deepfreeze from 'deepfreeze';
import processSections from '../processSections';
import * as Rsg from '../../../typings';

const sectionsRaw: Rsg.RawSection[] = [
	{
		slug: 'section-untitiled',
		exampleMode: 'collapse',
		sections: [
			{
				exampleMode: 'collapse',
				name: 'Components',
				slug: 'components',
				sections: [],
				components: [
					{
						slug: 'button',
						filepath: './button.tsx',
						pathLine: '',
						hasExamples: false,
						props: {
							displayName: 'Button',
						},
						metadata: {},
					},
				],
			},
		],
		components: [],
	},
];
const sections = deepfreeze(sectionsRaw);

describe('processSections', () => {
	test('recursively process all sections and components', () => {
		const result = processSections(sections);
		expect(result).toEqual([
			expect.objectContaining({
				sections: [
					expect.objectContaining({
						components: [
							expect.objectContaining({ name: 'Button', hashPath: ['Components', 'Button'] }),
						],
					}),
				],
			}),
		]);
	});

	test('set props on each section', () => {
		const result = processSections(sections);
		expect(result).toEqual([
			expect.objectContaining({
				name: '',
				visibleName: '',
				hashPath: [],
				externalLink: false,
				components: [],
				sections: [
					expect.objectContaining({
						name: 'Components',
						visibleName: 'Components',
						hashPath: ['Components'],
					}),
				],
			}),
		]);
	});

	test('set external link flag when section has a href', () => {
		const result = processSections([{ ...sections[0], href: 'https://example.com' }]);
		expect(result).toEqual([
			expect.objectContaining({
				externalLink: true,
			}),
		]);
	});
});
