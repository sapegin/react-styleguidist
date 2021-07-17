// #button
export function getAnchorUrl(slug: string) {
	return `#${slug}`;
}

// /#/Section/Button
export function getPageUrl(hashPath: string[]) {
	return `/#/${hashPath.map(encodeURIComponent).join('/')}`;
}

// /#!/Section/Button
// /#!/Section/Button//2
// /#!/Section/Button//pizza
export function getIsolatedUrl(hashPath: string[], exampleIndex?: number | string) {
	return [`/#!/${hashPath.map(encodeURIComponent).join('/')}`, exampleIndex]
		.filter((x) => x !== undefined)
		.join('//');
}

export const getSectionUrl = ({
	pagePerSection,
	slug,
	hashPath,
}: {
	pagePerSection: boolean;
	slug: string;
	hashPath: string[];
}) => {
	return pagePerSection ? getPageUrl(hashPath) : getAnchorUrl(slug);
};
