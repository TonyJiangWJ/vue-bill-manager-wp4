/*
 * @Author: TonyJiangWJ
 * @Date: 2020-07-06 14:08:57
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-15 00:15:55
 * @Description: 
 */ 

const state = {
  showEditDrawer: false,
  showPreSaleDrawer: false,
  currentEdit: {}
}

const getters = {
  getShowEditDrawer: (state) => {
    return state.showEditDrawer
  },
  getCurrentEdit: (state) => {
    return state.currentEdit
  },
  getShowPreSaleDrawer: (state) => {
    return state.showPreSaleDrawer
  }
}

const actions = {
}

const mutations = {
  hideEditDrawer: state => {
    state.showEditDrawer = false
  },
  showEditDrawer: state => {
    state.showEditDrawer = true
  },
  hidePreSaleDrawer: state => {
    state.showPreSaleDrawer = false
  },
  showPreSaleDrawer: state => {
    state.showPreSaleDrawer = true
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
