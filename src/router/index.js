import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
// import HelloWorld from '@/view/HelloWorld'
import Tools from '@/view/Tools'
import T2Test from '@/view/tools/T2Test'
import CommonTools from '@/view/tools/CommonTools'
import JsonFormat from '@/view/tools/JsonFormat'
import SqlLogFormat from '@/view/tools/SqlLogFormat'
import Encryption from '@/view/tools/Encryption'
import TaxCal from '@/view/tools/TaxCal'

import AssetAndLiability from '@/view/AssetAndLiability'
import Assets from '@/view/assetAndLiability/Assets'
import Bills from '@/view/bills/Bills'
import BillRecordList from '@/view/bills/BillRecordList'
import BillReport from '@/view/bills/BillReport'
import AlipayFileUpload from '@/view/bills/AlipayFileUpload'
import BudgetManage from '@/view/bills/BudgetManage'
import Login from '@/view/Login'
import Register from '@/view/Register'
import AssetTypes from '@/view/AssetTypes'

import TableDemo from '@/components/demos/TableDemo'
import TableExpandDemo from '@/components/demos/TableExpandDemo'
import CheckGroupDemo from '@/components/demos/check-group-demo'
import EchartsDemo from '@/components/demos/echarts-demo'

import { debug } from '@/js/LogUtil'
import API from '@/js/api.js'
import { needLogin } from '@/js/config.js'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Tools,
      children: [
        {
          path: '',
          name: 'CommonTools',
          component: CommonTools
        },
        {
          path: 'tools',
          name: 'CommonTools',
          component: CommonTools
        },
        {
          path: '/tools/jsonFormat',
          name: 'JsonFormat',
          component: JsonFormat
        },
        {
          path: '/tools/sqlLogFormat',
          name: 'SqlLogFormat',
          component: SqlLogFormat
        },
        {
          path: '/tools/encryption',
          name: 'Encryption',
          component: Encryption
        },
        {
          path: '/tools/t2test',
          name: 'T2Test',
          component: T2Test
        },
        {
          path: '/tools/taxCal',
          name: 'TaxCal',
          component: TaxCal
        }]
    },
    {
      path: '/assetList',
      component: AssetAndLiability,
      children: [{
        path: '',
        name: 'Assets',
        component: Assets
      }]
    },
    {
      path: '/bill',
      component: Bills,
      children: [{
        path: 'record/list',
        name: 'BillRecordList',
        component: BillRecordList
      },
      {
        path: 'record/report',
        name: 'BillReport',
        component: BillReport
      },
      {
        path: 'alipay/upload',
        name: 'AlipayFileUpload',
        component: AlipayFileUpload
      },
      {
        path: 'budget',
        name: 'BudgetManage',
        component: BudgetManage
      }]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/asset/type',
      name: 'AssetTypes',
      component: AssetTypes
    },
    {
      path: '/tree/demo/table',
      name: 'TableDemo',
      component: TableDemo
    },
    {
      path: '/tree/demo/tableExpand',
      name: 'TableExpandDemo',
      component: TableExpandDemo
    },
    {
      path: '/demo/checkGroup',
      name: 'CheckGroupDemo',
      component: CheckGroupDemo
    },
    {
      path: '/demo/echarts',
      name: 'EchartsDemo',
      component: EchartsDemo
    },
    {
      path: '*',
      name: 'NotFound',
      redirect: '/tools'
    }
  ]
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // debugger
  store.dispatch('loginStatus/checkLoginStatus')
  // ...
  if (needLogin.indexOf(to.path) > -1) {
    if (to.path === '/login') {
      next()
    } else {
      API.checkLoginStatus().then((resp) => {
        if (!resp || resp.code !== API.CODE_CONST.SUCCESS) {
          let pushParams = {
            name: 'Login',
            params: {
              redirect: '#' + to.path
            }
          }
          debug(JSON.stringify(pushParams))
          router.push(pushParams)
          iView.LoadingBar.finish()
        } else {
          next()
        }
      })
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  iView.LoadingBar.finish()
})

export default router
