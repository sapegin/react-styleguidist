const path = require('path');
const loaders = require('loaders');
module.exports = {
	title: 'React Style Guide Example',
	sections: [
		{
			name: 'Engineerrrring',
			components: './src/components/Button/[A-Z]*.js',
		},
		{
			name: 'Documentation',
			sections: [
				{
					name: 'First File',
					content: 'docs/One.md',
				},
				{
					name: 'Second File',
					content: 'docs/Two.md',
				},
			],
		},
		{
			name: 'Design',
			components: './src/components/**/[A-Z]*.js',
		},
	],
	require: [path.join(__dirname, 'src/styles.css')],
	webpackConfig: env => ({
		module: {
			loaders: loaders.all,
		},
		performance: env === 'development'
			? false
			: {
					maxAssetSize: 650000, // bytes
					maxEntrypointSize: 650000, // bytes
					hints: 'error',
				},
	}),
};
