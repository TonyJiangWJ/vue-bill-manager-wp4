import {
  enableLog
} from '@/js/config.js'

export default {
  install (Vue, options) {
    Vue.prototype.debug = function (str) {
      if (enableLog) {
        console.log(str)
      }
    }
    Vue.prototype.log = function (str) {
      console.log(str)
    }
  }
}

export const debug = function (str) {
  if (enableLog) {
    console.log(str)
  }
}

export const log = function (str) {
  console.log(str)
}
