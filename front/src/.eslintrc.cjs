/* eslint-env node*/

const safetyRules = {
	"no-template-curly-in-string": "warn",
	"no-unreachable-loop": "error",
	"no-unsafe-optional-chaining": "error",
	"no-useless-backreference": "error",
	"require-atomic-updates": "error",
};

const bestPracticesRules = {
	"array-callback-return": "error",
	"block-scoped-var": "error",
	"consistent-return": ["error", { treatUndefinedAsUnspecified: true }],
	"curly": ["error", "all"],
	"default-case": "error",
	"default-case-last": "error",
	"default-param-last": "error",
	"dot-location": ["error", "property"],
	"dot-notation": "error",
	"no-else-return": "off",
	"no-empty-function": "error",
	"no-empty-pattern": "error",
	"no-eq-null": "error",
	"no-eval": "error",
	"no-extend-native": "error",
	"no-floating-decimal": "error",
	"no-global-assign": "error",
	"no-implicit-globals": "error",
	"no-implied-eval": "error",
	"no-lone-blocks": "error",
	"no-multi-spaces": "error",
	"no-new-func": "error",
	"no-param-reassign": "error",
	"no-redeclare": "error",
	"no-return-assign": "error",
	"no-script-url": "error",
	"no-self-assign": "error",
	"no-self-compare": "error",
	"no-sequences": "error",
	"no-throw-literal": "error",
	"no-unused-expressions": "error",
	"no-useless-concat": "error",
	"no-useless-escape": "error",
	"no-useless-return": "error",
	"no-void": "error",
	"prefer-named-capture-group": "warn",
	"prefer-promise-reject-errors": "error",
};

const es6Rules = {
	"arrow-body-style": ["error", "as-needed"],
	"arrow-parens": ["error", "as-needed"],
	"arrow-spacing": "error",
	"no-useless-computed-key": "error",
	"no-useless-constructor": "error",
	"no-useless-rename": "error",
	"no-var": "error",
	"object-shorthand": "error",
	"prefer-arrow-callback": "error",
	"prefer-const": "error",
	"prefer-destructuring": [
		"warn",
		{
			array: true,
			object: true,
		},
		{
			enforceForRenamedProperties: false,
		},
	],
	"prefer-rest-params": "error",
	"prefer-spread": "error",
	"prefer-template": "error",
	"rest-spread-spacing": ["error", "never"],
	"template-curly-spacing": "error",
};

const styleRules = {
	"array-bracket-spacing": ["error", "never"],
	"array-element-newline": ["error", "consistent"],
	"autofix/array-bracket-spacing": ["error", "never"],
	"autofix/array-element-newline": ["error", "consistent"],
	"autofix/block-spacing": "error",
	"autofix/brace-style": ["error", "1tbs", { allowSingleLine: true }],
	"autofix/comma-dangle": ["warn", "always-multiline"],
	"autofix/comma-spacing": ["error"],
	"autofix/comma-style": "error",
	"autofix/eol-last": ["error", "always"],
	"autofix/func-call-spacing": "error",
	"autofix/function-call-argument-newline": ["error", "consistent"],
	"autofix/indent": ["error", "tab"],
	"autofix/jsx-quotes": ["error", "prefer-double"],
	"autofix/key-spacing": "error",
	"autofix/keyword-spacing": "error",
	"autofix/linebreak-style": "error",
	"autofix/lines-around-comment": [
		"error",
		{
			afterBlockComment: false,
			afterLineComment: false,
			beforeLineComment: false,
		},
	],
	"autofix/newline-per-chained-call": [
		"error",
		{
			ignoreChainWithDepth: 2,
		},
	],
	"autofix/no-multiple-empty-lines": [
		"error",
		{
			max: 2,
			maxBOF: 0,
			maxEOF: 0,
		},
	],
	"autofix/no-trailing-spaces": ["error"],
	"autofix/no-unneeded-ternary": "error",
	"autofix/no-whitespace-before-property": "error",
	"autofix/nonblock-statement-body-position": "error",
	"autofix/object-curly-newline": [
		"error",
		{
			consistent: true,
			multiline: true,
		},
	],
	"autofix/object-curly-spacing": ["error", "never"],
	"autofix/object-property-newline": [
		"error",
		{
			allowAllPropertiesOnSameLine: true,
		},
	],
	"autofix/operator-assignment": "error",
	"autofix/operator-linebreak": ["error", "before"],
	"autofix/padded-blocks": ["error", "never"],
	"autofix/prefer-exponentiation-operator": "error",
	"autofix/prefer-object-spread": "error",
	"autofix/quote-props": ["error", "consistent-as-needed"],
	"autofix/quotes": ["error", "double"],
	"autofix/semi": ["error", "always"],
	"autofix/sort-vars": "error",
	"autofix/space-before-blocks": ["error", "always"],
	"autofix/space-before-function-paren": "error",
	"autofix/space-in-parens": ["error", "never"],
	"autofix/space-infix-ops": "error",
	"autofix/spaced-comment": "error",
	"autofix/switch-colon-spacing": "error",
	"autofix/template-tag-spacing": "error",
	"block-spacing": "error",
	"brace-style": ["error", "1tbs", { allowSingleLine: true }],
	"camelcase": "warn",
	"comma-dangle": ["warn", "always-multiline"],
	"comma-spacing": ["error"],
	"comma-style": "error",
	"eol-last": ["error", "always"],
	"func-call-spacing": "error",
	"function-call-argument-newline": ["error", "consistent"],
	"indent": ["error", "tab"],
	"jsx-quotes": ["error", "prefer-double"],
	"key-spacing": "error",
	"keyword-spacing": "error",
	"line-comment-position": "error",
	"linebreak-style": "error",
	"lines-around-comment": [
		"error",
		{
			afterBlockComment: false,
			afterLineComment: false,
			beforeLineComment: false,
		},
	],
	"max-len": [
		"warn",
		{
			ignoreStrings: true,
			ignoreTemplateLiterals: true,
			tabWidth: 4,
		},
	],
	"multiline-ternary": ["error", "always-multiline"],
	"newline-per-chained-call": [
		"error",
		{
			ignoreChainWithDepth: 2,
		},
	],
	"no-array-constructor": "error",
	"no-inline-comments": "error",
	"no-mixed-operators": "error",
	"no-multi-assign": "error",
	"no-multiple-empty-lines": [
		"error",
		{
			max: 2,
			maxBOF: 0,
			maxEOF: 0,
		},
	],
	"no-negated-condition": "error",
	"no-nested-ternary": "error",
	"no-new-object": "error",
	"no-trailing-spaces": ["error"],
	"no-unneeded-ternary": "error",
	"no-whitespace-before-property": "error",
	"nonblock-statement-body-position": "error",
	"object-curly-newline": [
		"error",
		{
			consistent: true,
			multiline: true,
		},
	],
	"object-curly-spacing": ["error", "never"],
	"object-property-newline": [
		"error",
		{
			allowAllPropertiesOnSameLine: true,
		},
	],
	"operator-assignment": "error",
	"operator-linebreak": ["error", "before"],
	"padded-blocks": ["error", "never"],
	"prefer-exponentiation-operator": "error",
	"prefer-object-spread": "error",
	"quote-props": ["error", "consistent-as-needed"],
	"quotes": ["error", "double"],
	"react/jsx-closing-bracket-location": [1, "line-aligned"],
	"sort-keys-fix/sort-keys-fix": ["error", "asc", { natural: true }],
	"sort-vars": "error",
	"space-before-blocks": ["error", "always"],
	"space-before-function-paren": "error",
	"space-in-parens": ["error", "never"],
	"space-infix-ops": "error",
	"spaced-comment": "error",
	"switch-colon-spacing": "error",
	"template-tag-spacing": "error",
};

const variableRules = {
	"no-use-before-define": "error",
};

const reactRules = {
	"react/jsx-wrap-multilines": [
		"error",
		{
			arrow: "ignore",
			assignment: "ignore",
			condition: "ignore",
			declaration: "ignore",
			logical: "ignore",
			prop: "ignore",
			return: "ignore",
		},
	],
};

const importRules = {
	"import/export": "warn",
	"import/named": "warn",
	"import/namespace": "warn",
	"import/no-named-as-default": "off",
	"import/no-unresolved": "off",
	"import/order": [
		"error",
		{
			"alphabetize": {
				caseInsensitive: true,
				order: "asc",
			},
			"groups": ["builtin", "external", "parent", "sibling", "index"],
			"newlines-between": "always",
		},
	],
};

module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
	],
	ignorePatterns: [
		"compiled.js",
		"node_modules/**/*",
	],
	parserOptions: {
		source: "module",
	},
	plugins: ["react", "autofix", "sort-keys-fix", "import"],
	rules: {
		...bestPracticesRules,
		...es6Rules,
		...importRules,
		...reactRules,
		...safetyRules,
		...styleRules,
		...variableRules,
	},
	settings: {
		react: {
			version: "18.0",
		},
	},
};
