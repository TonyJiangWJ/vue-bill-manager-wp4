/*
 * @Author: TonyJiangWJ
 * @Date: 2020-01-07 10:30:17
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-24 16:37:06
 * @Description: 
 */

const isProduction = process.env.NODE_ENV === 'production'
const cdn = {
  css: [
    'https://cdn.jsdelivr.net/npm/view-design@4.3.0-rc.4/dist/styles/iview.css'
  ],
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    'https://cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
    'https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
    'https://cdn.jsdelivr.net/npm/echarts@4.8.0/dist/echarts.common.min.js',
    'https://cdn.jsdelivr.net/npm/view-design@4.2.0/dist/iview.min.js',
    'https://cdn.jsdelivr.net/npm/jsencrypt@3.0.0-rc.1/bin/jsencrypt.min.js',
    'https://cdn.jsdelivr.net/npm/crypto-js@3.3.0/crypto-js.js',
  ]
}


module.exports = {
  chainWebpack: config => {
    // 生产环境配置
    if (isProduction) {
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all'
      })
      // 生产环境注入cdn
      config.plugin('html')
        .tap(args => {
          args[0].cdn = cdn
          return args
        })
    }
    
    if (process.env.npm_config_report == 'true') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      // 用cdn方式引入
      config.externals = {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'axios': 'axios',
        'view-design': 'iview',
        'jsencrypt': 'JSEncrypt',
        'echarts': 'echarts',
        'crypto-js': 'CryptoJS'
      }
    } else {
      // 为开发环境修改配置...
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  devServer: {
    // eslint 蒙层
    overlay: false
  }
}