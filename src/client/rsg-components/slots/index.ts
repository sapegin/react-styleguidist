import Editor from 'rsg-components/Editor';
import Usage from 'rsg-components/Usage';
import IsolateButton from 'rsg-components/slots/IsolateButton';
import CodeTabButton from 'rsg-components/slots/CodeTabButton';
import UsageTabButton from 'rsg-components/slots/UsageTabButton';
import * as Rsg from '../../../typings';

export const EXAMPLE_TAB_CODE_EDITOR = 'rsg-code-editor';
export const DOCS_TAB_USAGE = 'rsg-usage';

export type Slot =
	| React.ComponentType<any>
	| {
			id: string;
			render: React.ComponentType<any>;
	  };

const toolbar = [IsolateButton];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (config?: Rsg.ProcessedStyleguidistConfig): Record<string, Slot[]> => {
	return {
		sectionToolbar: toolbar,
		componentToolbar: toolbar,
		exampleToolbar: toolbar,
		exampleTabButtons: [
			{
				id: EXAMPLE_TAB_CODE_EDITOR,
				render: CodeTabButton,
			},
		],
		exampleTabs: [
			{
				id: EXAMPLE_TAB_CODE_EDITOR,
				render: Editor,
			},
		],
		docsTabButtons: [
			{
				id: DOCS_TAB_USAGE,
				render: UsageTabButton,
			},
		],
		docsTabs: [
			{
				id: DOCS_TAB_USAGE,
				render: Usage,
			},
		],
	};
};
