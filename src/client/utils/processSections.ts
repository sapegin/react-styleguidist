import * as Rsg from '../../typings';
import processComponents from './processComponents';

/**
 * Recursively process each component in all sections.
 */
export default function processSections(
	sections: Rsg.RawSection[],
	parentHashPath: string[] = []
): Rsg.Section[] {
	return sections.map((section) => {
		// Section without a name is a wrapper section: it's created when the user
		// uses `components` config option but not `section`. This section contains
		// components from the `components` config option but it's not rendered
		// in the UI, that's why it has no name and we should skip it when we generate
		// links to components in this section
		const name = section.name || '';

		const hashPath = [...parentHashPath, name].filter(Boolean);

		return {
			...section,
			name,
			visibleName: name,
			hashPath,
			// Flag the section as an external link to avoid rendering it later
			externalLink: !!section.href,
			components: processComponents(section.components || [], hashPath),
			sections: processSections(section.sections || [], hashPath),
		};
	});
}
