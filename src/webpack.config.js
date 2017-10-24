var path = require("path");
var fs = require("fs");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var BomPlugin = require("webpack-utf8-bom");
var CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = [{
        devtool: "source-map",
        entry: {
            bundle: "./src-new/browser/ui/entry.js"
        },
        output: {
            path: path.resolve(__dirname, "./dist/browser/html"),
            filename: "[name].js",
            sourceMapFilename: "bundle.map"
        },
        resolve: {
            extensions: [".js", ".jsx"]
        },
        module: {
            loaders: [{
                    test: /\.(js|jsx)$/,
                    loader: "babel-loader",
                    include: [path.resolve(__dirname, "src")],
                    exclude: [/node_modules/, "./src/electron-main", "./src/platform"],
                    query: {
                        presets: ["babel-preset-es2015", "babel-preset-react"],
                        plugins: [
                            [
                                require("babel-plugin-import"),
                                { libraryName: "antd", style: "css" }
                            ]
                        ]
                    }
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    loader: "file-loader",
                    query: {
                        name: "assets/[name].[ext]?[hash]"
                    }
                },
                {
                    test: /\.(eot|ttf|svg|woff2?)(\?.*)?$/,
                    loader: "url-loader?limit=100&name=fonts/[name].[ext]"
                },
                {
                    test: /\.(css|scss)$/,
                    loaders: ["style-loader", "css-loader", "sass-loader"]
                },
                {
                    test: /\.(htm|html)$/,
                    loader: "html-loader",
                    query: {
                        name: "[name].[ext]?[hash]"
                    }
                },
                {
                    test: /\.node$/,
                    loader: "node-loader"
                }
            ]
        },
        target: "electron",
        plugins: [
            new HtmlWebpackPlugin({
                template: "src/browser/templates/index.html",
                inject: false
            }),
            new HtmlWebpackPlugin({
                title: "error",
                filename: "error.html",
                template: "src/browser/templates/error.ejs",
                inject: false
            }),
            new BomPlugin(true, /\.(js|jsx)$/),
            new CopyWebpackPlugin([{
                    from: path.resolve("src-new/browser", "assets"),
                    to: path.resolve("dist/browser/html/assets")
                },
                {
                    from: path.resolve("src-new/browser", "i18n", "locales"),
                    to: path.resolve("dist/browser/html/assets", "locales")
                }
            ])
        ]
    },
    {
        entry: "./src/electron-main/main.js",
        output: {
            path: path.resolve(__dirname, "./dist/electron-main"),
            publicPath: "/dist/",
            filename: "main.js"
        },
        target: "electron",
        module: {
            exprContextCritical: true,
            wrappedContextCritical: true,
            wrappedContextRecursive: true,
            wrappedContextRegExp: /^\.\//,
            exprContextRegExp: /^\.\//,
            unknownContextRegExp: /^\.\//,
            loaders: [{
                test: /\.js$/,
                loader: "babel-loader",
                include: [path.resolve(__dirname, "src/electron-main")],
                exclude: [/node_modules/, /extensions/]
            }],
            rules: [{
                test: /\.node$/,
                use: "node-loader"
            }]
        },
        resolve: {
            modules: [path.resolve("./node_modules")]
        },
        externals: {
            sqlite3: "commonjs sqlite3",
            serialport: "commonjs serialport"
        },
        plugins: [
            new webpack.DefinePlugin({
                $dirname: "__dirname"
            })
        ]
    }
];