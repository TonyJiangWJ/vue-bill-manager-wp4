<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-07-14 23:52:46
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-09-08 19:31:54
 * @Description: 
--> 
<template>
  <Drawer title="基金部分卖出" v-model="innerShow" :width="drawerWidth">
    <Row>
      <i-col span="8">基金编码：</i-col>
      <i-col span="16">
        {{fundInfo.fundCode}}
      </i-col>
    </Row>
    <Row>
      <i-col span="8">基金名称：</i-col>
      <i-col span="16">
        {{fundInfo.fundName}}
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入净值：</i-col>
      <i-col span="16">
        {{fundInfo.fundPurchaseValue}}
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入份额：</i-col>
      <i-col span="16">
        {{fundInfo.purchaseAmount}}
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入支出：</i-col>
      <i-col span="16">
        {{fundInfo.purchaseCost}}
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入费用：</i-col>
      <i-col span="16">
        {{fundInfo.purchaseFee}}
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入时间：</i-col>
      <i-col span="16">
        {{fundInfo.purchaseDate}}
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入确认时间：</i-col>
      <i-col span="16">
        {{fundInfo.purchaseConfirmDate}}
      </i-col>
    </Row>
    <Row>
      <i-col span="8">卖出份额：</i-col>
      <i-col span="16">
        <NumberInput :fixed="2" v-model="saleAmount"/>
      </i-col>
    </Row>
    <Row>
      <i-col span="8">卖出时间：</i-col>
      <i-col span="16">
        <DatePicker type="date" v-model="assessmentDate" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8">卖出费率：</i-col>
      <i-col span="16">
        <NumberInput v-model="saleFeeRate" placeholder="百分比" :parser="val => val.replace('%', '')" :formatter="val => val + '%'" />
      </i-col>
    </Row>
    <Row type="flex" align="middle">
      <i-col span="8">操作</i-col>
      <i-col span="12">
        <Row :gutter="16">
          <i-col>
            <Button class="gap-5" type="primary" @click="handleSave">卖出</Button>
          </i-col>
          <i-col>
            <Button class="gap-5" type="error" @click="handleCancel">取消</Button>
          </i-col>
        </Row>
      </i-col>
    </Row>
  </Drawer>
</template>

<script>
import API from '@/js/api.js'
export default {
  name: 'FundPartSaleDrawer',
  data() {
    return {
      saleAmount: '',
      saleFeeRate: '',
      assessmentDate: '',
      innerShow: false,
      fundInfo: {
        id: null,
        version: null,
        fundCode: '',
        fundName: '',
        purchaseDate: '',
        purchaseConfirmDate: '',
        fundPurchaseValue: '',
        purchaseAmount: '',
        purchaseCost: '',
        purchaseFee: ''
      }
    }
  },
  computed: {
    drawerWidth: function() {
      let width = document.documentElement.clientWidth
      this.$debug(width)
      let drawerWidth = width / 2 > 256 ? width / 2 : 256
      if (drawerWidth > 500) {
        drawerWidth = 500
      }
      return drawerWidth
    },
    storeShowDrawer: function() {
      return this.$store.getters['fundManager/getShowPreSaleDrawer']
    },
    storeFundInfo: function() {
      return this.$store.getters['fundManager/getCurrentEdit']
    }
  },
  watch: {
    innerShow: function(n) {
      if (n === true) {
        this.$store.commit('fundManager/showPreSaleDrawer')
      } else {
        this.$store.commit('fundManager/hidePreSaleDrawer')
        this.assessmentDate = ''
        this.saleAmount = ''
        this.saleFeeRate = ''
      }
    },
    storeShowDrawer: function(n) {
      this.innerShow = n
    },
    storeFundInfo: {
      handler() {
        if (this.storeFundInfo !== null) {
          Object.assign(this.fundInfo, this.storeFundInfo)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCancel: function () {
      this.innerShow = false
    },
    handleSave: function () {
      let that = this
      this.$Modal.confirm({
        title: '确定要标记为卖出吗？',
        // content: `基金名称：${that.fundInfo.fundName} 预计收益：`,
        onOk: function () {
          API.preSalePortion({
            id: that.fundInfo.id,
            assessmentDate: that.dateFormat(that.assessmentDate, 'yyyy-MM-dd'),
            saleAmount: that.saleAmount,
            saleFeeRate: that.saleFeeRate
          }).then(resp => {
            if (this.$isSuccess(resp)) {
              that.$Message.success('修改成功')
              that.$emit('reload-funds')
            } else {
              that.$Message.error('操作失败')
            }
          })
        }
      })
    }
  }
}
</script>