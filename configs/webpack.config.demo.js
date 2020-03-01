const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../src/demo/index.ts'),
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [new HtmlWebpackPlugin({ template: 'public/index.html' })],
  node: {
    fs: 'empty'
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    host: 'localhost',
    stats: 'minimal',
    hot: true,
    contentBase: 'public/'
  }
}
