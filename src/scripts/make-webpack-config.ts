/* eslint-disable @typescript-eslint/camelcase */
import path from 'path';
import castArray from 'lodash/castArray';
import webpack, { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import MiniHtmlWebpackPlugin from 'mini-html-webpack-plugin';
import MiniHtmlWebpackTemplate from '@vxna/mini-html-webpack-template';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import merge from 'webpack-merge';
import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';

import StyleguidistOptionsPlugin from './utils/StyleguidistOptionsPlugin';
import mergeWebpackConfig from './utils/mergeWebpackConfig';

const RENDERER_REGEXP = /Renderer$/;

const sourceDir = path.resolve(__dirname, '../client');

export default function(
	config: Rsg.ProcessedStyleguidistConfig,
	env: 'development' | 'production' | 'none'
): Configuration {
	process.env.NODE_ENV = process.env.NODE_ENV || env;

	const isProd = env === 'production';

	const template = isFunction(config.template) ? config.template : MiniHtmlWebpackTemplate;
	const templateContext = isFunction(config.template) ? {} : config.template;
	const htmlPluginOptions = {
		context: {
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
					root: config.styleguideDir,
					verbose: config.verbose === true,
				} as any),
				new CopyWebpackPlugin(
					config.assetsDir ? castArray(config.assetsDir).map(dir => ({ from: dir })) : []
				),
			],
			optimization: {
				minimize: config.minimize === true,
				minimizer: [minimizer],
			},
		});
	} else {
		webpackConfig = merge(webpackConfig, {
			entry: [require.resolve('react-dev-utils/webpackHotDevClient')],
			plugins: [new webpack.HotModuleReplacementPlugin()],
		});
	}

	if (config.webpackConfig) {
		webpackConfig = mergeWebpackConfig(webpackConfig, config.webpackConfig, env);
	}

	// Custom aliases
	if (config.moduleAliases) {
		webpackConfig = merge(webpackConfig, {
			resolve: { alias: config.moduleAliases },
		});
	}

	const alias = webpackConfig.resolve ? webpackConfig.resolve.alias : undefined;
	if (alias) {
		// Custom style guide components
		if (config.styleguideComponents) {
			forEach(config.styleguideComponents, (filepath, name) => {
				const fullName = name.match(RENDERER_REGEXP)
					? `${name.replace(RENDERER_REGEXP, '')}/${name}`
					: name;
				alias[`rsg-components/${fullName}`] = filepath;
			});
		}

		// Add components folder alias at the end, so users can override our components
		// to customize the style guide (their aliases should be before this one)
		alias['rsg-components'] = path.resolve(sourceDir, 'rsg-components');
	}

	if (config.dangerouslyUpdateWebpackConfig) {
		webpackConfig = config.dangerouslyUpdateWebpackConfig(webpackConfig, env);
	}

	return webpackConfig;
}
