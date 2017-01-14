
const config = {
  entry: {
    diamond: './src/main.js'
  },
  output: {
    filename: './dist/diamond.js',
    library: 'diamondDb',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      { test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-2'],
        }
      }
    ]
  },
  target: 'node'
}

module.exports = config
