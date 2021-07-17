import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Examples from 'rsg-components/Examples';
import SectionHeading from 'rsg-components/SectionHeading';
import JsDoc from 'rsg-components/JsDoc';
import Markdown from 'rsg-components/Markdown';
import Slot from 'rsg-components/Slot';
import ReactComponentRenderer from 'rsg-components/ReactComponent/ReactComponentRenderer';
import { useStyleGuideContext } from 'rsg-components/Context';
import ExamplePlaceholderDefault from 'rsg-components/ExamplePlaceholder';
import MdxWrapper from 'rsg-components/mdx/MdxWrapper';
import MdxCode from 'rsg-components/mdx/MdxCode';
import { DOCS_TAB_USAGE } from '../slots';
import { UsageModes } from '../../consts';
import * as Rsg from '../../../typings';

const ExamplePlaceholder =
	process.env.STYLEGUIDIST_ENV !== 'production' ? ExamplePlaceholderDefault : () => <div />;

interface ReactComponentProps {
	component: Rsg.Component;
	depth: number;
	exampleMode: string;
	usageMode?: string;
}

export default function ReactComponent(props: ReactComponentProps) {
	const [activeTab, setActiveTab] = useState<string | undefined>(() =>
		props.usageMode === UsageModes.expand ? DOCS_TAB_USAGE : undefined
	);

	const {
		isolated,
		exampleIndex,
		config: { pagePerSection },
	} = useStyleGuideContext();
	const { component, depth, usageMode, exampleMode } = props;
	const { name: componentName, visibleName, slug = '-', filepath, pathLine, hashPath } = component;
	const { description = '', content, tags = {} } = component.props || {};
	const { __examples: examples = [], __namedExamples: namedExamples = {} } = content || {};

	if (!componentName) {
		return null;
	}

	const showUsage = usageMode !== UsageModes.hide;

	const handleTabChange = (tabName: string) => {
		setActiveTab((currentActiveTab) => (currentActiveTab !== tabName ? tabName : undefined));
	};

	function getExamples() {
		// Isolated mode: fenced code block example
		if (typeof exampleIndex === 'number' && examples[exampleIndex] && content) {
			const example = examples[exampleIndex];
			return (
				<MdxWrapper
					componentName={componentName}
					componentHashPath={hashPath}
					exampleMode={exampleMode}
					{...content}
				>
					<MdxCode className={`language-${example.lang}`} {...example.settings}>
						{example.content}
					</MdxCode>
				</MdxWrapper>
			);
		}

		// Isolated mode: named story imported from a CSF file
		if (typeof exampleIndex === 'string' && namedExamples[exampleIndex] && content) {
			const example = namedExamples[exampleIndex];
			return (
				<MdxWrapper
					componentName={componentName}
					componentHashPath={hashPath}
					exampleMode={exampleMode}
					{...content}
				>
					<MdxCode index={exampleIndex} className="language-jsx">
						{example}
					</MdxCode>
				</MdxWrapper>
			);
		}

		// All examples
		if (content) {
			return (
				<Examples
					content={content}
					componentName={componentName}
					componentHashPath={hashPath}
					exampleMode={exampleMode}
				/>
			);
		}

		return <ExamplePlaceholder name={componentName} />;
	}

	return (
		<ReactComponentRenderer
			componentName={componentName}
			slug={slug}
			filepath={filepath}
			pathLine={pathLine}
			docs={<JsDoc {...tags} />}
			description={description && <Markdown text={description} />}
			heading={
				<SectionHeading
					name={component.name}
					slug={slug}
					hashPath={hashPath}
					pagePerSection={pagePerSection}
					deprecated={!!tags.deprecated}
					isolated={isolated}
					depth={depth}
					slotName="componentToolbar"
				>
					{visibleName}
				</SectionHeading>
			}
			examples={getExamples()}
			tabButtons={
				showUsage && (
					<Slot
						name="docsTabButtons"
						active={activeTab}
						props={{ ...component, onClick: handleTabChange }}
					/>
				)
			}
			tabBody={<Slot name="docsTabs" active={activeTab} onlyActive props={component} />}
		/>
	);
}

ReactComponent.propTypes = {
	component: PropTypes.object.isRequired,
	depth: PropTypes.number.isRequired,
	exampleMode: PropTypes.string.isRequired,
	usageMode: PropTypes.string.isRequired,
};
