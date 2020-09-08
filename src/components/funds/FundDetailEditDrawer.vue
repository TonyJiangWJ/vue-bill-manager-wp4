<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-07-06 14:02:14
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-09-08 19:31:45
 * @Description: 
--> 
<template>
  <Drawer title="基金详情" v-model="innerShow" :width="drawerWidth">
    <Row>
      <i-col span="8">基金编码：</i-col>
      <i-col span="16">
        <Input type="text" v-model="fundInfo.fundCode" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8">基金名称：</i-col>
      <i-col span="16">
        <Input type="text" v-model="fundInfo.fundName" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入净值：</i-col>
      <i-col span="16">
        <NumberInput :fixed="4" v-model="fundInfo.fundPurchaseValue" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入份额：</i-col>
      <i-col span="16">
        <NumberInput :fixed="2" v-model="fundInfo.purchaseAmount" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入支出：</i-col>
      <i-col span="16">
        <NumberInput :fixed="2" v-model="fundInfo.purchaseCost" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入费用：</i-col>
      <i-col span="16">
        <NumberInput :fixed="2" v-model="fundInfo.purchaseFee" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入时间：</i-col>
      <i-col span="16">
        <DatePicker type="date" v-model="fundInfo.purchaseDate" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8">买入确认时间：</i-col>
      <i-col span="16">
        <DatePicker type="date" v-model="fundInfo.purchaseConfirmDate" />
      </i-col>
    </Row>
    <Row type="flex" align="middle">
      <i-col span="8">操作</i-col>
      <i-col span="12">
        <Row :gutter="16">
          <i-col>
            <Button class="gap-5" type="primary" @click="handleSave">保存修改</Button>
          </i-col>
          <i-col>
            <Button class="gap-5" type="error" @click="handleDelete">删除</Button>
          </i-col>
          <i-col>
            <Button class="gap-5" type="warning" @click="handlePreSale">预标记卖出</Button>
          </i-col>
          <i-col>
            <Button class="gap-5" type="success" @click="handleSold">标记已卖出</Button>
          </i-col>
        </Row>
      </i-col>
    </Row>
  </Drawer>
</template>
<script>
import API from '@/js/api.js'
export default {
  name: 'FundDetailEditDrawer',
  data() {
    return {
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
  watch: {
    innerShow: function(n) {
      if (n === true) {
        this.$store.commit('fundManager/showEditDrawer')
      } else {
        this.$store.commit('fundManager/hideEditDrawer')
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
      return this.$store.getters['fundManager/getShowEditDrawer']
    },
    storeFundInfo: function() {
      return this.$store.getters['fundManager/getCurrentEdit']
    }
  },
  methods: {
    handleSave: function(index) {
      this.$debug('save target: {}', index)
      this.fundInfo.purchaseDate = this.$isDate(this.fundInfo.purchaseDate)
        ? this.dateFormat(this.fundInfo.purchaseDate, 'yyyy-MM-dd')
        : this.fundInfo.purchaseDate
      this.fundInfo.purchaseConfirmDate = this.$isDate(this.fundInfo.purchaseConfirmDate)
        ? this.dateFormat(this.fundInfo.purchaseConfirmDate, 'yyyy-MM-dd')
        : this.fundInfo.purchaseConfirmDate
      let that = this
      this.$Modal.confirm({
        title: '确定修改基金信息吗？',
        content:
          `<table class="summary-table"><tr><th>基金名称:</th><td>${this.fundInfo.fundName}</td></tr>` +
          `<tr><th>基金买入时间:</th><td>${this.fundInfo.purchaseDate}</td></tr>` +
          `<tr><th>基金买入确认时间:</th><td>${this.fundInfo.purchaseConfirmDate}</td></tr>` +
          `<tr><th>基金买入单位净值:</th><td>${this.fundInfo.fundPurchaseValue}</td></tr>` +
          `<tr><th>基金买入份额:</th><td>${this.fundInfo.purchaseAmount}</td></tr>` +
          `<tr><th>基金买入支出:</th><td>${this.fundInfo.purchaseCost}</td></tr>` +
          `<tr><th>基金买入手续费:</th><td>${this.fundInfo.purchaseFee}</td></tr></table>`,
        onOk: function() {
          API.updateFundInfo({
            id: that.fundInfo.id,
            fundName: that.fundInfo.fundName,
            fundCode: that.fundInfo.fundCode,
            purchaseDate: that.fundInfo.purchaseDate,
            purchaseConfirmDate: that.fundInfo.purchaseConfirmDate,
            purchaseCost: that.fundInfo.purchaseCost,
            purchaseAmount: that.fundInfo.purchaseAmount,
            purchaseValue: that.fundInfo.fundPurchaseValue,
            purchaseFee: that.fundInfo.purchaseFee,
            version: that.fundInfo.version
          }).then(resp => {
            if (this.$isSuccess(resp)) {
              that.$Message.success('修改成功')
              that.$emit('reload-funds')
            } else {
              that.$Message.error('修改失败')
            }
          })
        }
      })
    },
    handleDelete: function() {
      this.$debug('delete row info:' + JSON.stringify(this.fundInfo.id))
      let that = this
      this.$Modal.confirm({
        title: '确定要删除：' + this.fundInfo.fundName + ' 吗？',
        content:
          `<p>买入确认时间：${this.dateFormat(this.fundInfo.purchaseConfirmDate, 'yyyy-MM-dd')}</p>` +
          `<p>买入份额：${this.fundInfo.purchaseAmount}</p>` +
          `<p>买入支出：${this.fundInfo.purchaseCost}</p>`,
        onOk: function() {
          API.deleteFundInfo({ id: that.fundInfo.id }).then(resp => {
            if (this.$isSuccess(resp)) {
              this.$Message.success('删除成功')
              that.$emit('reload-funds')
            } else {
              this.$Message.error('删除失败 ' + resp.msg)
            }
          })
        }
      })
    },
    handlePreSale: function () {
      this.$store.commit('fundManager/showPreSaleDrawer')
    },
    handleSold: function () {
      // this.$store.commit('fundManager/showPreSaleDrawer')
    }
  }
}
</script>

<style>
.summary-table th {
  text-align: left;
}
.summary-table td {
  text-align: left;
  padding-left: 0.5rem;
}
</style>