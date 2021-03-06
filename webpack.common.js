const path = require("path");

module.exports = {
	entry: {
		index: "./src/index.js",
	},
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,

				type: "asset/resource",
			},
		],
	},
};
