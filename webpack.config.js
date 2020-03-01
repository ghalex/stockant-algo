const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/demo/index.ts',
  devtool: 'source-map',
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
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [new HtmlWebpackPlugin({ template: 'public/index.html' })],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
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
