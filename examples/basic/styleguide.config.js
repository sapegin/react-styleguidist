const path = require('path');
const { version } = require('./package');

module.exports = {
	components: 'src/components/**/[A-Z]*.js',
	moduleAliases: {
		'rsg-example': path.resolve(__dirname, 'src'),
	},
	context: {
		_: 'lodash',
	},
	ribbon: {
		url: 'https://github.com/styleguidist/react-styleguidist',
	},
	version,
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
			],
		},
	},
};
