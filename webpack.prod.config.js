const webpack = require('webpack');

const devConfig = require('./webpack.config');

const prodConfig = {
	...devConfig,
	watch: false,
	mode: 'production',
	devtool: false,
	plugins: [
		...devConfig.plugins,
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
		}),
		// new UglifyJSPlugin({
		// 	uglifyOptions: {
		// 		ecma: 8
		// 	}
		// })
	],
	devServer: undefined,
};

console.log('webpack.prod.config.js', JSON.stringify(prodConfig));

module.exports = prodConfig;
