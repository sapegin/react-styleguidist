import React, { ReactNode } from 'react';
import getComponent from '../../utils/getComponent';
import MdxContext from './MdxContext';
import * as Rsg from '../../../typings';

interface Props extends Rsg.MdxExtras {
	children?: ReactNode;
	componentName: string;
	componentHashPath: string[];
	exampleMode: string;
}

export default function MdxWrapper({
	children,
	componentName,
	componentHashPath,
	exampleMode,
	__documentScope: documentScope,
	__exampleScope: exampleScope,
	__storiesScope: storiesScope,
	__currentComponent: currentComponent,
	__namedExamples: namedExamples,
}: Props) {
	const expandedDocumentScope = {
		// Make React available to examples
		React,
		// Make the current component available to examples,
		// non-component sections don't have the current component
		...(currentComponent
			? {
					[componentName]: getComponent(currentComponent),
			  }
			: {}),
		...documentScope,
	};
	const expandedExampleScope = { ...exampleScope, ...storiesScope };
	return (
		<MdxContext.Provider
			value={{
				componentName,
				componentHashPath,
				exampleMode,
				documentScope: expandedDocumentScope,
				exampleScope: expandedExampleScope,
				namedExamples,
			}}
		>
			{children}
		</MdxContext.Provider>
	);
}
