/*
 * @Author: TonyJiangWJ
 * @Date: 2020-01-07 10:30:17
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-01-07 18:15:20
 * @Description: 
 */

const isProduction = process.env.NODE_ENV === 'production'
const cdn = {
  css: [
    'https://cdn.jsdelivr.net/npm/iview@3.5.4/dist/styles/iview.css'
  ],
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    'https://cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js',
    'https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js',
    'https://cdn.jsdelivr.net/npm/echarts@4.6.0/dist/echarts.common.min.js',
    'https://cdn.jsdelivr.net/npm/iview@3.5.4/dist/iview.min.js',
    'https://cdn.jsdelivr.net/npm/jsencrypt@3.0.0-rc.1/bin/jsencrypt.min.js',
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
        'iview': 'iview',
        'jsencrypt': 'JSEncrypt',
        'echarts': 'echarts'
      }
    } else {
      // 为开发环境修改配置...
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false
}