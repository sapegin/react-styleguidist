import { RequireItResult } from './RsgRequireItResult';
import { MarkdownExample } from './RsgExample';
import { LoaderComponent, EXPAND_MODE } from './RsgComponent';

export interface BaseSection {
	name?: string;
	slug?: string;
	ignore?: string | string[];
	description?: string;
	exampleMode?: EXPAND_MODE;
	usageMode?: EXPAND_MODE;
	href?: string;
	sectionDepth?: number;
	external?: boolean;
}

export interface ProcessedSection extends BaseSection {
	visibleName?: string;
	filepath?: string;
}

/**
 * Section used on the client in javascript
 * It is the output of the function `client/utils/processSection`
 */
export interface Section extends ProcessedSection {
	content?: Example[] | string;
	components?: Component[];
	sections?: Section[];
}

/**
 * Item of the Table Of Contents used in
 * ComponenetsList
 * TableOfContent
 * filterSectionByName
 */
export interface TOCItem extends ProcessedSection {
	heading?: boolean;
	shouldOpenInNewTab?: boolean;
	selected?: boolean;
	initialOpen?: boolean;
	forcedOpen?: boolean;
	content?: React.ReactNode;
	components?: TOCItem[];
	sections?: TOCItem[];
}

/**
 * Used in the config file and at the early stages of processing
 * in `schema/config.ts` this is the type that is used
 */
export interface ConfigSection extends BaseSection {
	components?: string | string[] | (() => string[]);
	sections?: ConfigSection[];
	content?: string;
}

/**
 * Type returned when sections are transformed to their webpack
 * loadable equivalents
 */
export interface LoaderSection extends BaseSection {
	slug?: string;
	content?: RequireItResult | MarkdownExample;
	components: LoaderComponent[];
	sections: LoaderSection[];
}
