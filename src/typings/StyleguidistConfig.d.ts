import WebpackDevServer from 'webpack-dev-server';
import { Configuration, loader } from 'webpack';
import { TransformOptions } from 'buble';
import { Handler, DocumentationObject, PropDescriptor } from 'react-docgen';
import { ASTNode } from 'ast-types';
import { NodePath } from 'ast-types/lib/node-path';

declare global {
	namespace Rsg {
		type EXPAND_MODE = 'expand' | 'collapse' | 'hide';

		interface StyleguidistLoaderContext extends loader.LoaderContext {
			_styleguidist: SanitizedStyleguidistConfig;
		}

		interface BaseStyleguidistConfig {
			assetsDir: string | string[];
			compilerConfig: TransformOptions;
			components: (() => string | string[]) | string | string[];
			configDir: string;
			context: Record<string, any>;
			contextDependencies: string[];
			configureServer(server: WebpackDevServer, env: string): string;
			dangerouslyUpdateWebpackConfig: (server: Configuration, env: string) => Configuration;
			defaultExample: string | false;
			exampleMode: EXPAND_MODE;
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
			printBuildInstructions(config: ProcessedStyleguidistConfig): void;
			printServerInstructions(config: ProcessedStyleguidistConfig): void;
			propsParser(
				filePath: string,
				code: string,
				resolver: (
					ast: ASTNode,
					parser: { parse: (code: string) => ASTNode }
				) => NodePath<any, any> | NodePath[],
				handlers: Handler[]
			): DocumentationObject;
			require: string[];
			resolver(
				ast: ASTNode,
				parser: { parse: (code: string) => ASTNode }
			): NodePath<any, any> | NodePath[];
			ribbon?: {
				text?: string;
				url: string;
			};
			serverHost: string;
			serverPort: number;
			showCode: boolean;
			showUsage: boolean;
			showSidebar: boolean;
			skipComponentsWithoutExample: boolean;
			sortProps(props: PropDescriptor[]): PropDescriptor[];
			styleguideComponents: Record<string, string>;
			styleguideDir: string;
			styles: Styles;
			template: any;
			theme: Theme;
			title: string;
			updateDocs(doc: PropsObject, file: string): PropsObject;
			updateExample(
				props: Omit<CodeExample, 'type'>,
				ressourcePath: string
			): Omit<CodeExample, 'type'>;
			updateWebpackConfig(config: Configuration): Configuration;
			usageMode: EXPAND_MODE;
			verbose: boolean;
			version: string;
			webpackConfig: Configuration | ((env?: string) => Configuration);
		}

		interface ProcessedStyleguidistConfig extends BaseStyleguidistConfig {
			sections: Section[];
		}

		interface SanitizedStyleguidistConfig extends BaseStyleguidistConfig {
			sections: ConfigSection[];
		}

		interface StyleguidistConfig
			extends RecursivePartial<Omit<SanitizedStyleguidistConfig, 'defaultExample'>> {
			defaultExample?: string | boolean;
		}
	}
}
