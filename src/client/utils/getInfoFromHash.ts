import * as Rsg from '../../typings';

interface UrlInfo {
	/**
	 * Are we in the isolated mode?
	 */
	isolated: boolean;
	/**
	 * Full path to the section or component:
	 * /#/Components/Buttons/BigButton
	 * ['Components', 'Buttons', 'BigButton']
	 */
	hashArray: string[];
	/**
	 * Index or name of the example in the isolated mode:
	 * /#!/Button//1 → 1
	 * /#!/Button//pizza → pizza
	 */
	exampleIndex?: string | number;
}

const parseHash = (hash: string): UrlInfo => {
	const [baseHash, targetHash] = hash.split('//');
	const [prefix, ...hashArray] = baseHash.split('/').map(decodeURIComponent);
	const targetHashNumberMaybe = parseInt(targetHash, 10);

	return {
		isolated: prefix === '#!',
		hashArray,
		exampleIndex: isNaN(targetHashNumberMaybe) ? targetHash : targetHashNumberMaybe,
	};
};

export default function getInfoFromHash({
	sections,
	hash,
	pagePerSection,
}: {
	sections: Rsg.Section[];
	hash: string;
	pagePerSection: boolean;
}): UrlInfo {
	const info = parseHash(hash);

	const defaultSectionName = sections[0]?.name || sections[0]?.components?.[0]?.name;

	if (pagePerSection && defaultSectionName && info.hashArray.length === 0) {
		// By default render the first section or component when pagePerSection is enabled
		return {
			...info,
			hashArray: [defaultSectionName],
		};
	} else {
		return info;
	}
}
