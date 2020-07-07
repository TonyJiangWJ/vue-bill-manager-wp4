import Vue from 'vue'
import Vuex from 'vuex'
import loginStatus from './modules/loginStatus'
import fundManager from './modules/fundManager'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    loginStatus,
    fundManager
  }
})
