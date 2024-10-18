module.exports = {
	root: true,
	settings: {
		react: {
			createClass: 'createReactClass', // Regex for Component Factory to use,
			// default to "createReactClass"
			pragma: 'React', // Pragma to use, default to "React"
			fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
			version: 'detect', // React version. "detect" automatically picks the version you have installed.
		},
		propWrapperFunctions: [
			// The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
			'forbidExtraProps',
			{ property: 'freeze', object: 'Object' },
			{ property: 'myFavoriteWrapper' },
		],
		linkComponents: [
			// Components used as alternatives to <a> for linking, eg. <Link to={ url } />
			'Hyperlink',
			{ name: 'Link', linkAttribute: 'to' },
		],
	},
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:prettier/recommended',
		'plugin:promise/recommended',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['react', '@typescript-eslint', 'promise', 'unused-imports'],
	rules: {
		'unused-imports/no-unused-imports': 'error',
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'no-tabs': 0,
		semi: 'off',
		'require-await': 'off', // disabled in favour of @typescript-eslint/require-await
		'react/no-unescaped-entities': 'off',
		'no-duplicate-imports': ['error', { includeExports: true }],
		'react/prop-types': 'off',
		'prettier/prettier': 'off',
		'no-return-await': 'error',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/semi': ['error'],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/no-floating-promises': 'off', // Because in UI floating promises are common
		'@typescript-eslint/require-await': 'warn',
		'@typescript-eslint/promise-function-async': [
			'error',
			{
				allowedPromiseNames: ['Thenable'],
				checkArrowFunctions: true,
				checkFunctionDeclarations: true,
				checkFunctionExpressions: true,
				checkMethodDeclarations: true,
			},
		],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
	},
};
