/*
 * @Author: TonyJiangWJ
 * @Date: 2019-08-16 15:58:17
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-15 19:08:15
 * @Description: 
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'view-design'
import App from './App'
import router from './router'
import store from './store'
// 自定义全局方法
import GlobalBinds from '@/components/GlobalBinds'

if (process.env.NODE_ENV !== 'production') {
  require('view-design/dist/styles/iview.css')
}
import '@/assets/global.css'

iView.LoadingBar.config({
  color: '#00fdff'
})

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(GlobalBinds)
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
