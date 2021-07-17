import { Identifier } from 'estree';
import { Node } from 'unist';
import * as Rsg from '../../typings';

type Literal = {
	type: 'text';
	value: string;
};

export interface CodeNodeProperties extends Rsg.Modifiers {
	className: string[];
	metastring?: string;
}

export interface CodeNode extends Node {
	type: 'element';
	tagName: 'code';
	properties: CodeNodeProperties;
	children: Literal[];
}

export type ModuleMap = Record<string, { toAST: () => Identifier }>;
