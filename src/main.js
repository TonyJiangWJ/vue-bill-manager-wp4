/*
 * @Author: TonyJiangWJ
 * @Date: 2019-08-16 15:58:17
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-01-07 18:17:38
 * @Description: 
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import App from './App'
import router from './router'
import store from './store'
// 自定义全局方法
import DateUtil from '@/js/DateUtil'
import LogUtil from '@/js/LogUtil'
import CommonUtil from '@/js/CommonUtil'

if (process.env.NODE_ENV !== 'production') {
  require('iview/dist/styles/iview.css')
}
import '@/assets/global.css'

iView.LoadingBar.config({
  color: '#00fdff'
})

Vue.config.productionTip = false
Vue.use(DateUtil)
Vue.use(LogUtil)
Vue.use(iView)
Vue.use(CommonUtil)
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
