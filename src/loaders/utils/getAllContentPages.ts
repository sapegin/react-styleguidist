import * as Rsg from '../../typings';

/**
 * Get all section content pages
 */
export default function getAllContentPages(sections: Rsg.LoaderSection[]): Rsg.RequireItResult[] {
	return sections.reduce<Rsg.RequireItResult[]>((pages, section) => {
		if (section.content) {
			pages = [...pages, section.content];
		}

		if (section.sections) {
			pages = [...pages, ...getAllContentPages(section.sections)];
		}

		return pages;
	}, []);
}
