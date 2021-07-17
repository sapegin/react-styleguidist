import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentsList from 'rsg-components/ComponentsList';
import TableOfContentsRenderer from 'rsg-components/TableOfContents/TableOfContentsRenderer';
import filterSectionsByName from '../../utils/filterSectionsByName';
import filterComponentsByName from '../../utils/filterComponentsByName';
import { getHash } from '../../utils/handleHash';
import { getSectionUrl } from '../../utils/getUrl';
import * as Rsg from '../../../typings';

interface TableOfContentsProps {
	sections: Rsg.Section[];
	pagePerSection?: boolean;
	tocMode?: string;
	loc: { hash: string; pathname: string };
}

export default class TableOfContents extends Component<TableOfContentsProps> {
	public static propTypes = {
		sections: PropTypes.array.isRequired,
		pagePerSection: PropTypes.bool,
		tocMode: PropTypes.string,
		loc: PropTypes.object,
	};

	public static defaultProps = {
		loc: window.location,
	};

	public state = {
		searchTerm: '',
	};

	private renderLevel(
		allSectionsAndComponents: (Rsg.Section | Rsg.Component)[],
		pagePerSection = false,
		hashPath: string[] = [],
		// TODO: WTF is this?!
		useHashId = false
	): { content: React.ReactElement; containsSelected: boolean } {
		// TODO: Highlight the first section/component by default with pagePerSection

		// Match selected component in both basic routing and pagePerSection routing.
		const { hash, pathname } = this.props.loc;
		const windowHash = pathname + (pagePerSection ? hash : getHash(hash));

		let childrenContainSelected = false;
		const processedItems: Rsg.TOCItem[] = allSectionsAndComponents.map((tocItem) => {
			const components = 'components' in tocItem ? tocItem.components : [];
			const sections = 'sections' in tocItem ? tocItem.sections : [];
			const children = [...components, ...sections];
			const sectionDepth = 'sectionDepth' in tocItem ? tocItem.sectionDepth || 0 : 0;
			const childHashPath =
				sectionDepth === 0 && useHashId
					? hashPath
					: // TODO: Not sure we need the variant with the `-`
					  [...hashPath, tocItem.name ? tocItem.name : '-'];

			const { content, containsSelected } =
				children.length > 0
					? this.renderLevel(children, pagePerSection, childHashPath, sectionDepth === 0)
					: { content: undefined, containsSelected: false };

			const selected =
				(!pagePerSection && tocItem.href ? getHash(tocItem.href) : tocItem.href) === windowHash;

			if (containsSelected || selected) {
				childrenContainSelected = true;
			}

			return {
				...tocItem,
				components,
				sections,
				content,
				selected,
				href:
					tocItem.href ||
					getSectionUrl({ pagePerSection, slug: tocItem.slug, hashPath: tocItem.hashPath }),
				// TODO: Rename to hasHeading
				heading: !!tocItem.name && children.length > 0,
				shouldOpenInNewTab:
					!!('external' in tocItem && tocItem.external) &&
					!!('externalLink' in tocItem && tocItem.externalLink),
				// TODO: Rename to isInitiallyOpen
				initialOpen:
					this.props.tocMode !== 'collapse' ||
					containsSelected ||
					('expand' in tocItem && tocItem.expand) ||
					false,
				// TODO: Rename to isForcedToOpen (?)
				forcedOpen: this.state.searchTerm.length > 0,
			};
		});
		return {
			content: <ComponentsList items={processedItems} />,
			containsSelected: childrenContainSelected,
		};
	}

	private renderSections() {
		const { searchTerm } = this.state;
		const { sections, pagePerSection } = this.props;
		// If there is only one section, we treat it as a root section
		// In this case the name of the section won't be rendered and it won't get left padding
		// Since a section can contain only other sections,
		// we need to make sure not to loose the subsections.
		// We will treat those subsections as the new roots.
		// TODO: Extract into a function
		const filtered =
			sections.length === 1
				? // only use subsections if there actually are subsections
				  sections[0].sections.length > 0
					? filterSectionsByName(sections[0].sections, searchTerm)
					: filterComponentsByName(sections[0].components, searchTerm)
				: filterSectionsByName(sections, searchTerm);

		return this.renderLevel(filtered, pagePerSection).content;
	}

	public render() {
		const handleSearchTermChange = (searchTerm: string) => this.setState({ searchTerm });
		return (
			<TableOfContentsRenderer
				searchTerm={this.state.searchTerm}
				onSearchTermChange={handleSearchTermChange}
			>
				{this.renderSections()}
			</TableOfContentsRenderer>
		);
	}
}
