import path from 'path';
import getSections, { processSection } from '../getSections';
import * as Rsg from '../../../typings';

const configDir = path.resolve(__dirname, '../../../../test');
const config = {
	configDir,
	exampleMode: 'collapse',
	usageMode: 'collapse',
	getExampleFilename: (a: string) => a,
	getComponentPathLine: (a: string) => a,
} as Rsg.SanitizedStyleguidistConfig;

const sections: Rsg.ConfigSection[] = [
	{
		name: 'Readme',
		content: 'components/Button/Readme.md',
	},
	{
		name: 'Components',
		components: 'components/**/[A-Z]*.js',
	},
	{
		name: 'Ignore',
		components: 'components/**/*.js',
		ignore: '**/components/Annotation/*',
	},
];
const sectionsWithDepth = [
	{
		name: 'Documentation',
		sections: [
			{
				name: 'Files',
				sections: [
					{
						name: 'First File',
					},
				],
			},
		],
		sectionDepth: 2,
	},
	{
		name: 'Components',
		expand: true,
		sections: [
			{
				name: 'Buttons',
			},
		],
		sectionDepth: 0,
	},
];
const sectionsWithBadDepth = [
	{
		name: 'Documentation',
		sections: [
			{
				name: 'Files',
				sections: [
					{
						name: 'First File',
					},
				],
				sectionDepth: 2,
			},
		],
	},
];

function filterSectionDepth(section: Rsg.LoaderSection): Rsg.ConfigSection {
	if (section.sections && section.sections.length) {
		return {
			sectionDepth: section.sectionDepth,
			sections: section.sections.map(filterSectionDepth),
		};
	}
	return {
		sectionDepth: section.sectionDepth,
	};
}

it('processSection() should return an object for section with content', () => {
	const result = processSection(sections[0], config);

	expect(result).toMatchSnapshot();
});

it('processSection() should throw when content file not found', () => {
	const fn = () => processSection({ content: 'pizza' }, config);

	expect(fn).toThrowError('Section content file not found');
});

it('processSection() should return an object for section with components', () => {
	const result = processSection(sections[1], config);

	expect(result).toMatchSnapshot();
});

it('processSection() should return an object for section without ignored components', () => {
	const result = processSection(sections[2], config);

	expect(result).toMatchSnapshot();
});

it('getSections() should return an array', () => {
	const result = getSections(sections, config);

	expect(result).toMatchSnapshot();
});

it('getSections() should return an array of sectionsWithDepth with sectionDepth decreasing', () => {
	const result = getSections(sectionsWithDepth, config);

	expect(result.map(filterSectionDepth)).toEqual([
		{
			sectionDepth: 2,
			sections: [
				{
					sectionDepth: 1,
					sections: [
						{
							sectionDepth: 0,
						},
					],
				},
			],
		},
		{
			sectionDepth: 0,
			sections: [
				{
					sectionDepth: 0,
				},
			],
		},
	]);
});

it('getSections() should make custom options by user available', () => {
	const result = getSections(sectionsWithDepth, config);
	const expandSection = result.find((section) => section.name === 'Components');
	expect(expandSection).toHaveProperty('expand');
});

it('getSections() should return an array of sectionsWithBadDepth taking the sectionDepth of the first depth of the sections', () => {
	const result = getSections(sectionsWithBadDepth, config);

	expect(result.map(filterSectionDepth)).toEqual([
		{
			sectionDepth: 0,
			sections: [
				{
					sectionDepth: 0,
					sections: [
						{
							sectionDepth: 0,
						},
					],
				},
			],
		},
	]);
});
