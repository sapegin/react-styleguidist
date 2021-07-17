import React from 'react';
import hashSum from 'hash-sum';
import slots from 'rsg-components/slots';
import StyleGuide from 'rsg-components/StyleGuide';
import getPageTitle from './getPageTitle';
import getRouteData from './getRouteData';
import processSections from './processSections';
import * as Rsg from '../../typings';

interface StyleguideObject {
	sections: Rsg.RawSection[];
	config: Rsg.ProcessedStyleguidistConfig;
	patterns: string[];
	welcomeScreen?: boolean;
}

export default function renderStyleguide(
	styleguide: StyleguideObject,
	codeRevision: number,
	loc: { hash: string; pathname: string } = window.location,
	doc: { title: string } = document
): React.ReactElement {
	const allSections = processSections(styleguide.sections);

	const { title, pagePerSection, theme, styles } = styleguide.config;
	const { sections, isolated, exampleIndex } = getRouteData(allSections, loc.hash, pagePerSection);

	// Update page title
	doc.title = getPageTitle(sections, title, pagePerSection || isolated);

	return (
		<StyleGuide
			codeRevision={codeRevision}
			// only caclulate css revisions in dev when hot is on to avoid
			// stringifying the styles in production
			cssRevision={module.hot ? hashSum({ theme, styles }) : '0'}
			config={styleguide.config}
			slots={slots(styleguide.config)}
			welcomeScreen={styleguide.welcomeScreen}
			patterns={styleguide.patterns}
			sections={sections}
			allSections={allSections}
			isolated={isolated}
			exampleIndex={exampleIndex}
			pagePerSection={pagePerSection}
		/>
	);
}
