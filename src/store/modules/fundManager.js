/*
 * @Author: TonyJiangWJ
 * @Date: 2020-07-06 14:08:57
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-06 14:24:11
 * @Description: 
 */ 

const state = {
  showEditDrawer: false,
  currentEdit: {}
}

const getters = {
  getShowEditDrawer: (state) => {
    return state.showEditDrawer
  },
  getCurrentEdit: (state) => {
    return state.currentEdit
  }
}

const actions = {
}

const mutations = {
  hideDrawer: state => {
    state.showEditDrawer = false
  },
  showDrawer: state => {
    state.showEditDrawer = true
  },
  setCurrentEdit: (state, value) => {
    state.currentEdit = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
