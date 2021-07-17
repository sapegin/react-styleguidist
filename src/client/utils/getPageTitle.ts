import * as Rsg from '../../typings';

/**
 * Return page title:
 * “Style Guide Title” for all components view;
 * “Component/Section Name — Style Guide Title” for isolated mode or pages
 */
export default function getPageTitle(
	sections: Rsg.Section[],
	baseTitle: string,
	isPage: boolean
): string {
	if (sections.length === 0) {
		return 'Page not found';
	}

	if (isPage) {
		return `${sections[0]?.components?.[0]?.name || sections[0]?.name} — ${baseTitle}`;
	}

	return baseTitle;
}
