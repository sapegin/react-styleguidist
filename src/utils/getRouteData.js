import isFinite from 'lodash/isFinite';
import filterComponentExamples from './filterComponentExamples';
import filterComponentsInSectionsByExactName from './filterComponentsInSectionsByExactName';
import filterSectionExamples from './filterSectionExamples';
import findSection from './findSection';
import getInfoFromHash from './getInfoFromHash';
import { DisplayModes } from '../consts';

/**
 * Return sections / components / examples to show on a screen according to a current route.
 *
 * Default: show all sections and components.
 * #!/Button: show only Button section or Button component
 * #!/Button/1: show only the second example (index 1) of Button component
 *
 * @param {object} sections
 * @param {string} hash
 * @param {bool} oneComponentPerPage
 * @returns {object}
 */
export default function getRouteData(sections, hash, oneComponentPerPage) {
	// Parse URL hash to check if the components list must be filtered
	const {
		// Name of the filtered component/section to show isolated (/#!/Button → Button)
		targetName,
		// Index of the fenced block example of the filtered component isolate (/#!/Button/1 → 1)
		targetIndex,
	} = getInfoFromHash(hash);

	let displayMode = DisplayModes.all;

	// Filter the requested component if required
	if (targetName) {
		const filteredComponents = filterComponentsInSectionsByExactName(sections, targetName);
		if (filteredComponents.length) {
			sections = [{ components: filteredComponents }];
			displayMode = DisplayModes.component;
		} else {
			const section = findSection(sections, targetName);
			sections = section ? [section] : [];
			displayMode = DisplayModes.section;
		}

		// If a single component or section is filtered and a fenced block index is specified hide all other examples
		if (isFinite(targetIndex)) {
			if (filteredComponents.length === 1) {
				sections = [{ components: [filterComponentExamples(filteredComponents[0], targetIndex)] }];
				displayMode = DisplayModes.example;
			} else if (sections.length === 1) {
				sections = [filterSectionExamples(sections[0], targetIndex)];
				displayMode = DisplayModes.example;
			}
		}
	} else if (oneComponentPerPage) {
		// If one component per page mode then show demos for first component
		sections = [getFirstSectionWithFirstComponent(sections)];
	}

	return { sections, displayMode };
}

function getFirstSectionWithFirstComponent(sections) {
	const firstSection = sections[0];
	if (firstSection.components) {
		return { ...firstSection, components: firstSection.components[0] };
	}
	return getFirstSectionWithFirstComponent(firstSection.sections);
}
