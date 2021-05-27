module.exports = {
  plugins: {
    'postcss-preset-env': {
      browsers: '> 1%, last 2 versions, not dead, not IE 11',
      autoprefixer: { cascade: false, grid: true },
      stage: 0,
    },
  },
}
