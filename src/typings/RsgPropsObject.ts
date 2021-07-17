import { DocumentationObject, MethodDescriptor, PropDescriptor } from 'react-docgen';
import { RequireItResult } from './RsgRequireItResult';

export interface MethodWithDocblock extends MethodDescriptor {
	docblock: string;
}

export interface TempPropsObject extends DocumentationObject {
	displayName: string;
	visibleName?: string;
	methods?: MethodWithDocblock[];
	doclets: Record<string, any>;
	content?: RequireItResult;
}

export interface PropsObject extends Omit<TempPropsObject, 'props'> {
	props?: Record<string, PropDescriptor> | PropDescriptor[];
}
