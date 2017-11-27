var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')

var glob = require('glob');
var entries =  utils.getMultiEntry('./src/'+config.moduleName+'/**/**/*.js'); // 获得入口js文件
var chunks = Object.keys(entries);
// console.log(chunks)
// console.log('name')

var projectRoot = path.resolve(__dirname, '../')
// const vuxLoader = require('vux-loader')

var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

let webpackConfig = {
  entry: entries,
  // entry:{ 'pages/index/index': './src/pages/index/index/index.js'},
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.min.js',
      'mint-ui$': 'mint-ui/lib/index.js',
      'axios$': 'axios/dist/axios.min.js',
      'vue-router$': 'vue-router/dist/vue-router.min.js',
      'vuex$': 'vuex/dist/vuex.min.js',
      '@': resolve('src'),
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'config': path.resolve(__dirname, '../src/config'),
      'store': path.resolve(__dirname, '../src/store'),
      'views': path.resolve(__dirname, '../src/views'),
      'pages': path.resolve(__dirname, '../src/pages'),
    }
  },
  module: {

    rules: [

      // {
      //   enforce: 'pre',
      //   test: /\.vue$/,
      //   loader: 'eslint',
      //   include: [
      //     resolve('src'), resolve('test')
      //   ],
      //   exclude: [/node_modules/, /build/]
      // },
      // {
      //   enforce: 'pre',
      //   test: /\.js$/,
      //   loader: 'eslint',
      //   include: [
      //     resolve('src'), resolve('test')
      //   ],
      //   exclude: [/node_modules/, /build/]
      // },

      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: "pre",
      //   include: [resolve('src'), resolve('test')],
      //   exclude: [/node_modules/, /build/, /assets/],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   }
      // },

      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 1,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 1,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },

    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: [
        require('autoprefixer')({
          browsers: ['iOS >= 7', 'Android >= 4.1']
        })
      ]
    }),
    new ProgressBarPlugin(),

  ]
}


module.exports = webpackConfig;

// module.exports = vuxLoader.merge(webpackConfig, {
//     options: {

//   },
//   plugins: ['vux-ui','progress-bar', 'duplicate-style']
// })
