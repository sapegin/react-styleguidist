import deepfreeze from 'deepfreeze';
import processComponents from '../processComponents';
import * as Rsg from '../../../typings';

const component: Rsg.RawComponent = {
	filepath: './foo.tsx',
	slug: 'foo',
	pathLine: 'foo',
	props: {
		displayName: 'Foo',
	},
	hasExamples: false,
	metadata: {},
};

describe('processComponents', () => {
	it('should set components’ displayName to a name property', () => {
		const components = deepfreeze([component]);
		const result = processComponents(components);
		expect(result[0].name).toBe('Foo');
	});

	it('should calculate hash path', () => {
		const components = deepfreeze([component]);
		const result = processComponents(components);
		expect(result[0].hashPath).toEqual(['Foo']);
	});

	describe('should set visibleName property on the component', () => {
		it('from an visibleName component prop if available', () => {
			const components = deepfreeze([
				{
					...component,
					props: {
						displayName: 'Foo',
						visibleName: 'Foo Bar',
					},
				},
			]);
			const result = processComponents(components);
			expect(result[0].visibleName).toBe('Foo Bar');
		});

		it('from an displayName component prop if visibleName prop is not available', () => {
			const components = deepfreeze([component]);
			const result = processComponents(components);
			expect(result[0].visibleName).toBe('Foo');
		});
	});
});
