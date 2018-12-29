const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const pkg = require('./package.json');

module.exports = {
    devtool: 'eval-source-map',

    entry: {
        main: [
            './src/app/main.js',
            './src/app/main.scss',
        ],
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: './',
    },

    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        publicPath: '/slotjs/',
        https: true,
    },

    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'eslint-loader',
                options: {
                    fix: true,
                },
            },
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            },
        }, {
            test: /\.scss/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'sass-loader',
            ],
        }],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, 'dist/index.html'),
            template: path.resolve(__dirname, 'src/app/templates/index.html'),
            title: `SlotJS / ${ pkg.description }`,
            favicon: path.resolve(__dirname, 'static/favicon.ico'),
            inlineSource: '.(js|css)$', // Inline JS and CSS.
            meta: {
                author: pkg.author.name,
                description: pkg.description,
            },
            // We can use templateParameters if more options are required, but it will override all the above.
        }),
        new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new StyleLintPlugin({
            syntax: 'scss',
            fix: true,
        }),
        new CopyWebpackPlugin([{
            from: 'static',
        }]),
        new webpack.DefinePlugin({
            'process.env': {
                DEVELOPMENT: true,
            },
        }),
    ],

    optimization: {
        // Extract all styles in a single file:
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
};
