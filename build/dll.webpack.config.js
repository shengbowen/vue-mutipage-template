const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path')
var config = require('../config')

module.exports = {
  entry: {
    vendor: ['vue', 'vue-router', 'vuex', 'axios', 'mint-ui']
  },
  output: {
    publicPath: '/dist/',
    path: config.build.assetsRoot,
    filename: 'js/[name].js',
    library: '[name]'               // 必填项，将此dll包暴露到window上，给app.js调用
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.min.js',
      'mint-ui$': 'mint-ui/lib/index.js'
    }
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,                // 必填项，用来标志manifest中的路径
      path: './config/manifest.json',    // 必填项，存放manifest的路径
      name: '[name]'                     // 必填项，manifest的name
    })
    // ,
    // new HtmlWebpackPlugin({              // 利用该插件实现vendor被插入到html中
    //   filename: '../app/layouts/index.html',
    //   template: './app/layouts/index.original.html',
    //   inject: 'body',
    //   hash: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true
    //   }
    // }),
    ,
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};