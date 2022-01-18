const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge").merge;
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
	mode: "development",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
	devtool: "inline-source-map",
	devServer: {
		static: "./dist",
		watchFiles: ["src/*.html"],
		open: {
			app: {
				name: "google-chrome",
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader",
				  ],
			},
		],
	},
    plugins: [
		new HtmlWebpackPlugin({
			template: "./src/template.html",
		}),
	],
});
