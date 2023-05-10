const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    let baseUrl = "/";
    let outputPath = path.resolve(__dirname, 'dist');
    let patterns = [
        { from: "templates", to: "templates" },
        { from: "styles", to: "styles" },
        { from: "static/fonts", to: "fonts" },
        { from: "static/images", to: "images" },
        { from: "config", globOptions: { ignore: ["**/*prod.js"] }, to: "config" },
        { from: "node_modules/bootstrap/dist/css", to: "bootstrap/css" },
        { from: "node_modules/bootstrap/dist/js", to: "bootstrap/js" },
        { from: "node_modules/jquery/dist", to: "jquery" },
        { from: "node_modules/@popperjs/core/dist/umd", to: "@popperjs" },
        { from: "node_modules/bootstrap-datepicker/dist/js", to: "datepicker/js" },
        { from: "node_modules/bootstrap-datepicker/dist/locales", to: "datepicker/locales" },
        { from: "node_modules/bootstrap-datepicker/dist/css", to: "datepicker/css" },
    ];
    let pattern = {};

    if (argv.mode === 'production') {
        outputPath = path.resolve(__dirname, 'docs');
        baseUrl = "/lumincoin-finance/";
        pattern = { from: "config/pathConfig.prod.js", to: "config/pathConfig.js", force: true };
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
            new HtmlWebpackPlugin({
                template: "./index.html",
                baseUrl: baseUrl
            }),
            new CopyPlugin({
                patterns: !!Object.keys(pattern).length ? (() => {
                    patterns.push(pattern);
                    return patterns;
                })() : patterns,
            }),
        ]
    };
};