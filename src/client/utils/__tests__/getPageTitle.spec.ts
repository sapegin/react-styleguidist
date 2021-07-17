import getPageTitle from '../getPageTitle';
import * as Rsg from '../../../typings';

const baseTitle = 'Styleguide';
const section: Rsg.Section = {
	name: 'Section',
	visibleName: 'Section',
	slug: 'section',
	hashPath: ['Section'],
	exampleMode: 'collapse',
	components: [],
	sections: [],
};
const component: Rsg.Component = {
	name: 'Button',
	visibleName: 'Button',
	slug: 'button',
	hashPath: ['Components', 'Button'],
	metadata: {},
	filepath: 'button.tsx',
	pathLine: '',
	hasExamples: false,
	props: { displayName: 'Button' },
};

describe('getPageTitle', () => {
	it('should return style guide title for the all view', () => {
		const result = getPageTitle([section], baseTitle, false);
		expect(result).toBe(baseTitle);
	});

	it('should return component name for component isolated mode', () => {
		const result = getPageTitle([{ ...section, components: [component] }], baseTitle, true);
		expect(result).toMatch(component.name);
	});

	it('should return component name for example isolated mode', () => {
		const result = getPageTitle([{ ...section, components: [component] }], baseTitle, true);
		expect(result).toMatch(component.name);
	});

	it('should return section name for example isolated mode of a example content', () => {
		const result = getPageTitle([section], baseTitle, true);
		expect(result).toMatch(section.name);
	});

	it('should return page not found when there are no sections', () => {
		const result = getPageTitle([], baseTitle, false);
		expect(result).toMatch('Page not found');
	});

	it('should return page not found when there are no sections in isolated view', () => {
		const result = getPageTitle([], baseTitle, true);
		expect(result).toMatch('Page not found');
	});
});
