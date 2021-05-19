var path = require('path')
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

var PATHS = {
  entryPoint: path.resolve(__dirname, '../src/lib/index.ts'),
  bundles: path.resolve(__dirname, '../bundles')
}

var config = {
  entry: {
    'stockant-algo': [PATHS.entryPoint]
  },
  devtool: 'source-map',
  output: {
    path: PATHS.bundles,
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'StockAntAlgo',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  }
}

module.exports = config
