const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    let baseUrl = "/";
    let outputPath = path.resolve(__dirname, 'dist');

    if (argv.mode === 'production') {
        outputPath = path.resolve(__dirname, 'docs');
        baseUrl = "/lumincoin-finance/";
    }

    return {
        entry: './src/app.js',
        mode: "none",
        output: {
            filename: 'main.js',
            path: outputPath,
            clean: true,
        },
        plugins: [
            new webpack.NormalModuleReplacementPlugin(
                /config\/pathConfig/gi,
                resource => {
                    argv.mode === 'production' ?
                        resource.request = resource.request.replace('.js', '.prod.js') :
                        resource.request = resource.request.replace('.js', '.dev.js')
                }
            ),
            new HtmlWebpackPlugin({
                template: "./index.html",
                baseUrl: baseUrl
            }),
            new CopyPlugin({
                patterns: [
                    { from: "templates", to: "templates" },
                    { from: "styles", to: "styles" },
                    { from: "static/fonts", to: "fonts" },
                    { from: "static/images", to: "images" },
                    { from: "node_modules/bootstrap/dist/css", to: "bootstrap/css" },
                    { from: "node_modules/bootstrap/dist/js", to: "bootstrap/js" },
                    { from: "node_modules/jquery/dist", to: "jquery" },
                    { from: "node_modules/@popperjs/core/dist/umd", to: "@popperjs" },
                    { from: "node_modules/bootstrap-datepicker/dist/js", to: "datepicker/js" },
                    { from: "node_modules/bootstrap-datepicker/dist/locales", to: "datepicker/locales" },
                    { from: "node_modules/bootstrap-datepicker/dist/css", to: "datepicker/css" },
                ],
            })
        ]
    };
};