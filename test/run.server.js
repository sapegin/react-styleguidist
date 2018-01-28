const path = require('path');
const styleguidist = require('../scripts');

/* eslint-disable no-console */

const dir = path.resolve(__dirname, '../examples/basic/src');

styleguidist({
	components: path.resolve(dir, 'components/**/[A-Z]*.js'),
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
					loader: 'style-loader!css-loader?modules',
				},
			],
		},
	},
	logger: {
		info: console.log,
		warn: message => console.warn(`Warning: ${message}`),
	},
	serverPort: 8082,
}).server((err, config) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Listening at http://' + config.serverHost + ':' + config.serverPort);
	}
});
