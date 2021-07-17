const path = require('path');

const dir = path.resolve(__dirname, 'lib');

module.exports = {
	title: 'React Style Guide Example',
	components: './components/**/[A-Z]*.js',
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					include: dir,
					loader: 'babel-loader',
				},
				{
					test: /\.css$/,
					include: dir,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: true,
							},
						},
					],
				},
			],
		},
	},
};
