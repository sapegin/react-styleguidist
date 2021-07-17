declare module '@mdx-js/react' {
	import * as React from 'react';

	/**
	 * Mapping of names for JSX components to React components
	 */
	interface ComponentDictionary {
		[name: string]: React.ComponentType<any>;
	}

	export interface MDXProviderProps {
		children: React.ReactNode;
		components?: ComponentDictionary;
	}

	export class MDXProvider extends React.Component<MDXProviderProps> {}
}
