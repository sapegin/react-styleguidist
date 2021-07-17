module.exports = {
	components: 'src/components/**/[A-Z]*.js',
	webpackConfig: {
		resolve: {
			alias: {
				react: 'preact-compat',
				'react-dom': 'preact-compat',
			},
		},
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{
					test: /\.css$/,
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
