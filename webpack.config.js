/**
 * For WSL2 add this to ~/.bashrc
 * export HOST_MACHINE="$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}')"
 */

const path = require('path');
const webpack = require('webpack');
const homedir = require('os').homedir();
const fs = require('fs');
const { InjectManifest } = require('workbox-webpack-plugin');

let [httpsKey, httpsCert] = [null, null];

try {
	httpsKey = fs.readFileSync(`/Users/ata/Documents/certs/local.swipetor.com/site.key`);
	httpsCert = fs.readFileSync(`/Users/ata/Documents/certs/local.swipetor.com/site.crt`);
} catch (error) {
	if (error.code === 'ENOENT') {
		console.warn(`File ${error.path} not found. Defaulting key to null.`);
	} else {
		throw error;
	}
}

module.exports = {
	mode: 'development',
	entry: {
		// vendor: [ 	'regenerator-runtime/runtime', 	'react', 	'react-dom', 	'jquery',
		// 	'redux', 	'react-redux', 	'react-router-dom', 	'js-cookie', 	'material-ui',
		// 	'axios', 	'moment', 	'prop-types', 	'querystring-es3', ],
		// vendor: ['@babel/polyfill'],
		ui: [path.resolve(__dirname, 'src/Main.tsx')],
	},
	output: {
		filename: '[name].bundle.js',
		sourceMapFilename: '[name].bundle.map',
		path: __dirname + '/public/build',
		publicPath: '/public/build/',
	},
	module: {
		rules: [
			// babelLoader,
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					configFile: 'tsconfig-webpack.json',
				},
			},
			{
				test: /\.less$/i,
				use: [
					{
						loader: 'style-loader', // creates style nodes from JS strings
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
						}, // translates CSS into CommonJS
					},
					{
						loader: 'less-loader', // compiles Less to CSS
					},
				],
			},
			{
				test: /\.css$/i,
				use: [
					{
						loader: 'style-loader', // creates style nodes from JS strings
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
						}, // translates CSS into CommonJS
					},
				],
			},
			//#region Archive
			/**
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
				options: {
					"useBabel": true,
					"babelOptions": {
						 "babelrc": true,
					},
					"babelCore": "@babel/core", // needed for Babel v7
			  }
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader',
			},
			{test: /\.js?/, loader: 'babel-loader'},
			*/
			//#endregion
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
		alias: {
			src: path.resolve('./src'),
			react: path.resolve('./node_modules/react'),
			'react-dom': path.resolve('./node_modules/react-dom'),
			'react-router-dom': path.resolve('./node_modules/react-router-dom'),
		},
		fallback: {
			// path: false,
			// stream: false,
			// crypto: false,
			// https: false,
			// http: false,
			// zlib: false,
			// tls: false,
			// request: false,
			// fs: false
		},
	},
	devtool: 'inline-source-map',
	plugins: [
		// new webpack.optimize.CommonsChunkPlugin({ 	name: 'vendor', 	minChunks:
		// Infinity, }), new webpack.optimize.UglifyJsPlugin({ 	sourceMap: true }),
		new webpack.HotModuleReplacementPlugin(),
		new InjectManifest({
			swSrc: path.join(process.cwd(), 'src/init/sw'),
			maximumFileSizeToCacheInBytes: 20 * 1024 * 1024, //20mb,
		}),
	],
	devServer: {
		// contentBase: '',
		// contentBasePublicPath: '/public',
		devMiddleware: { publicPath: '/public/build/' },
		client: {
			overlay: {
				errors: false,
				warnings: false,
				runtimeErrors: error => {
					if (error.message === 'handled') {
						return false;
					}
					return false;
					// return true;
				},
			},
		},
		host: '0.0.0.0', //'0.0.0.0',
		port: 8010,
		http2: true,
		https: {
			key: httpsKey,
			cert: httpsCert,
		},
		proxy: {
			'!/public/build/**': {
				target: `http://localhost:8000`,
				// ws: true,
				bypass: function (req, res, proxyOptions) {
					if (req.path === '/sw.js') {
						return '/public/build/sw.js';
					}
				},
				proxyTimeout: 1000 * 60 * 60, // in ms
				timeout: 1000 * 60 * 60,
			},
		},
		allowedHosts: ['localhost', 'local.swipetor.com', 'lan.swipetor.com', 'local2.swipetor.com'],
		hot: 'only',
		headers: {
			'Cache-Control': 'no-cache, no-store, max-age=-1',
			Pragma: 'no-cache',
			Expires: '-1',
		},
		// writeToDisk: true,
		// stats: true,
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all',
				},
			},
		},
		usedExports: true,
		// minimize: true // already true in production
	},
};
