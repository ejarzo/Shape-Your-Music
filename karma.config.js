var webpack       = require('karma-webpack');
var webpackConfig = require('./webpack.config');
var Text          = require('extract-text-webpack-plugin');


module.exports = function (config) {
  config.set({
    frameworks: [ 'mocha', 'chai', 'sinon', 'sinon-chai' ],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'src/components/**/*spec.js'
    ],
    plugins: [
      webpack,
      'karma-mocha',
      'karma-coverage',
      'karma-spec-reporter',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-sinon',
      'karma-sinon-chai'
    ],
    browsers: ['Chrome'],
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },
    preprocessors: {
      'src/**/*spec.js': ['webpack'],
      'src/**/*.js': ['webpack'],
      'tests.webpack.js': ['webpack']
    },
    reporters: [ 'coverage', 'mocha' ],
    webpack: webpackConfig,
    webpackMiddleware: { noInfo: true },
    singleRun: true,
    colors: true,
    autowatch: true
  });
};
