import React from 'react';
import PropTypes from 'prop-types';
import Examples from 'rsg-components/Examples';
import Components from 'rsg-components/Components';
import Sections from 'rsg-components/Sections';
import SectionRenderer from 'rsg-components/Section/SectionRenderer';
import { useStyleGuideContext } from 'rsg-components/Context';
import * as Rsg from '../../../typings';

const Section: React.FunctionComponent<{
	section: Rsg.Section;
	depth: number;
}> = ({ section, depth }) => {
	const {
		isolated,
		config: { pagePerSection },
	} = useStyleGuideContext();
	const {
		name,
		hashPath,
		slug,
		content,
		components,
		sections,
		description,
		exampleMode,
		usageMode,
	} = section;

	const contentJsx = content && (
		<Examples
			content={content}
			componentName={name}
			componentHashPath={hashPath}
			exampleMode={exampleMode}
		/>
	);

	const componentsJsx = components && (
		<Components
			usageMode={usageMode}
			exampleMode={exampleMode}
			components={components}
			depth={depth + 1}
		/>
	);

	const sectionsJsx = sections && <Sections sections={sections} depth={depth + 1} />;

	return (
		<SectionRenderer
			description={description}
			pagePerSection={pagePerSection}
			name={name}
			slug={slug}
			hashPath={hashPath}
			content={contentJsx}
			components={componentsJsx}
			sections={sectionsJsx}
			isolated={isolated}
			depth={depth}
		/>
	);
};

Section.propTypes = {
	section: PropTypes.any.isRequired,
	depth: PropTypes.number.isRequired,
};

export default Section;
