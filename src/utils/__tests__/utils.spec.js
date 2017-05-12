import * as utils from '../utils';

const components = [
	{
		name: 'Button',
	},
	{
		name: 'Image',
	},
	{
		name: 'Input',
	},
	{
		name: 'Link',
	},
	{
		name: 'Textarea',
	},
];

const sections = [
	{
		name: 'General',
		sections: [
			{
				name: 'Particles',
				components: [
					{
						name: 'Button',
					},
					{
						name: 'Image',
					},
				],
			},
		],
	},
];

describe('setSlugs', () => {
	it('should set unique slug property to each section or component with name property', () => {
		const result = utils.setSlugs([
			{
				name: 'Multiple words',
				sections: [
					{
						name: 'Single',
						components: [
							{
								name: 'Button',
							},
							{
								name: 'Image',
							},
						],
					},
					{
						components: [
							{
								name: 'Button',
							},
							{
								name: 'Image',
							},
						],
					},
				],
			},
		]);
		expect(result).toMatchSnapshot();
	});
});

describe('globalizeComponent', () => {
	it('should set component’s module as a global variable', () => {
		const globalsCount = Object.keys(global).length;
		utils.globalizeComponent({
			name: 'Foo',
			props: {},
			module: 13,
		});
		expect(Object.keys(global).length).toBe(globalsCount + 1);
		expect(global.Foo).toBe(13);
	});
});

describe('processComponents', () => {
	it('should set components’ modules as a global variables', () => {
		const globalsCount = Object.keys(global).length;
		utils.processComponents([
			{
				props: {
					displayName: 'Bar',
				},
				module: 13,
			},
			{
				props: {
					displayName: 'Baz',
				},
				module: 14,
			},
		]);
		expect(Object.keys(global).length).toBe(globalsCount + 2);
		expect(global.Bar).toBe(13);
		expect(global.Baz).toBe(14);
	});

	it('should set components’ displayName to a name property', () => {
		const result = utils.processComponents([
			{
				props: {
					displayName: 'Foo',
				},
				module: 13,
			},
		]);
		expect(result[0].name).toBe('Foo');
	});

	it('should append @example doclet to all examples', () => {
		const result = utils.processComponents([
			{
				props: {
					displayName: 'Foo',
					examples: [1, 2],
					example: [3, 4],
				},
				module: 11,
			},
		]);
		expect(result[0].props.examples).toEqual([1, 2, 3, 4]);
	});
});

describe('processSections', () => {
	it('should recursively process all sections and components', () => {
		const result = utils.processSections([
			{
				sections: [
					{
						components: [
							{
								props: {
									displayName: 'Button',
								},
								module: 1,
							},
						],
					},
				],
			},
		]);
		expect(result[0].sections[0].components[0].name).toBe('Button');
	});
});

describe('getFilterRegExp', () => {
	it('should return a RegExp', () => {
		const result = utils.getFilterRegExp('');
		expect(result instanceof RegExp).toBe(true);
	});

	it('RegExp should fuzzy match a string', () => {
		const result = utils.getFilterRegExp('btn');
		expect('button').toMatch(result);
	});

	it('RegExp should not match when string is different', () => {
		const result = utils.getFilterRegExp('buttons');
		expect('button').not.toMatch(result);
	});

	it('should not throw when query contains special characters', () => {
		const fn = () => utils.getFilterRegExp('\\');
		expect(fn).not.toThrow();
	});

	it('RegExp should ignore non-alphanumeric characters', () => {
		const result = utils.getFilterRegExp('#$b()tn');
		expect('button').toMatch(result);
	});
});

describe('filterComponentsByName', () => {
	it('should return initial list with empty query', () => {
		const result = utils.filterComponentsByName(components, '');
		expect(result).toEqual(components);
	});

	it('should return filtered list, should ignore case', () => {
		const result = utils.filterComponentsByName(components, 'button');
		expect(result).toEqual([{ name: 'Button' }]);
	});

	it('should return empty list when nothing found', () => {
		const result = utils.filterComponentsByName(components, 'pizza');
		expect(result).toEqual([]);
	});

	it('should return all components if all of them match query', () => {
		// It doesn’t happen when RegExp has global flag for some reason
		const components = [
			{ name: 'Button' },
			{ name: 'CounterButton' },
			{ name: 'PushButton' },
			{ name: 'RandomButtom' },
			{ name: 'WrappedButton' },
		];
		const result = utils.filterComponentsByName(components, 'bu');
		expect(result).toEqual(components);
	});
});

describe('filterComponentsByExactName', () => {
	it('should return components with exact name', () => {
		const result = utils.filterComponentsByExactName(components, 'Image');
		expect(result).toEqual([components[1]]);
	});
});

describe('filterComponentsInSectionsByExactName', () => {
	it('should return components at any level with exact name', () => {
		const result = utils.filterComponentsInSectionsByExactName(sections, 'Image');
		expect(result).toEqual([components[1]]);
	});
});

describe('filterSectionsByName', () => {
	it('should recursively filter sections and components by name', () => {
		const result = utils.filterSectionsByName(sections, 'button');
		expect(result).toMatchSnapshot();
	});

	it('should skip sections without matches inside', () => {
		const result = utils.filterSectionsByName(sections, 'general');
		expect(result).toMatchSnapshot();
	});

	it('should return empty array if no components of sections match query', () => {
		const result = utils.filterSectionsByName(sections, 'pizza');
		expect(result).toEqual([]);
	});
});

describe('getInfoFromHash', () => {
	it('should return important part of hash if it contains component name', () => {
		const result = utils.getInfoFromHash('#!/Button');
		expect(result).toEqual({ targetName: 'Button', targetIndex: null });
	});

	it('should return an empty object if hash contains no component name', () => {
		const result = utils.getInfoFromHash('Button');
		expect(result).toEqual({});
	});
});

describe('filterSections', () => {
	const sections = [
		{
			name: 'General',
			sections: [],
		},
		{
			name: 'Forms',
			sections: [],
		},
		{
			name: 'Lists',
			sections: [],
		},
	];

	it('should return the Forms section', () => {
		const result = utils.filterSections(sections, 'Forms');
		expect(result).toEqual(sections[1]);
	});

	it('should return the Lists section', () => {
		const result = utils.filterSections(sections, 'Lists');
		expect(result).toEqual(sections[2]);
	});
});

describe('filterComponentExamples', () => {
	it('should return a shallow copy of the component with example filtered by given index', () => {
		const comp = {
			props: {
				examples: ['a', 'b', 'c', 'd'],
			},
			other: 'info',
		};
		const result = utils.filterComponentExamples(comp, 2);
		expect(result).toEqual({
			props: {
				examples: ['c'],
			},
			other: 'info',
		});
	});
});
