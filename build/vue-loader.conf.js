var utils = require('./utils')
var config = require('../config')
var postcssImport = require('postcss-import')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  // postcss: [
  //   require('autoprefixer')({
  //     browsers: ['iOS >= 7', 'Android >= 4.1']
  //   })
  // ],
  postcss: function(webpack) {
      return [
        postcssImport({
          addDependencyTo: webpack
        }),
        require('autoprefixer')({
          browsers: ['iOS >= 7', 'Android >= 4.1']
        })
      ]
    }
}
