const _MiniCssExtractPlugin = require('mini-css-extract-plugin')
const _HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin')
const _ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const _StylelintPlugin = require('stylelint-webpack-plugin')
const _ESLintPlugin = require('eslint-webpack-plugin')
const { extendDefaultPlugins } = require("svgo")
const { resolve } = require('path')

const rootPath = resolve(process.cwd())
const isDev = process.env.NODE_ENV === 'development'

const MiniCssExtractPlugin = new _MiniCssExtractPlugin({
  filename: isDev ? './css/[name].css' : './css/[name].[contenthash:12].css',
})

const ESLintPlugin = new _ESLintPlugin({
  eslintPath: require.resolve('eslint'),
  overrideConfigFile: resolve(rootPath, '.eslintrc'),
  files: ['src', 'webpack'],
  extensions: ['jsx', 'js'],
})

const StylelintPlugin = new _StylelintPlugin({
  stylelintPath: require.resolve('stylelint'),
  configFile: resolve(rootPath, '.stylelintrc'),
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
  test: /\.(jpe?g|png|gif|svg|webp)$/i,
  exclude: /assets\/icons\/(?:mono|multi)\/.+\.svg$/,
  minimizerOptions: {
    plugins: [
      ['gifsicle', { interlaced: true, optimizationLevel: 3 }],
      ['mozjpeg', { quality: 80, progressive: true }],
      ['pngquant', { quality: [0.8, 0.9] }],
      ['imagemin-webp', { quality: 90 }],
      [
        'svgo',
        {
          plugins: extendDefaultPlugins([
            {
              name: "removeViewBox",
              active: false,
            },
            {
              name: "addAttributesToSVGElement",
              params: {
                attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
              },
            },
          ]),
        },
      ],
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
  StylelintPlugin: StylelintPlugin,
}
