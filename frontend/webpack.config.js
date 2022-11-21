const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: "development",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "styles", to: "styles"},
                {from: "static/fonts", to: "fonts"},
                {from: "static/images", to: "images"},
                {from: "config", to: "config"},
                {from: "node_modules/bootstrap/dist/css", to: "bootstrap/css"},
                {from: "node_modules/bootstrap/dist/js", to: "bootstrap/js"},
                {from: "node_modules/jquery/dist", to: "jquery"},
                {from: "node_modules/@popperjs/core/dist/umd", to: "@popperjs"},
                {from: "node_modules/bootstrap-datepicker/dist/js", to: "datepicker/js"},
                {from: "node_modules/bootstrap-datepicker/dist/locales", to: "datepicker/locales"},
                {from: "node_modules/bootstrap-datepicker/dist/css", to: "datepicker/css"},
                {from: "node_modules/chart.js/dist", to: "chart.js/dist"}
            ],
        }),
    ],
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             exclude: /(node_modules)/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: ['@babel/preset-env']
    //                 }
    //             }
    //         }
    //     ]
    // },
    devServer: {
        static: ".dist",
        compress: true,
        port: 9000,
    },
};