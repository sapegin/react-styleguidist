import getInfoFromHash from './getInfoFromHash';
import findLeafByHashPath from './findLeafByHashPath';
import * as Rsg from '../../typings';

const filterSections = ({
	sections,
	hashArray,
}: {
	sections: Rsg.Section[];
	hashArray: string[];
}) => {
	if (hashArray.length > 0) {
		const leaf = findLeafByHashPath(sections, hashArray);
		return leaf ? [leaf] : [];
	} else {
		return sections;
	}
};

/**
 * Return sections / components to show on a screen according to the current route.
 *
 * Default: show all sections and components.
 * Default with pagePerSection: show the first section or component.
 *
 * #/Button: show only Button section or Button component
 * #!/Button: show only Button section or Button component in isolated mode
 * #!/Button//1: show only the second example (index 1) of Button component in isolated mode
 */
export default function getRouteData(
	sections: Rsg.Section[],
	// Hash part of the URL, including the # character
	hash: string,
	// Should render a single section or component: pagePerSection option or isolated mode
	pagePerSection = false
): {
	sections: Rsg.Section[];
	isolated: boolean;
	exampleIndex?: number | string;
} {
	const { isolated, hashArray, exampleIndex } = getInfoFromHash({ sections, hash, pagePerSection });
	const filteredSections = filterSections({ sections, hashArray });
	return {
		sections: filteredSections,
		isolated,
		exampleIndex,
	};
}
