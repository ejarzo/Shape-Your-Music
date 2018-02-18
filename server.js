/* eslint-disable no-var, strict */
var webpack   = require('webpack');
var devServer = require('webpack-dev-server');
var config    = require('./webpack.config');


new devServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
})
.listen(5000, 'localhost', function (err) {
  console.log(err? err : null);
  console.log('Listening at localhost:5000');
});
