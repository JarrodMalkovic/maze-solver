const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackMajorVersion = require('webpack/package.json').version.split('.')[0];

module.exports = {
    context: __dirname,
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist/webpack-' + webpackMajorVersion),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve('./src/index.js'),
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: require('./.babelrc'),
            },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
            { test: /\.png$/, loader: 'file-loader' },
            { test: /\.html$/, loader: 'html-loader' },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve('./public/index.html'),
        }),
        new MiniCssExtractPlugin({ filename: 'index.css' }),
    ],
};
