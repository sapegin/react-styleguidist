/* eslint-disable @typescript-eslint/naming-convention */

import { ComponentType } from 'react';

export interface Modifiers {
	/**
	 * Example index inside the Mdx document: either number or the name of the
	 * exported CSF story, added automatically
	 */
	index: number | string;
	/** Render static highlighted code instead of a dynamic preview with a code editor */
	static?: boolean;
	/** Renders an example code but hides the code editor */
	noeditor?: boolean;
	/** Opens the code editor, even if hidden by default in style guide settings */
	showcode?: boolean;
	/** Adds padding between example child elements */
	padded?: boolean;
	// TODO: Remove this and add a generic way to pass props using a React
	// component in Mdx, similar to `props` JSON in the old Markdown files
	/** Adds custom class name to an example preview wrapper */
	'preview-class'?: string;
}

export interface CodeExample {
	content: string;
	lang?: string;
	settings: Modifiers;
}

// Extra data added by our custom mdx-loader
export interface MdxExtras {
	__documentScope: Record<string, unknown>;
	__exampleScope: Record<string, unknown>;
	__storiesScope: Record<string, unknown>;
	__currentComponent?: ComponentType;
	__examples: CodeExample[];
	__namedExamples: Record<string, string>;
}

export interface ExamplesModule extends MdxExtras {
	__esModule: true;
	default: ComponentType<{
		componentName: string;
		componentHashPath: string[];
		exampleMode: string;
	}>;
}
