import deepfreeze from 'deepfreeze';
import filterComponentsByName from '../filterComponentsByName';
import * as Rsg from '../../../typings';

const componentsRaw: Rsg.Component[] = [
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
		slug: 'Image',
		hashPath: ['Components', 'Image'],
		metadata: {},
		filepath: 'Image.tsx',
		pathLine: '',
		hasExamples: false,
		props: { displayName: 'Image' },
	},
	{
		name: 'Input',
		visibleName: 'Input',
		slug: 'Input',
		hashPath: ['Components', 'Input'],
		metadata: {},
		filepath: 'Input.tsx',
		pathLine: '',
		hasExamples: false,
		props: { displayName: 'Input' },
	},
	{
		name: 'Link',
		visibleName: 'Link',
		slug: 'Link',
		hashPath: ['Components', 'Link'],
		metadata: {},
		filepath: 'Link.tsx',
		pathLine: '',
		hasExamples: false,
		props: { displayName: 'Link' },
	},
	{
		name: 'Textarea',
		visibleName: 'Textarea',
		slug: 'Textarea',
		hashPath: ['Components', 'Textarea'],
		metadata: {},
		filepath: 'Textarea.tsx',
		pathLine: '',
		hasExamples: false,
		props: { displayName: 'Textarea' },
	},
];
const components = deepfreeze(componentsRaw);

describe('filterComponentsByName', () => {
	it('should return initial list with empty query', () => {
		const result = filterComponentsByName(components, '');
		expect(result).toEqual(components);
	});

	it('should return filtered list, should ignore case', () => {
		const result = filterComponentsByName(components, 'button');
		expect(result).toEqual([expect.objectContaining({ name: 'Button' })]);
	});

	it('should return empty list when nothing found', () => {
		const result = filterComponentsByName(components, 'pizza');
		expect(result).toEqual([]);
	});

	it('should return all components if all of them match query', () => {
		// It doesn’t happen when RegExp has global flag for some reason
		const components2 = [components[1], components[2], components[3]];
		const result = filterComponentsByName(components2, 'i');
		expect(result).toEqual(components2);
	});
});
