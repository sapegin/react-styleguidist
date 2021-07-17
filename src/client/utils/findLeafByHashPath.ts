import * as Rsg from '../../typings';

const emptySection: Rsg.Section = {
	name: '',
	visibleName: '',
	slug: '',
	hashPath: [],
	exampleMode: 'collapse',
	components: [],
	sections: [],
};

/**
 * Wrap sections array in an empty section wrapper unless the first section is
 * already a wrapper (meaning it's cominf from the `components` config option)
 */
const ensureSectionWrapper = (sections: Rsg.Section[]): Rsg.Section => {
	if (sections[0].name === '') {
		return sections[0];
	} else {
		return {
			...emptySection,
			sections,
		};
	}
};

/**
 * Finds one section or component by their hash path for pagePerSection or isolated modes
 */
export default function findLeafByHashPath(
	sections: Rsg.Section[],
	hashPath: string[]
): Rsg.Section | undefined {
	let currentLevel = ensureSectionWrapper(sections);
	for (const [level, hashName] of hashPath.entries()) {
		if (level === hashPath.length - 1) {
			// If we've reached the leaf, it could be a section with our component
			const component = currentLevel.components.find(({ name }) => name === hashName);
			if (component) {
				return {
					...emptySection,
					components: [component],
				};
			}
		}

		// Otherwise it's a section name
		const section = currentLevel.sections.find(({ name }) => name === hashName);
		if (!section) {
			return undefined;
		}
		currentLevel = section;
	}
	return currentLevel;
}
