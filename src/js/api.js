/*
 * @Author: TonyJiangWJ
 * @Date: 2019-08-15 16:52:56
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2019-12-25 16:35:57
 * @Description: 
 */
import axios from 'axios'
import qs from 'qs'
import JSEncrypt from 'jsencrypt'
import iView from 'iview'
import {
  host,
  rsaPubKey,
  basePath,
  useBrowserHost
} from '@/js/config.js'
import { debug } from '@/js/LogUtil'

// 允许跨域携带cookie
axios.defaults.withCredentials = true

const API = {
  /**
   * 加载资产页面所有的资产信息 包括负债信息
   */
  requestAssetManage: () => {
    return sendAjax('/asset/manage', {})
  },
  /**
   * 更新资产信息
   */
  updateAsset: (data) => {
    return sendAjax('/asset/update', data)
  },
  /**
   * 添加资产信息
   */
  addAsset: (data) => {
    return sendAjax('/asset/put', data)
  },
  /**
   * 删除资产信息
   */
  deleteAsset: (data) => {
    return sendAjax('/asset/delete', data)
  },
  /**
   * 更新负债信息
   */
  updateLiability: (data) => {
    return sendAjax('/liability/update', data)
  },
  /**
   * 获取负债类型的父类列表
   */
  getLiabilityParents: () => {
    return sendAjax('/list/asset/parent/types/L')
  },
  /**
   * 获取资产类型的父类列表
   */
  getAssetParents: () => {
    return sendAjax('/list/asset/parent/types/A')
  },
  /**
   * 校验类型编码是否已存在
   */
  assetTypeCheck: typeCode => {
    return sendAjax('/asset/type/check_' + typeCode)
  },
  /**
   * 添加资产类型
   */
  addAssetType: (data) => {
    return sendAjax('/asset/types/put', data)
  },
  /**
   * 根据父类型获取子类型列表
   */
  getChildByParent: (data) => {
    return sendAjax('/list/asset/type/by/parent/id', data)
  },
  /**
   * 添加负债信息
   */
  addLiability: (data) => {
    return sendAjax('/liability/put', data)
  },
  /**
   * 加载账单列表
   */
  loadBillList: (data) => {
    return sendAjax('/cost/record/page/get', data)
  },
  /**
   * 获取账单详情
   */
  loadRecordDetail: (data) => {
    return sendAjax('/record/detail/get', data)
  },
  /**
   * 添加账单信息
   */
  addRecord: (data) => {
    return sendAjax('/record/put', data)
  },
  /**
   * 更新账单信息
   */
  updateRecord: (data) => {
    return sendAjax('/record/update', data)
  },
  toggleRecordHide: (data) => {
    return sendAjax('/record/toggle/hide', data)
  },
  toggleRecordDelete: (data) => {
    return sendAjax('/record/toggle/delete', data)
  },
  /**
   * 加载账单标签
   */
  loadRecordTagList: (data) => {
    return sendAjax('/cost/tag/list', data)
  },
  /**
   * 添加账单标签
   */
  addTagToRecord: (data) => {
    return sendAjax('/cost/tag/put', data)
  },
  /**
   * 移除账单标签
   */
  removeTagFromRecord: (data) => {
    return sendAjax('/cost/tag/delete', data)
  },
  batchRemoveTagFromRecords: (data) => {
    return sendAjax('/cost/tag/batch/delete', data)
  },
  batchAddTagToRecords: data => {
    return sendAjax('/cost/tag/batch/put', data)
  },
  loadCommunalTagsFromRecords: data => {
    return sendAjax('/cost/tag/communal/list', data)
  },
  /**
   * 加载所有标签列表
   */
  loadAllTagList: (data) => {
    return sendAjax('/tag/list', data)
  },
  /**
   * 标签名称唯一性校验
   */
  tagNameUnique: (data) => {
    return sendAjax('/tag/name/unique', data)
  },
  /**
   * 添加标签
   */
  addTag: (data) => {
    return sendAjax('/tag/put', data)
  },
  /**
   * 移除标签
   */
  deleteTag: data => {
    return sendAjax('/tag/delete', data)
  },
  loadBudgetReport: data => {
    return sendAjax('/budget/report/list', data)
  },
  putBudget: data => {
    return sendAjax('/budget/put', data)
  },
  updateBudget: data => {
    return sendAjax('/budget/update', data)
  },
  deleteBudget: data => {
    return sendAjax('/budget/delete', data)
  },
  bindTagToBudget: data => {
    return sendAjax('/budget/tag/put', data)
  },
  deleteTagFromBudget: data => {
    return sendAjax('/budget/tag/delete', data)
  },
  listBudgetAssignableTags: data => {
    return sendAjax('/budget/tag/assignable/list', data)
  },
  /**
   * 登录
   */
  login: (data) => {
    data.password = getRsaCipher(data.password, rsaPubKey)
    return sendAjax('/user/login', data)
  },
  /**
   * 退出登录
   */
  logout: () => {
    return sendAjax('/user/logout', {})
  },
  /**
   * 检查登录状态
   */
  checkLoginStatus: () => {
    return axios.post(`${host}${basePath}/login/status`)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch(errorLog)
  },
  alipayUpload: (file) => {
    let formData = new FormData()
    formData.append('file', file)
    return axios.post(`${host}${basePath}/record/csv/convert`, formData)
      .then((response) => {
        if (response.data.code === API.CODE_CONST.NOT_LOGIN) {
          debug('未登录')
          iView.LoadingBar.finish()
          window.location.href = '#/login'
        } else {
          iView.LoadingBar.finish()
          if (response.data) {
            return Promise.resolve(response.data)
          } else {
            errorLog('请求失败' + JSON.stringify(response))
          }
        }
      })
      .catch(errorLog)
  },
  /**
   * 注册
   */
  register: (data) => {
    data.password = getRsaCipher(data.password, rsaPubKey)
    return sendAjax('/user/register/put', data)
  },
  CODE_CONST: {
    SUCCESS: '0001',
    PARAM_ERROR: '0002',
    SYS_ERROR: '0003',
    DATA_NOT_EXIST: '0004',
    OPERATE_ERROR: '0005',
    NOT_LOGIN: '0006'
  }
}

export default API

/**
 * rsa加密
 * @param str 待加密文本
 * @param pubKey rsa公钥
 * @returns {string|*|PromiseLike<ArrayBuffer>}
 */
function getRsaCipher (str, pubKey) {
  var encrypt = new JSEncrypt()
  encrypt.setPublicKey(pubKey)
  var timestamp = new Date().getTime()
  return encrypt.encrypt(timestamp + str)
}

function errorLog (e) {
  iView.LoadingBar.error()
  debug('error' + e)
}

// 发送ajax请求
function sendAjax (url, data) {
  debug('request data:' + JSON.stringify(data))
  iView.LoadingBar.start()
  let usingHost = host
  if (useBrowserHost) {
    let href = window.location.href
    let regex = /(https?:\/\/[^:/]*)(:\d+)?\//
    if (regex.test(href)) {
      usingHost = regex.exec(href)[1]
    }
    debug('使用当前路径host:' + usingHost)
  }
  return axios.post(`${usingHost}${basePath}${url}`, qs.stringify(data))
    .then((response) => {
      if (response.data.code === API.CODE_CONST.NOT_LOGIN) {
        debug('未登录')
        iView.LoadingBar.finish()
        window.location.href = '#/login'
      } else {
        iView.LoadingBar.finish()
        if (response.data) {
          return Promise.resolve(response.data)
        } else {
          errorLog('请求失败' + JSON.stringify(response))
        }
      }
    })
    .catch(errorLog)
}
