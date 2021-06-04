const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const loaders = require('./loaders')
const { MiniCssExtractPlugin, ESLintPlugin } = require('./plugins')

const isDev = process.env.NODE_ENV === 'development'
const rootPath = path.join(process.cwd())
const PAGES_DIR = path.join(rootPath, 'src')
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'))

module.exports = {
  context: path.resolve(rootPath, 'src'),
  entry: {
    main: './js/main.js',
    sprites: './js/sprites.js',
  },
  output: {
    filename: isDev ? './js/[name].js' : './js/[name].[contenthash:12].js',
    path: path.resolve(rootPath, 'app'),
    publicPath: '',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        utilityVendor: {
          test: /\/node_modules\/(lodash|moment|moment-timezone)\//,
          name: 'utility',
          // chunks: 'all',
        },
        vendor: {
          test: /\/node_modules\/((?!(bootstrap|lodash|moment|moment-timezone)).*)\//,
          name: 'vendor',
          // chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      loaders.HtmlLoader,
      loaders.JSLoader,
      loaders.CSSLoader,
      loaders.IMGLoader,
      loaders.SVGLoaderMono,
      loaders.SVGLoaderMulti,
      loaders.FONTLoader,
    ],
  },
  plugins: [
    ...PAGES.map(
      page =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `${page}`,
          favicon: './assets/favicon.ico',
        })
    ),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    MiniCssExtractPlugin,
    ESLintPlugin,
    new SpriteLoaderPlugin(),
  ],
}
