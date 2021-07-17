import React from 'react';
import { Slot } from '../slots';
import * as Rsg from '../../../typings';

const StyleGuideContext = React.createContext<StyleGuideContextContents>({
	codeRevision: 0,
	cssRevision: '0',
	config: {} as Rsg.ProcessedStyleguidistConfig,
	slots: {},
	isolated: false,
	exampleIndex: undefined,
});

export default StyleGuideContext;

export interface StyleGuideContextContents {
	codeRevision: number;
	cssRevision: string;
	config: Rsg.ProcessedStyleguidistConfig;
	slots: Record<string, Slot[]>;
	isolated: boolean;
	exampleIndex?: number | string;
}

export function useStyleGuideContext(): StyleGuideContextContents {
	return React.useContext(StyleGuideContext);
}
