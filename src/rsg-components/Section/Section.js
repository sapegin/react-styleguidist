import React from 'react';
import PropTypes from 'prop-types';
import Examples from 'rsg-components/Examples';
import Components from 'rsg-components/Components';
import Sections from 'rsg-components/Sections';
import SectionRenderer from 'rsg-components/Section/SectionRenderer';
import { asArrayMarkdown } from 'rsg-components/Markdown';
import { DisplayModes } from '../../consts';


export default function Section({ section, depth }, { displayMode }) {
	const { name, slug, content, components, sections, description } = section;

	const contentJsx = content && <Examples examples={content} name={name} />;
	const contentAsArray = content && asArrayMarkdown({ text: content });
	const componentsJsx = components && <Components components={components} depth={depth + 1} />;
	const sectionsJsx = sections && <Sections sections={sections} depth={depth + 1} />;

	return (
		<SectionRenderer
			description={description}
			name={name}
			slug={slug}
			content={contentJsx}
			contentAsArray={contentAsArray}
			components={componentsJsx}
			sections={sectionsJsx}
			isolated={displayMode !== DisplayModes.all}
			depth={depth}
		/>
	);
}

Section.propTypes = {
	section: PropTypes.object.isRequired,
	depth: PropTypes.number.isRequired,
};

Section.contextTypes = {
	displayMode: PropTypes.string,
};
