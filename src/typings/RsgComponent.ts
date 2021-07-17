import { MethodDescriptor, PropDescriptor, TagProps } from 'react-docgen';
import { ExamplesModule } from './RsgExample';
import { RequireItResult } from './RsgRequireItResult';

// TODO: Move to its own file?
export type ExpandMode = 'expand' | 'collapse' | 'hide';

// Stages of component processing:
// BACKEND:
// 1. LoaderComponent: returned by the webpack loader
// FRONTEND:
// 2. RawComponent: Same LoaderComponent but with actual values instead of require() statements
// 3. Component: enhanced objects used for rendering

/**
 * Component object used in the loader
 */
export interface LoaderComponent {
	filepath: string;
	slug: string;
	href?: string;
	pathLine: string;
	module: RequireItResult;
	props: RequireItResult;
	hasExamples: boolean;
	metadata: RequireItResult | Record<string, unknown>;
}

export interface RawComponent extends Omit<LoaderComponent, 'module' | 'props' | 'metadata'> {
	props: {
		displayName: string;
		visibleName?: string;
		description?: string;
		methods?: MethodDescriptor[];
		props?: PropDescriptor[];
		tags?: TagProps;
		content?: ExamplesModule;
	};
	metadata: {
		tags?: string[];
	};
}

/**
 * Enhanced component object used on the client
 */
export interface Component extends RawComponent {
	name: string;
	visibleName: string;
	hashPath: string[];
}
