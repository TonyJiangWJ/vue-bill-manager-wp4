/*
 * @Author: TonyJiangWJ
 * @Date: 2020-07-15 19:04:24
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-15 19:07:32
 * @Description: 
 */
// 自定义全局方法
import DateUtil from '@/js/DateUtil'
import LogUtil from '@/js/LogUtil'
import CommonUtil from '@/js/CommonUtil'
// 自定义全局组件
import NumberInput from '@/components/common/NumberInput'

export default {
  install (Vue) {
    // 注册全局方法
    Vue.use(DateUtil)
    Vue.use(LogUtil)
    Vue.use(CommonUtil)

    // 注册全局组件
    Vue.component('NumberInput', NumberInput)
  }
}