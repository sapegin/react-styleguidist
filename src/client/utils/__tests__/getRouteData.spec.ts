/* eslint-disable @typescript-eslint/naming-convention */

import deepfreeze from 'deepfreeze';
import getRouteData from '../getRouteData';
import * as Rsg from '../../../typings';

const module: Rsg.ExamplesModule = {
	default: () => null,
	__esModule: true,
	__documentScope: {},
	__exampleScope: {},
	__storiesScope: {},
	__currentComponent: () => null,
	__examples: [],
	__namedExamples: {},
};

const sections: Rsg.Section[] = deepfreeze([
	{
		name: '',
		visibleName: '',
		slug: '',
		hashPath: [],
		exampleMode: 'collapse',
		components: [],
		sections: [
			{
				name: 'Components',
				visibleName: 'Components',
				slug: 'components',
				hashPath: ['Components'],
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
				sections: [],
				exampleMode: 'collapse',
				usageMode: 'collapse',
				sectionDepth: 0,
			},
			{
				name: 'Section',
				visibleName: 'Section',
				slug: 'section',
				hashPath: ['Section'],
				content: module,
				components: [],
				sections: [],
				exampleMode: 'collapse',
				usageMode: 'collapse',
				sectionDepth: 0,
			},
			{
				name: 'Buttons',
				visibleName: 'Buttons',
				slug: 'buttons',
				hashPath: ['Buttons'],
				components: [
					{
						name: 'Label',
						visibleName: 'Label',
						slug: 'label',
						hashPath: ['Buttons', 'Label'],
						metadata: {},
						props: { displayName: 'Label' },
						filepath: 'label.tsx',
						pathLine: '',
						hasExamples: false,
					},
					{
						name: 'RandomButton',
						visibleName: 'RandomButton',
						slug: 'randombutton',
						hashPath: ['Buttons', 'RandomButton'],
						metadata: {},
						props: { displayName: 'RandomButton' },
						filepath: 'randombutton.tsx',
						pathLine: '',
						hasExamples: false,
					},
				],
				sections: [],
				exampleMode: 'collapse',
				usageMode: 'collapse',
				sectionDepth: 2,
			},
		],
	},
]);

describe('getRouteData', () => {
	test('return one component', () => {
		const result = getRouteData(sections, '#/Components/Button');
		expect(result).toEqual({
			isolated: false,
			exampleIndex: undefined,
			sections: [
				expect.objectContaining({
					components: [expect.objectContaining({ name: 'Button' })],
				}),
			],
		});
	});

	test('return one section', () => {
		const result = getRouteData(sections, '#/Section');
		expect(result).toEqual({
			isolated: false,
			exampleIndex: undefined,
			sections: [
				expect.objectContaining({
					name: 'Section',
					components: [],
					sections: [],
				}),
			],
		});
	});

	test('return isolated flag for isolated mode URLs', () => {
		const result = getRouteData(sections, '#!/Components/Button');
		expect(result).toEqual(
			expect.objectContaining({
				isolated: true,
				exampleIndex: undefined,
				sections: [
					expect.objectContaining({
						components: [expect.objectContaining({ name: 'Button' })],
					}),
				],
			})
		);
	});

	test('return example index for a component', () => {
		const result = getRouteData(sections, '#!/Components/Button//1');
		expect(result).toEqual(
			expect.objectContaining({
				isolated: true,
				exampleIndex: 1,
				sections: [
					expect.objectContaining({
						components: [expect.objectContaining({ name: 'Button' })],
					}),
				],
			})
		);
	});

	test('return example index as a string for a component', () => {
		const result = getRouteData(sections, '#!/Components/Button//basic');
		expect(result).toEqual(
			expect.objectContaining({
				isolated: true,
				exampleIndex: 'basic',
				sections: [
					expect.objectContaining({
						components: [expect.objectContaining({ name: 'Button' })],
					}),
				],
			})
		);
	});

	test('return example index for a section', () => {
		const result = getRouteData(sections, '#!/Section//1');
		expect(result).toEqual(
			expect.objectContaining({
				isolated: true,
				exampleIndex: 1,
				sections: [
					expect.objectContaining({
						name: 'Section',
						components: [],
						sections: [],
					}),
				],
			})
		);
	});

	test('return first section if pagePerSection and hash are empty', () => {
		const subSection = sections[0].sections;
		const result = getRouteData(subSection, '', true);
		expect(result).toEqual(
			expect.objectContaining({
				isolated: false,
				exampleIndex: undefined,
				sections: [
					expect.objectContaining({
						name: 'Components',
						components: [
							expect.objectContaining({ name: 'Button' }),
							expect.objectContaining({ name: 'Image' }),
						],
						sections: [],
					}),
				],
			})
		);
	});

	test('return one section with children if pagePerSection=true', () => {
		const result = getRouteData(sections, '#/Buttons', true);
		expect(result).toEqual(
			expect.objectContaining({
				isolated: false,
				exampleIndex: undefined,
				sections: [
					expect.objectContaining({
						name: 'Buttons',
						components: [
							expect.objectContaining({ name: 'Label' }),
							expect.objectContaining({ name: 'RandomButton' }),
						],
						sections: [],
					}),
				],
			})
		);
	});

	test('return one component without ancestors if pagePerSection=true and hash has a component', () => {
		const result = getRouteData(sections, '#/Buttons/Label', true);
		expect(result).toEqual(
			expect.objectContaining({
				isolated: false,
				exampleIndex: undefined,
				sections: [
					expect.objectContaining({
						name: '',
						components: [expect.objectContaining({ name: 'Label' })],
					}),
				],
			})
		);
	});

	test('return not found if pagePerSection=true and hash does not exist', () => {
		const result = getRouteData(sections, '#/Buttons/Label/Not', true);
		expect(result).toEqual(
			expect.objectContaining({
				isolated: false,
				exampleIndex: undefined,
				sections: [],
			})
		);
	});
});
