const { extendDefaultPlugins } = require('svgo')

module.exports = {
  plugins: extendDefaultPlugins([
    {
      name: 'removeAttrs',
      params: {
        attrs: ['class', 'data-name', 'fill.*', 'stroke.*'],
      },
    },
  ]),
}
