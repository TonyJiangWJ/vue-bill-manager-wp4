/*
 * @Author: TonyJiangWJ
 * @Date: 2018-11-11 22:12:50
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-06-30 13:10:23
 * @Description: 
 */
/* eslint-disable */
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

export const formatString = function (args) {
  let originContent = []
  let logContent = ''
  for (let arg in args) {
    originContent.push(args[arg])
  }
  if (originContent.length === 1) {
    logContent = originContent[0]
  } else {
    let marker = originContent[0]
    let args = originContent.slice(1)
    let regex = /(\{\})/g
    let matchResult = marker.match(regex)
    if (matchResult && args && matchResult.length > 0 && matchResult.length === args.length) {
      args.forEach((item, idx) => {
        marker = marker.replace('{}', item)
      })
      logContent = marker
    } else {
      console.log('参数数量不匹配 marker:' + args[0] + ' args:' + JSON.stringify(args))
    }
  }
  return logContent
}

export default {
  install (Vue, options) {
    Vue.prototype.$debug = function () {
      debug(formatString(arguments))
    }
    Vue.prototype.$log = function () {
      log(formatString(arguments))
    }
  }
}
