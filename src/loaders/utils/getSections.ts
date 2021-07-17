// This two functions should be in the same file because of cyclic imports

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import requireIt from './requireIt';
import getComponentFiles from './getComponentFiles';
import getComponents from './getComponents';
import slugger from './slugger';
import * as Rsg from '../../typings';

const mdxLoader = path.resolve(__dirname, '../mdx-loader.js');

function processSectionContent(
	section: Rsg.ConfigSection,
	config: Rsg.SanitizedStyleguidistConfig
): Rsg.RequireItResult | undefined {
	if (!section.content) {
		return undefined;
	}

	const contentRelativePath = section.content;

	// Try to load section content file
	const contentAbsolutePath = path.resolve(config.configDir, contentRelativePath);
	if (!fs.existsSync(contentAbsolutePath)) {
		throw new Error(`Styleguidist: Section content file not found: ${contentAbsolutePath}`);
	}
	return requireIt(`!!${mdxLoader}!${contentAbsolutePath}`);
}

const getSectionComponents = (
	section: Rsg.ConfigSection,
	config: Rsg.SanitizedStyleguidistConfig
) => {
	let ignore = config.ignore ? _.castArray(config.ignore) : [];
	if (section.ignore) {
		ignore = ignore.concat(_.castArray(section.ignore));
	}

	return getComponents(getComponentFiles(section.components, config.configDir, ignore), config);
};

/**
 * Return object for one level of sections.
 *
 * @param {Array} sections
 * @param {object} config
 * @param {number} parentDepth
 * @returns {Array}
 */
export default function getSections(
	sections: Rsg.ConfigSection[],
	config: Rsg.SanitizedStyleguidistConfig,
	parentDepth?: number
): Rsg.LoaderSection[] {
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	return sections.map((section) => processSection(section, config, parentDepth));
}

/**
 * Return an object for a given section with all components and subsections.
 * @param {object} section
 * @param {object} config
 * @param {number} parentDepth
 * @returns {object}
 */
export function processSection(
	section: Rsg.ConfigSection,
	config: Rsg.SanitizedStyleguidistConfig,
	parentDepth?: number
): Rsg.LoaderSection {
	const content = processSectionContent(section, config);

	let sectionDepth;

	if (parentDepth === undefined) {
		sectionDepth = section.sectionDepth !== undefined ? section.sectionDepth : 0;
	} else {
		sectionDepth = parentDepth === 0 ? 0 : parentDepth - 1;
	}

	return {
		...section,
		exampleMode: section.exampleMode || config.exampleMode,
		usageMode: section.usageMode || config.usageMode,
		sectionDepth,
		slug: `section-${slugger.slug(section.name || 'untitled')}`,
		sections: getSections(section.sections || [], config, sectionDepth),
		href: section.href,
		components: getSectionComponents(section, config),
		content,
	};
}
