var path    = require('path');
var Text    = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:5000',
    'webpack/hot/dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    root: [path.resolve(__dirname, 'src')],
    extensions: ['', '.js', 'jsx']
  },
  plugins: [
    new Text('styles.css', { allChunks: true }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      'React':     'react',
      '_':         'lodash',
      'Promise':   'bluebird',
      'ReactDOM':  'react-dom',
      'cssModule': 'react-css-modules',
      'TestUtils': 'react-addons-test-utils'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ['react-hot-loader/webpack', 'babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loader: Text.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
      }
    ]
  },
  postcss: [ require('autoprefixer'), ],
};
