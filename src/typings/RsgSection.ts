import { RequireItResult } from './RsgRequireItResult';
import { ExamplesModule } from './RsgExample';
import { LoaderComponent, RawComponent, Component, ExpandMode } from './RsgComponent';

// Stages of section processing:
// BACKEND:
// 1. ConfigSection: used in the config files, defined by the user
// 2. LoaderSection: returned by the webpack loader
// FRONTEND:
// 3. RawSection: Same LoaderSection but with actual values instead of require() statements
// 4. Section: enhanced objects used for rendering

export interface BaseSection {
	name?: string;
	slug?: string;
	ignore?: string | string[];
	description?: string;
	exampleMode?: ExpandMode;
	usageMode?: ExpandMode;
	href?: string;
	sectionDepth?: number;
	external?: boolean;
	expand?: boolean;
}

/**
 * Used in the config file and at the early stages of processing
 */
export interface ConfigSection extends BaseSection {
	components?: string | string[] | (() => string[]);
	sections?: ConfigSection[];
	content?: string;
}

/**
 * Type returned when sections are transformed by the webpack loader
 */
export interface LoaderSection extends BaseSection {
	slug: string;
	content?: RequireItResult;
	components: LoaderComponent[];
	sections: LoaderSection[];
	exampleMode: ExpandMode;
}

export interface RawSection extends Omit<LoaderSection, 'sections' | 'components' | 'content'> {
	content?: ExamplesModule;
	exampleMode: ExpandMode;
	filepath?: string;
	externalLink?: boolean;
	href?: string;
	components: RawComponent[];
	sections: RawSection[];
}

/**
 * Enhanced section used on the client for rendering
 */
export interface Section extends Omit<RawSection, 'sections' | 'components'> {
	name: string;
	visibleName: string;
	hashPath: string[];
	components: Component[];
	sections: Section[];
}
