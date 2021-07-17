import { Configuration, loader } from 'webpack';
import { Handler, DocumentationObject, PropDescriptor } from 'react-docgen';
import { ASTNode } from 'ast-types';
import { NodePath } from 'ast-types/lib/node-path';
import { Styles } from 'jss';
import { Application } from 'express';
import { RecursivePartial } from './RecursivePartial';
import { ExpandMode } from './RsgComponent';
import { PropsObject } from './RsgPropsObject';
import { CodeExample } from './RsgExample';
import { ConfigSection, Section } from './RsgSection';
import { Theme } from './RsgTheme';

type Mode = Configuration['mode'];

type PropsResolver = (
	ast: ASTNode,
	parser: { parse: (code: string) => ASTNode }
) => NodePath<any, any> | NodePath[];

export interface StyleguidistLoaderContext extends loader.LoaderContext {
	_styleguidist: SanitizedStyleguidistConfig;
}

interface BaseStyleguidistConfig {
	assetsDir: string | string[];
	tocMode: ExpandMode;
	compileExample: (compiler: unknown, code: string) => string;
	/** @deprecated */
	compilerConfig: Record<string, any>;
	compilerModule: string;
	components: (() => string[]) | string | string[];
	configDir: string;
	context: Record<string, any>;
	contextDependencies: string[];
	configureServer(server: Application, env: Mode): string;
	dangerouslyUpdateWebpackConfig: (config: Configuration, env: Mode) => Configuration;
	/** @deprecated */
	defaultExample: unknown;
	exampleMode: ExpandMode;
	editorConfig: {
		theme: string;
	};
	getComponentPathLine(componentPath: string): string;
	getExampleFilename(componentPath: string): string;
	handlers: (componentPath: string) => Handler[];
	ignore: string[];
	logger: {
		info(message: string): void;
		warn(message: string): void;
		debug(message: string): void;
	};
	minimize: boolean;
	mountPointId: string;
	moduleAliases: Record<string, string>;
	pagePerSection: boolean;
	previewDelay: number;
	printBuildInstructions(config: SanitizedStyleguidistConfig): void;
	printServerInstructions(config: SanitizedStyleguidistConfig, options: { isHttps: boolean }): void;
	propsParser(
		filePath: string,
		code: string,
		resolver: PropsResolver,
		handlers: Handler[]
	): DocumentationObject;
	require: string[];
	resolver: PropsResolver;
	ribbon?: {
		text?: string;
		url: string;
	};
	serverHost: string;
	serverPort: number;
	/** @deprecated */
	showCode: boolean;
	/** @deprecated */
	showUsage: boolean;
	showSidebar: boolean;
	skipComponentsWithoutExample: boolean;
	sortProps(props: PropDescriptor[]): PropDescriptor[];
	styleguideComponents: Record<string, string>;
	styleguideDir: string;
	styles: Styles | string | ((theme: Theme) => Styles);
	template: any; // TODO
	theme: RecursivePartial<Theme> /*| string */; // TODO
	title: string;
	updateDocs(doc: PropsObject, file: string): PropsObject;
	updateExample(example: CodeExample, resourcePath: string): Omit<CodeExample, 'type'>;
	updateWebpackConfig(config: Configuration): Configuration;
	usageMode: ExpandMode;
	verbose: boolean;
	version: string;
	webpackConfig: Configuration | ((env: Mode) => Configuration);
}

export interface ProcessedStyleguidistConfig extends BaseStyleguidistConfig {
	sections: Section[];
	theme: RecursivePartial<Theme>;
	styles: ((th: Theme) => Styles) | Styles;
}

export type ProcessedStyleguidistCSSConfig = Pick<ProcessedStyleguidistConfig, 'theme'> &
	Pick<ProcessedStyleguidistConfig, 'styles'>;

export interface SanitizedStyleguidistConfig extends BaseStyleguidistConfig {
	sections: ConfigSection[];
}

/**
 * Config object where everything is optional
 */
export type StyleguidistConfig = RecursivePartial<SanitizedStyleguidistConfig>;
