import Vue from 'vue'
import Vuex from 'vuex'
import loginStatus from './modules/loginStatus'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    loginStatus
  }
})
