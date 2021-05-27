function requireAll(r) {
  r.keys().forEach(element => r(element))
}

requireAll(require.context('../assets/icons/', true, /\.svg$/))
