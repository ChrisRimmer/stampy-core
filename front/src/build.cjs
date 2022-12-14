/* eslint-env node*/

const path = require("path");

const esbuild = require("esbuild");

esbuild.build({
	bundle: true,
	entryPoints: [path.resolve(__dirname, "./index.tsx")],
	inject: [path.resolve(__dirname, "./utils/react-shim.ts")],
	loader: {
		".ts": "ts",
		".tsx": "tsx",
	},
	outfile: path.resolve(__dirname, "../dist/app.js"),
	resolveExtensions: [".ts", ".js", ".tsx"],
	sourcemap: true,
});
