var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
// var WebpackChunkHash = require("webpack-chunk-hash");
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var WebpackMd5Hash = require('webpack-md5-hash');


var entries =  utils.getMultiEntry('./src/'+config.moduleName+'/**/**/*.js'); // 获得入口js文件

var chunks = Object.keys(entries);

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  //devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash:9].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash:9].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      }
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash:9].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),

    new webpack.optimize.CommonsChunkPlugin({ // 提取第三方库
        name: 'vendor',
        minChunks: function (module) {
            // this assumes your vendor imports exist in the node_modules directory
            return module.context && module.context.indexOf('node_modules') !== -1;
        }
    }),

    new webpack.optimize.CommonsChunkPlugin({ // 从第三方库提取vue相关
      name: 'vue',
      chunks: ['vendor'],
      // minChunks: 5
      minChunks: function (module) {
          // this assumes your vendor imports exist in the node_modules directory
          return module.context && module.context.indexOf('vue') !== -1;
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({ // webpack 运行时代码
        name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
    }),

    new webpack.HashedModuleIdsPlugin(),
    // new WebpackChunkHash(),
    new WebpackMd5Hash(),
    new ChunkManifestPlugin({
      filename: "chunk-manifest.json",
      manifestVariable: "webpackManifest",
      // inlineManifest: true
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   // Host that will be used in `server` mode to start HTTP server.
    //   analyzerHost: '127.0.0.1',
    //   // Port that will be used in `server` mode to start HTTP server.
    //   analyzerPort: 8888,
    //   // Path to bundle report file that will be generated in `static` mode.
    //   // Relative to bundles output directory.
    //   reportFilename: 'report.html',
    //   // Module sizes to show in report by default.
    //   // Should be one of `stat`, `parsed` or `gzip`.
    //   // See "Definitions" section for more information.
    //   defaultSizes: 'parsed',
    //   // Automatically open report in default browser
    //   openAnalyzer: true,
    //   // If `true`, Webpack Stats JSON file will be generated in bundles output directory
    //   generateStatsFile: false,
    //   // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
    //   // Relative to bundles output directory.
    //   statsFilename: 'stats.json',
    //   // Options for `stats.toJson()` method.
    //   // For example you can exclude sources of your modules from stats file with `source: false` option.
    //   // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
    //   statsOptions: null,
    //   // Log level. Can be 'info', 'warn', 'error' or 'silent'.
    //   logLevel: 'info'
    // })
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

// if (config.build.bundleAnalyzerReport) {
//   var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//   webpackConfig.plugins.push(new BundleAnalyzerPlugin())
// }

//构建生成多页面的HtmlWebpackPlugin配置，主要是循环生成
var pages =  utils.getMultiEntry('./src/'+config.moduleName+'/**/**/*.html');
for (var pathname in pages) {

  var conf = {
    filename: pathname + '.html',
    template: pages[pathname], // 模板路径
    chunks: ['vendor','manifest','vue', pathname], // 每个html引用的js模块
    inject: true              // js插入位置
  };

  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}



module.exports = webpackConfig
