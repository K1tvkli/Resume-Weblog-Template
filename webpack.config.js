const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (_env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/main.ts',
        output: {
            filename: 'bundle.[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]',
                    },
                },
                {
                    test: /\.(png|jpg|jpeg|gif|webp|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext]',
                    },
                },
            ],
        },
        plugins: [
            new Dotenv({
                path: './.env',
                safe: false, // بررسی نکند که همه متغیرها در .env.example هم موجود باشند
                systemvars: true, // متغیرهای محیطی سیستم را هم بخواند
                silent: false, // خطاها را نشان دهد
                defaults: false,
            }),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                minify: isProduction ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                } : false,
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: '1761039807638.jpg',
                        to: '1761039807638.jpg',
                        noErrorOnMissing: true
                    },
                    {
                        from: 'public/fonts',
                        to: 'fonts',
                        noErrorOnMissing: true
                    },
                    {
                        from: 'public/images',
                        to: 'images',
                        noErrorOnMissing: true
                    },
                    {
                        from: 'src/images',
                        to: 'images',
                        noErrorOnMissing: true
                    },
                ],
            }),
        ],
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: 3000,
            open: true,
            hot: true,
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map',
    };
};
