const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'
const rootPath = path.resolve(process.cwd(), 'src')

const JSLoader = {
  test: /\.js$/i,
  exclude: /(node_modules|bower_components)/,
  use: ['babel-loader'],
}

const HtmlLoader = {
  test: /\.html$/i,
  use: [
    'html-loader',
    {
      loader: 'posthtml-loader',
      options: {
        plugins: [
          require('posthtml-include')({ root: rootPath }),
          require('posthtml-expressions')({}),
        ],
      },
    },
  ],
}

const CSSLoader = {
  test: /\.(s[ac]ss|css)$/i,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: (resourcePath, ctx) => path.relative(path.dirname(resourcePath), ctx) + '/',
      },
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: path.resolve(__dirname, 'postcss.config.js'),
        },
      },
    },
    // 'group-css-media-queries-loader',
    'sass-loader',
    'import-glob-loader',
  ],
}

const IMGLoader = {
  test: /\.(jpe?g|png|webp|gif|tiff)$/i,
  type: 'asset/resource',
  generator: {
    filename: './img/[name][ext]',
    // filename: ({ filename }) => filename.replace('assets/', ''),
  },
}

const SVGLoaderMono = {
  test: /(mono).*\.svg$/,
  use: [
    {
      loader: 'svg-sprite-loader',
      options: {
        // extract: true,
        // outputPath: './img/sprites/',
        // spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`,
      },
    },
    'svg-transform-loader',
    {
      // loader: require.resolve('svgo-loader'),
      loader: require.resolve('@stefanprobst/svgo-loader'),
      options: {
        // configFile: path.resolve(__dirname, 'svgo.config.js'),
        plugins: [
          {
            removeAttrs: {
              attrs: ['class', 'data-name', 'fill.*', 'stroke.*'],
            },
          },
        ],
      },
    },
  ],
}

const SVGLoaderMulti = {
  test: /(multi).*\.svg$/,
  use: [
    {
      loader: 'svg-sprite-loader',
      // options: {
      //   extract: true,
      //   outputPath: './img/sprites/',
      //   spriteFilename: svgPath => `sprite${svgPath.substr(-4)}`,
      // },
    },
    'svg-transform-loader',
    {
      // loader: require.resolve('svgo-loader'),
      loader: require.resolve('@stefanprobst/svgo-loader'),
      options: {
        // configFile: path.resolve(__dirname, 'svgo.config.js'),
        plugins: [
          {
            removeAttrs: {
              attrs: ['class', 'data-name'],
            },
          },
        ],
      },
    },
  ],
}

const FONTLoader = {
  // test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
  test: /\.(woff(2)?)$/,
  type: 'asset',
  generator: {
    filename: 'fonts/[name][ext]',
  },
}

module.exports = {
  JSLoader: JSLoader,
  HtmlLoader: HtmlLoader,
  CSSLoader: CSSLoader,
  IMGLoader: IMGLoader,
  SVGLoaderMono: SVGLoaderMono,
  SVGLoaderMulti: SVGLoaderMulti,
  FONTLoader: FONTLoader,
}
