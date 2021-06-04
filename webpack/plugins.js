const _MiniCssExtractPlugin = require('mini-css-extract-plugin')
const _HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin')
const _ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const _ESLintPlugin = require('eslint-webpack-plugin')
const { resolve } = require('path')

const rootPath = resolve(process.cwd())
const isDev = process.env.NODE_ENV === 'development'

const MiniCssExtractPlugin = new _MiniCssExtractPlugin({
  filename: isDev ? './css/[name].css' : './css/[name].[contenthash:12].css',
})

const ESLintPlugin = new _ESLintPlugin({
  overrideConfigFile: resolve(rootPath, '.eslintrc'),
  files: ['src', 'webpack'],
  extensions: ['jsx', 'js'],
})

const HtmlBeautifyPlugin = new _HtmlBeautifyPlugin({
  config: {
    html: {
      end_with_newline: true,
      indent_size: 2,
      indent_with_tabs: true,
      indent_inner_html: true,
      preserve_newlines: true,
      unformatted: ['p', 'i', 'b', 'span'],
    },
  },
})

const ImageMinimizerPlugin = new _ImageMinimizerPlugin({
  test: /\.(jpe?g|png|gif)$/i,
  exclude: /\/icons/,
  minimizerOptions: {
    plugins: [
      ['gifsicle', { interlaced: true, optimizationLevel: 3 }],
      ['mozjpeg', { quality: 80, progressive: true }],
      ['pngquant', { quality: [0.8, 0.9] }],
    ],
  },
})

const ConvertToWebp = new _ImageMinimizerPlugin({
  test: /\.(jpe?g|png)$/i,
  deleteOriginalAssets: false,
  filename: 'img/[name].webp',
  minimizerOptions: {
    plugins: [['imagemin-webp', { quality: 80 }]],
  },
})

module.exports = {
  MiniCssExtractPlugin: MiniCssExtractPlugin,
  HtmlBeautifyPlugin: HtmlBeautifyPlugin,
  ImageMinimizerPlugin: ImageMinimizerPlugin,
  ConvertToWebp: ConvertToWebp,
  ESLintPlugin: ESLintPlugin,
}
