import API from '@/js/api.js'

const state = {
  isLogin: false
}

const getters = {
  isLogin: (state) => {
    return state.isLogin
  }
}

const actions = {
  checkLoginStatus: ({commit}) => {
    API.checkLoginStatus().then(resp => {
      if (resp.code === API.CODE_CONST.SUCCESS) {
        commit('setLogin')
      } else {
        commit('setLogout')
      }
    })
  }
}

const mutations = {
  setLogin: (state) => {
    state.isLogin = true
  },
  setLogout: (state) => {
    state.isLogin = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
