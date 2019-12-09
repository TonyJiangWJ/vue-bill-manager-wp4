/*
 * @Author: TonyJiangWJ
 * @Date: 2018-11-11 22:12:50
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2019-12-07 23:19:01
 * @Description: 
 */
import {
  enableLog
} from '@/js/config.js'

export const debug = function (str) {
  if (enableLog) {
    console.log(str)
  }
}

export const log = function (str) {
  console.log(str)
}

export default {
  install (Vue, options) {
    Vue.prototype.$debug = debug
    Vue.prototype.$log = log
  }
}
