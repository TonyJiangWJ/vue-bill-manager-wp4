/*
 * @Author: TonyJiangWJ
 * @Date: 2020-07-02 02:12:16
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-22 11:43:13
 * @Description: 
 */ 
import { debug } from '@/js/LogUtil.js'
import API from '@/js/api.js'

export default {
  install (Vue, options) {
    debug(JSON.stringify(options))
    /**
     * 检测并返回合法的数字值，保留两位小数
     * exp: 101a1,11b1.226.01 returns 101111.23
     */
    Vue.prototype.$checkNumic = function (valStr, fixedStep) {
      fixedStep = isNaN(fixedStep) ? 2 : fixedStep
      if (typeof valStr === 'undefined' || valStr === null || valStr === '') {
        return ''
      }
      let val = Number(valStr)
      if (isNaN(val)) {
        if (valStr.substring(0, 1) === '=') {
          valStr = valStr.substring(1)
        }
        try {
          // eslint-disable-next-line
          val = eval(valStr)
        } catch (e) {
          debug(`解析[${valStr}]失败 ` + e)
          valStr = valStr.replace(/[^.\d]/g, '')
          val = Number(valStr)
          while (isNaN(val)) {
            valStr = valStr.substring(0, valStr.lastIndexOf('.'))
            val = Number(valStr)
          }
        }
        debug('format val ' + val)
      }
      return val.toFixed(fixedStep)
    }

    Vue.prototype.$isNotEmpty = (val) => {
      return typeof val !== 'undefined' && val !== null && val !== ''
    }
    // 判断是否是日期类型
    Vue.prototype.$isDate = (val) => {
      return Object.prototype.toString.call(val) === '[object Date]'
    }

    // 判断请求结果是否正常
    Vue.prototype.$isSuccess = resp => {
      debug('check resp: ' + JSON.stringify(resp))
      if (resp && resp.code === API.CODE_CONST.SUCCESS) {
        return true
      } else {
        debug('请求失败，resp: ' + (resp === null ? null : resp.msg))
        return false
      }
    }
  }
}
