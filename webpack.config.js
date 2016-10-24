'use strict';

const libraryName = "tenogy",
	p = process.argv.indexOf("-p") !== -1;

module.exports = {
	entry: [
		__dirname + "/src/tenogy.ts"
	],

	//devtool: "source-map",

	resolve: {
		extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
	},

	module: {
		loaders: [
			{ test: /\.json$/, loader: "json-loader" },
			{ test: /\.tsx?$/, loader: "ts-loader?silent=true" }
		]
	},

	output: {
		path: __dirname + "/dist",
		filename: libraryName + (p ? ".min.js" : ".js"),
		library: libraryName,
		libraryTarget: "umd",
		umdNamedDefine: true
	}
};
