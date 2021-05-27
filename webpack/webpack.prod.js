const { merge } = require('webpack-merge')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const common = require('./webpack.config.js')
const { ImageMinimizerPlugin, ConvertToWebp } = require('./plugins')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      new TerserWebpackPlugin(),
    ],
  },
  plugins: [ImageMinimizerPlugin, ConvertToWebp],
})
