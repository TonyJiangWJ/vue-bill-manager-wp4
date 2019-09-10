export default {
  install (Vue, options) {
    /**
     * 检测并返回合法的数字值，保留两位小数
     * exp: 101a1,11b1.226.01 returns 101111.23
     */
    Vue.prototype.checkNumic = function (valStr) {
      if (typeof valStr === 'undefined' || valStr === null || valStr === '') {
        return ''
      }
      let val
      if (valStr.substring(0, 1) === '=') {
        try {
          // eslint-disable-next-line
          val = eval(valStr.substring(1))
        } catch (e) {
          this.debug('解析失败 ' + e)
        }
      } else {
        val = Number(valStr)
        if (isNaN(val)) {
          this.debug('金额格式不正确' + valStr)
          valStr = valStr.replace(/[^.\d]/g, '')
          val = Number(valStr)
        }
        while (isNaN(val)) {
          valStr = valStr.substring(0, valStr.lastIndexOf('.'))
          val = Number(valStr)
        }
        this.debug('format val' + val)
      }
      return val.toFixed(2)
    }
  }
}
