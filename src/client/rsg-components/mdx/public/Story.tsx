import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import Para from 'rsg-components/Para';
import PlaygroundError from 'rsg-components/PlaygroundError';
import Playground from 'rsg-components/Playground';
import { useMdxContext } from '../MdxContext';
import MdxHighlight from '../MdxHighlight';
import MdxCodeStatic from '../MdxCodeStatic';
import * as Rsg from '../../../../typings';

interface Props extends Rsg.Modifiers {
	id: string;
	name?: string;
}

// TODO: Extract to its own file?
// XXX: We're assuming that all imported stories are located in a .story.js file
// next to the Mdx file with the same name, so we're ignoring all but the very
// last part of the story ID, which is the name of the exported from the CSF file
// function
export const getLocalExampleNameById = (id: string) => camelCase(id.replace(/^.*?--/, ''));

export default function Story({ id, name, ...modifiers }: Props) {
	const {
		componentName,
		componentHashPath,
		exampleMode,
		documentScope,
		exampleScope,
		namedExamples,
	} = useMdxContext();

	if (name) {
		return (
			<Para>
				<PlaygroundError message={`Story: Only stories imported by ID are supported`} />
			</Para>
		);
	}

	if (!id) {
		return (
			<Para>
				<PlaygroundError message={`Story: Imported example ID is required`} />
			</Para>
		);
	}

	const key = getLocalExampleNameById(id);
	const code = namedExamples?.[key];
	if (!code) {
		return (
			<Para>
				<PlaygroundError message={`Story: Imported example \`${id}\` not found in a story file`} />
			</Para>
		);
	}

	if (modifiers.static) {
		return (
			<MdxCodeStatic>
				<MdxHighlight>{code}</MdxHighlight>
			</MdxCodeStatic>
		);
	}

	return (
		<Playground
			code={code}
			componentName={componentName}
			componentHashPath={componentHashPath}
			exampleMode={exampleMode}
			documentScope={documentScope}
			exampleScope={exampleScope}
			modifiers={{ ...modifiers, index: key }}
		/>
	);
}

Story.propTypes = {
	id: PropTypes.string.isRequired,
};
