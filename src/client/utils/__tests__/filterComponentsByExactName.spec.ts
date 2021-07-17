import deepfreeze from 'deepfreeze';
import filterComponentsByExactName from '../filterComponentsByExactName';
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
		slug: 'image',
		hashPath: ['Components', 'Image'],
		metadata: {},
		filepath: 'image.tsx',
		pathLine: '',
		hasExamples: false,
		props: { displayName: 'Image' },
	},
];
const components = deepfreeze(componentsRaw);

describe('filterComponentsByExactName', () => {
	it('should return components with exact name', () => {
		const result = filterComponentsByExactName(components, 'Image');
		expect(result.map((x) => x.name)).toEqual(['Image']);
	});
});
