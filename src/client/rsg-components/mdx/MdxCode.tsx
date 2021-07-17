import React from 'react';
import Playground from 'rsg-components/Playground';
import { useMdxContext } from './MdxContext';
import MdxHighlight from './MdxHighlight';
import MdxCodeStatic from './MdxCodeStatic';
import * as Rsg from '../../../typings';

interface Props extends Rsg.Modifiers {
	children: string;
	className: string;
}

export default function MdxCode({ className, children, ...modifiers }: Props) {
	const {
		componentName,
		componentHashPath,
		exampleMode,
		documentScope,
		exampleScope,
	} = useMdxContext();

	if (modifiers.static) {
		return (
			<MdxCodeStatic>
				<MdxHighlight className={className}>{children}</MdxHighlight>
			</MdxCodeStatic>
		);
	}

	return (
		<Playground
			code={String(children)}
			componentName={componentName}
			componentHashPath={componentHashPath}
			exampleMode={exampleMode}
			documentScope={documentScope}
			exampleScope={exampleScope}
			modifiers={modifiers}
		/>
	);
}
