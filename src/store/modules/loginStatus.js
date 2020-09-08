/*
 * @Author: TonyJiangWJ
 * @Date: 2019-08-15 16:52:56
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-08-05 22:07:37
 * @Description: 
 */ 
import API from '@/js/api.js'

const state = {
  isLogin: false,
  redirect: ''
}

const getters = {
  isLogin: (state) => {
    return state.isLogin
  },
  redirect: (state) => {
    return state.redirect
  }
}

const actions = {
  checkLoginStatus: ({commit}) => {
    API.checkLoginStatus().then(resp => {
      if (resp && resp.code === API.CODE_CONST.SUCCESS) {
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
  },
  setRedirect: (state, redirect) => {
    state.redirect = redirect
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
