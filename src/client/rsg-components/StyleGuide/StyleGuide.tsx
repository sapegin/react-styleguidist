import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableOfContents from 'rsg-components/TableOfContents';
import StyleGuideRenderer from 'rsg-components/StyleGuide/StyleGuideRenderer';
import Sections from 'rsg-components/Sections';
import Welcome from 'rsg-components/Welcome';
import Error from 'rsg-components/Error';
import NotFound from 'rsg-components/NotFound';
import Context from 'rsg-components/Context';
import MdxProvider from 'rsg-components/mdx/MdxProvider';
import { HOMEPAGE } from '../../../scripts/consts';
import * as Rsg from '../../../typings';

/**
 * This function will return true, if the sidebar should be visible and false otherwise.
 *
 * These sorted conditions (highest precedence first) define the visibility
 * state of the sidebar.
 *
 * - Sidebar is always hidden in isolated mode
 * - Sidebar is visible when pagePerSection
 * - Sidebar is hidden when showSidebar is set to false
 * - Sidebar is visible when showSidebar is set to true for non-isolated views
 */
function hasSidebar(sections: Rsg.Section[], isolated: boolean, showSidebar: boolean): boolean {
	return sections.length > 0 && !isolated && showSidebar;
}

export interface StyleGuideProps {
	codeRevision: number;
	cssRevision: string;
	config: Rsg.ProcessedStyleguidistConfig;
	slots: any;
	sections: Rsg.Section[];
	welcomeScreen?: boolean;
	patterns?: string[];
	isolated: boolean;
	exampleIndex?: number | string;
	allSections?: Rsg.Section[];
	pagePerSection?: boolean;
}

interface StyleGuideState {
	error: Error | boolean;
	info: React.ErrorInfo | null;
}

export default class StyleGuide extends Component<StyleGuideProps, StyleGuideState> {
	public static propTypes = {
		codeRevision: PropTypes.number.isRequired,
		cssRevision: PropTypes.string.isRequired,
		config: PropTypes.object.isRequired,
		slots: PropTypes.object.isRequired,
		sections: PropTypes.array.isRequired,
		welcomeScreen: PropTypes.bool,
		patterns: PropTypes.array,
		isolated: PropTypes.bool.isRequired,
		exampleIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		allSections: PropTypes.array.isRequired,
		pagePerSection: PropTypes.bool,
	};

	public state = {
		error: false,
		info: null,
	};

	public componentDidCatch(error: Error, info: React.ErrorInfo) {
		this.setState({
			error,
			info,
		});
	}

	public render() {
		const { error, info }: StyleGuideState = this.state;
		const {
			config,
			sections,
			welcomeScreen,
			patterns,
			isolated,
			exampleIndex,
			allSections,
			pagePerSection,
			codeRevision,
			cssRevision,
			slots,
		} = this.props;

		if (error && info) {
			return <Error error={error} info={info} />;
		}

		if (welcomeScreen && patterns) {
			return <Welcome patterns={patterns} />;
		}

		return (
			<Context.Provider
				value={{
					codeRevision,
					config,
					slots,
					isolated,
					exampleIndex,
					cssRevision,
				}}
			>
				<MdxProvider>
					<StyleGuideRenderer
						key={cssRevision}
						title={config.title}
						version={config.version}
						homepageUrl={HOMEPAGE}
						toc={
							allSections ? (
								<TableOfContents
									sections={allSections}
									pagePerSection={pagePerSection}
									tocMode={config.tocMode}
								/>
							) : null
						}
						hasSidebar={hasSidebar(sections, isolated, config.showSidebar)}
					>
						{sections.length ? <Sections sections={sections} depth={1} /> : <NotFound />}
					</StyleGuideRenderer>
				</MdxProvider>
			</Context.Provider>
		);
	}
}
