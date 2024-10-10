webpack-analyze:
	NODE_ENV=production webpack --config ./webpack.prod.config.js --profile --json > stats.json
stats:
	webpack-bundle-analyzer stats.json