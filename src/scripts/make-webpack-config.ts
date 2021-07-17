import path from 'path';
import castArray from 'lodash/castArray';
import webpack, { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { MiniHtmlWebpackPlugin } from 'mini-html-webpack-plugin';
import MiniHtmlWebpackTemplate from '@vxna/mini-html-webpack-template';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import merge from 'webpack-merge';
import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';
import StyleguidistOptionsPlugin from './utils/StyleguidistOptionsPlugin';
import mergeWebpackConfig from './utils/mergeWebpackConfig';
import getWebpackVersion from './utils/getWebpackVersion';
import * as Rsg from '../typings';

type Mode = Configuration['mode'];

const RENDERER_REGEXP = /Renderer$/;

const sourceDir = path.resolve(__dirname, '../client');

const getCustomAliases = (styleguideComponents: Record<string, string>) => {
	const customAliases: Record<string, string> = {};
	forEach(styleguideComponents, (filepath, name) => {
		const fullName = name.match(RENDERER_REGEXP)
			? `${name.replace(RENDERER_REGEXP, '')}/${name}`
			: name;
		customAliases[`rsg-components/${fullName}`] = filepath;
	});
	return customAliases;
};

export default function (config: Rsg.SanitizedStyleguidistConfig, env: Mode): Configuration {
	process.env.NODE_ENV = process.env.NODE_ENV || env;

	const isProd = env === 'production';

	const template = isFunction(config.template) ? config.template : MiniHtmlWebpackTemplate;
	const templateContext = isFunction(config.template) ? {} : config.template;
	const htmlPluginOptions = {
		context: {
			lang: 'en',
			...templateContext,
			title: config.title,
			container: config.mountPointId,
		},
		template,
	};

	let webpackConfig: Configuration = {
		entry: config.require.concat([path.resolve(sourceDir, 'index')]),
		mode: env,
		output: {
			path: config.styleguideDir,
			filename: 'build/[name].bundle.js',
			chunkFilename: 'build/[name].js',
			publicPath: '',
		},
		resolve: {
			extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
			alias: {},
		},
		plugins: [
			new StyleguidistOptionsPlugin(config),
			new MiniHtmlWebpackPlugin(htmlPluginOptions),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'process.env.STYLEGUIDIST_ENV': JSON.stringify(env),
			}),
		],
		performance: {
			hints: false,
		},
	};

	const webpackVersion = getWebpackVersion();
	if (webpackVersion >= 5) {
		webpackConfig = merge(webpackConfig, {
			plugins: [
				// webpack 5 no longer polyfills `process`
				new webpack.ProvidePlugin({
					process: 'process/browser',
				}),
			],
			module: {
				rules: [
					{
						// Support .mjs modules in dependencies, like Sucrase
						test: /\.m?js$/,
						include: /node_modules/,
						type: 'javascript/auto',
						resolve: {
							// Avoid errors about imports without extension in webpack 5
							// https://github.com/webpack/webpack/issues/11467
							// @ts-ignore
							fullySpecified: false,
						},
					},
				],
			},
		});
	} else {
		webpackConfig = merge(webpackConfig, {
			module: {
				rules: [
					{
						// Support .mjs modules in dependencies, like Sucrase
						test: /\.m?js$/,
						include: /node_modules/,
						type: 'javascript/auto',
					},
				],
			},
		});
	}

	if (isProd) {
		const minimizer = new TerserPlugin({
			terserOptions: {
				ie8: false,
				ecma: 5,
				compress: {
					keep_fnames: true,
					warnings: false,
					/*
					 * Disable reduce_funcs to keep Terser from inlining
					 * Preact's VNode. If enabled, the 'new VNode()' is replaced
					 * with a anonymous 'function(){}', which is problematic for
					 * preact-compat, since it extends the VNode prototype to
					 * accomodate React's API.
					 */
					reduce_funcs: false,
				},
				mangle: {
					keep_fnames: true,
				},
			},
		});
		webpackConfig = merge(webpackConfig, {
			output: {
				filename: 'build/bundle.[chunkhash:8].js',
				chunkFilename: 'build/[name].[chunkhash:8].js',
			},
			plugins: [
				new CleanWebpackPlugin({
					cleanOnceBeforeBuildPatterns: [`${config.styleguideDir}/build/**/*`],
					verbose: config.verbose === true,
				} as any),
			],
			optimization: {
				minimize: config.minimize === true,
				minimizer: [minimizer],
			},
		});
		if (config.assetsDir && webpackConfig.plugins) {
			const copyPatterns = {
				patterns: castArray(config.assetsDir).map((dir) => ({ from: dir })),
			};
			webpackConfig.plugins.push(
				// FIXME: Since we don't have the type of copy-webpack-plugin@6.0
				// we cast the config as any to make it work. Once the new types are
				// released we must remove the cast.
				new CopyWebpackPlugin(copyPatterns as any)
			);
		}
	} else {
		webpackConfig = merge(webpackConfig, {
			entry: [require.resolve('react-dev-utils/webpackHotDevClient')],
			plugins: [new webpack.HotModuleReplacementPlugin()],
			devServer: {
				transportMode: 'ws',
			},
		});
	}

	if (config.webpackConfig) {
		webpackConfig = mergeWebpackConfig(webpackConfig, config.webpackConfig, env);
	}

	// Aliases
	webpackConfig = merge(webpackConfig, {
		resolve: {
			alias: {
				// In a sanitized config, moduleAliases is always an object (never null or undefined)
				...config.moduleAliases,
				// Custom styleguide components
				...getCustomAliases(config.styleguideComponents),
				// Code compiler module
				'rsg-compiler': config.compilerModule,
				// Add components folder alias at the end, so users can override our components
				// to customize the style guide (their aliases should be before this one)
				'rsg-components': path.resolve(sourceDir, 'rsg-components'),
			},
		},
	});

	webpackConfig = config.dangerouslyUpdateWebpackConfig(webpackConfig, env);

	return webpackConfig;
}
