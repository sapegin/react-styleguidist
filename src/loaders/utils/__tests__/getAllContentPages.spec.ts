import getAllContentPages from '../getAllContentPages';
import * as Rsg from '../../../typings';

const readmeContent: Rsg.RequireItResult = {
	require: 'readme.md',
	toAST: () => ({ type: '' }),
};

const nestedContent: Rsg.RequireItResult = {
	require: 'nested.md',
	toAST: () => ({ type: '' }),
};

const sections: Rsg.LoaderSection[] = [
	{
		exampleMode: 'collapse',
		name: 'Readme',
		slug: 'section-readme',
		content: readmeContent,
		components: [],
		sections: [],
	},
	{
		exampleMode: 'collapse',
		name: 'Components',
		slug: 'section-components',
		components: [],
		sections: [],
	},
	{
		exampleMode: 'collapse',
		name: 'Nesting',
		slug: 'section-nesting',
		components: [],
		sections: [
			{
				exampleMode: 'collapse',
				name: 'Nested',
				slug: 'section-ested',
				components: [],
				sections: [],
			},
			{
				exampleMode: 'collapse',
				name: 'Nested 2',
				slug: 'section-nested-2',
				content: nestedContent,
				components: [],
				sections: [],
			},
		],
	},
];

it('should return all content pages', () => {
	const result = getAllContentPages(sections);
	expect(result).toEqual([readmeContent, nestedContent]);
});
