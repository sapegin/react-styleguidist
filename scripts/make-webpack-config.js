'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const forEach = require('lodash/forEach');
const mergeWebpackConfig = require('./utils/mergeWebpackConfig');
const StyleguidistOptionsPlugin = require('./utils/StyleguidistOptionsPlugin');

const RENDERER_REGEXP = /Renderer$/;

let sourceDir = null;

const htmlLoader = require.resolve('html-webpack-plugin/lib/loader');

module.exports = function(config, env) {
	process.env.NODE_ENV = process.env.NODE_ENV || env;

	if (config.dev) {
		sourceDir = path.resolve(__dirname, '../src');
	} else {
		sourceDir = path.resolve(__dirname, '../lib');
	}

	const isProd = env === 'production';
	const customScssPath = config.customScss && config.customScss.length ?
		path.resolve(process.cwd(), config.customScss) : path.resolve(__dirname, 'src/custom.scss');

	let webpackConfig = {
		entry: config.require.concat([path.resolve(sourceDir, 'index')]),
		output: {
			path: config.styleguideDir,
			filename: 'build/[name].bundle.js',
			chunkFilename: 'build/[name].js',
		},
		resolve: {
			extensions: ['.js', '.jsx', '.json'],
			alias: {
				'rsg-codemirror-theme.css': `codemirror/theme/${config.highlightTheme}.css`,
				'rsg-custom-theme.scss': customScssPath,
			},
		},
		plugins: [
			new StyleguidistOptionsPlugin(config),
			new HtmlWebpackPlugin({
				title: config.title,
				template: `!!${htmlLoader}!${config.template}`,
				inject: true,
			}),
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
		webpackConfig = merge(webpackConfig, {
			output: {
				filename: 'build/bundle.[chunkhash:8].js',
				chunkFilename: 'build/[name].[chunkhash:8].js',
			},
			plugins: [
				new UglifyJSPlugin({
					parallel: true,
					cache: true,
					uglifyOptions: {
						ie8: false,
						ecma: 5,
						compress: {
							keep_fnames: true,
							warnings: false,
						},
						mangle: {
							keep_fnames: true,
						},
					},
				}),
				new CleanWebpackPlugin(['build'], {
					root: config.styleguideDir,
					verbose: config.verbose === true,
				}),
				new CopyWebpackPlugin(
					config.assetsDir
						? [
								{
									from: config.assetsDir,
								},
							]
						: []
				),
			],
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

	// Custom style guide components
	if (config.styleguideComponents) {
		forEach(config.styleguideComponents, (filepath, name) => {
			const fullName = name.match(RENDERER_REGEXP)
				? `${name.replace(RENDERER_REGEXP, '')}/${name}`
				: name;
			webpackConfig.resolve.alias[`rsg-components/${fullName}`] = filepath;
			webpackConfig.resolve.alias[`custom-rsg-components/${fullName}`] = filepath;
			webpackConfig.resolve.alias[`store/${fullName}`] = filepath;
		});
	}

	// Add components folder alias at the end so users can override our components to customize the style guide
	// (their aliases should be before this one)
	webpackConfig.resolve.alias['rsg-components'] = path.resolve(sourceDir, 'rsg-components');
	webpackConfig.resolve.alias['custom-rsg-components'] = path.resolve(sourceDir, 	'custom-rsg-components');
	webpackConfig.resolve.alias.store = path.resolve(sourceDir, 	'store');

	if (config.dangerouslyUpdateWebpackConfig) {
		webpackConfig = config.dangerouslyUpdateWebpackConfig(webpackConfig, env);
	}

	return webpackConfig;
};
