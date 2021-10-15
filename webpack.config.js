const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')

const cssOptions = {
  test: /\.(scss|css)$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
    'sass-loader',
  ],
}

const jsOptions = {
  test: /\.m?js$/,
  exclude: /(node_modules)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
    },
  },
}

module.exports = function (env, argv) {
  return {
    entry: './src/js/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: './',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: false,
      }),
      new ImageminWebpWebpackPlugin({
        config: [
          {
            test: /\.(jpe?g|png)/,
            options: {
              quality: 75,
            },
          },
        ],
        overrideExtension: true,
        detailedLogs: false,
        silent: false,
        strict: true,
      }),
      new CopyPlugin({
        patterns: [
          // { from: 'src/fonts', to: 'fonts', noErrorOnMissing: true },
          { from: 'src/images', to: 'images', noErrorOnMissing: true },
        ],
      }),
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        pngquant: {
          quality: '84-85',
        },
        gifsicle: {
          optimizationLevel: 1,
        },
        svgo: null,
        plugins: [
          imageminMozjpeg({
            quality: 85,
            progressive: true,
          }),
        ],
      }),
      new CleanWebpackPlugin(),
    ],

    module: {
      rules: [
        cssOptions,
        jsOptions,
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        // {
        //   test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        //   use: [
        //     {
        //       loader: 'file-loader',
        //       options: {
        //         name: '[name].[ext]',
        //         outputPath: 'fonts/',
        //         publicPath: '../fonts/',
        //       },
        //     },
        //   ],
        // },
      ],
    },

    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'dist'),
        },
      ],
      compress: true,
      port: 3010,
      devMiddleware: {
        writeToDisk: true,
      },
      // open: true,
    },
  }
}
