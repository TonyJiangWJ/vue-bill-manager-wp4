/*
 * @Author: TonyJiangWJ
 * @Date: 2020-07-20 14:18:34
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-08-05 22:07:47
 * @Description: 
 */ 
import API from '@/js/api.js'
const state = {
  tagList: []
}

const getters = {
  tagList: state => {
    return state.tagList
  }
}

const actions = {
  reloadAllTags: ({commit}) => {
    API.loadAllTagList({}).then(resp => {
      if (resp && resp.code === API.CODE_CONST.SUCCESS) {
        commit('setTagList', resp.tagInfoList)
      }
    })
  }
}

const mutations = {
  setTagList: (state, tagList) => {
    state.tagList = tagList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}