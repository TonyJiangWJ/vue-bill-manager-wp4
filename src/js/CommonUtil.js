import { debug } from '@/js/LogUtil.js'

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
  }
}
