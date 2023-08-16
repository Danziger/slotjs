const path = require('path');
const childProcess = require('child_process');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const hasha = require('hasha');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const pkg = require('./package.json');

module.exports = (env, {
    mode,
}) => {
    const DEV = /development|dev/i.test(mode);
    const PROD = /production|prod/i.test(mode);
    const COMMIT_HASH = childProcess.execSync('git rev-parse HEAD').toString().trim();
    const BUILD_DATE = new Date();

    const config = {
        devtool: DEV ? 'eval-source-map' : 'source-map',

        entry: {
            main: [
                './src/app/main.js',
                './src/app/main.scss',
            ],
        },

        /*
        // TODO: Integrate with ESLint:
        // https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/1321
        resolve: {
            alias: {
                common: path.resolve(__dirname, 'src/common/'),
            },
        },
        */

        output: {
            filename: PROD ? '[name].[contenthash].js' : '[name].[fullhash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: './',
        },

        devServer: {
            static: {
                directory: path.resolve(__dirname, 'static'),
            },
            devMiddleware: {
                publicPath: '/slotjs/',
                // When sharing the site using ssh -R 80:localhost:8080 ssh.localhost.run
                // disableHostCheck: true,
            },
            client: {
                overlay: {
                    warnings: false,
                    errors: false,
                },
            },
        },

        module: {
            rules: [{
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
            }, {
                test: /\.ejs$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ejs-compiled-loader',
                },
            }],
        },

        plugins: [
            new ESLintPlugin({ fix: true }),

            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, 'dist/index.html'),
                template: path.resolve(__dirname, 'src/app/components/app/app.template.ejs'),
                title: 'SlotJS \\ Circular slot machine mobile-first SPA built using JavaScript, CSS variables and Emojis!',
                description: pkg.description,
                favicon: path.resolve(__dirname, 'static/favicon.ico'),
                inlineSource: '.(js|css)$', // Inline JS and CSS.
                minify: PROD,
                meta: {
                    author: pkg.author.name,
                    description: pkg.description,
                },
                // We can use templateParameters if more options are required, but it will override all the above.
            }),

            new MiniCssExtractPlugin({
                filename: PROD ? '[name].[contenthash].css' : '[name].[fullhash].css',
            }),

            new StyleLintPlugin({
                fix: true,
            }),

            new CopyWebpackPlugin({
                patterns: [{
                    from: 'static',
                }],
            }),

            // Defines variables available globally that Webpack can evaluate in compilation time and remove dead code:
            // new webpack.DefinePlugin({}),

            // Same as before, but sets properties inside `process.env` specifically:
            new webpack.EnvironmentPlugin({
                DEV,
                PROD,
                BUILD_DATE,
                COMMIT_HASH,
            }),

            // new BundleAnalyzerPlugin(),
        ],

        optimization: {
            minimize: true,

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

            minimizer: PROD ? [
                '...',
                new CssMinimizerPlugin(),
            ] : [],
        },
    };

    // if (PROD) {}

    return config;
};
