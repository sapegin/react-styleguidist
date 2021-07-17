import { Section } from './RsgSection';
import { Component } from './RsgComponent';

/**
 * Table of contents item: could be either Section or Component plus their
 * children plus some additional fields
 */
export interface TOCItem {
	name: string;
	visibleName: string;
	slug: string;
	href: string;
	/**
	 * Is heading visible?
	 * Heading is hidden for wrapper sections (sections that are used to wrap
	 * components defined using the `components` config option)
	 */
	heading: boolean;
	shouldOpenInNewTab: boolean;
	selected: boolean;
	initialOpen: boolean;
	forcedOpen: boolean;
	content?: React.ReactNode;
	components?: Component[];
	sections?: Section[];
}
