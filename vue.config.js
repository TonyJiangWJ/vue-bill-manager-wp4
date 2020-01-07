/*
 * @Author: TonyJiangWJ
 * @Date: 2020-01-07 10:30:17
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-01-07 13:12:57
 * @Description: 
 */

const isProduction = process.env.NODE_ENV === 'production'
const cdn = {
  css: [
    // 'https://cdn.bootcss.com/iview/3.5.0/styles/iview.css'
  ],
  js: [
    'https://cdn.bootcss.com/vue/2.6.10/vue.runtime.min.js',
    'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
    'https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js',
    'https://cdn.bootcss.com/axios/0.19.0/axios.min.js',
    'https://cdn.bootcss.com/echarts/4.4.0/echarts.common.min.js',
    'https://cdn.bootcss.com/iview/3.5.0/iview.min.js',
    'https://cdn.bootcss.com/jsencrypt/3.0.0-rc.1/jsencrypt.min.js',
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