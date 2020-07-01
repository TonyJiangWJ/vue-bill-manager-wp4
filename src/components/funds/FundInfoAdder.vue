<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-06-29 22:01:55
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-02 01:03:58
 * @Description: 
--> 

<template>
  <Modal v-model="innerShowAdderModal" title="添加基金信息" :width="380" @on-ok="doAddFundInfo">
    <Row type="flex" justify="center">
      <i-col span="10">基金代码</i-col>
      <i-col span="10">
        <Input v-model="fundCode" type="text" placeholder="基金代码" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">基金名称</i-col>
      <i-col span="10">
        <Input v-model="fundName" type="text" placeholder="基金名称" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">买入单位净值</i-col>
      <i-col span="10">
        <NumberInput v-model="purchaseValue" placeholder="买入单位净值" :fixed="4" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">买入确认份额</i-col>
      <i-col span="10">
        <NumberInput v-model="purchaseAmount" placeholder="买入确认份额" :fixed="2" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">买入总支出</i-col>
      <i-col span="10">
        <NumberInput v-model="purchaseCost" placeholder="买入总支出" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">买入手续费</i-col>
      <i-col span="10">
        <NumberInput v-model="purchaseFee" placeholder="买入手续费" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">买入日期</i-col>
      <i-col span="10">
        <DatePicker type="date" placeholder="买入日期" v-model="purchaseDate" style="width:100%" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">买入确认日期</i-col>
      <i-col span="10">
        <DatePicker type="date" placeholder="买入确认日期" v-model="purchaseConfirmedDate" style="width:100%" />
      </i-col>
    </Row>
  </Modal>
</template>

<script>
import API from '@/js/api.js'
import NumberInput from '@/components/common/NumberInput'
export default {
  name: 'FundInfoAdder',
  components: {
    NumberInput
  },
  model: {
    value: 'value',
    event: 'toggle-show'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fundCode: '',
      fundName: '',
      purchaseValue: '',
      purchaseAmount: '',
      purchaseCost: '',
      purchaseFee: '',
      purchaseDate: '',
      purchaseConfirmedDate: '',
      innerShowAdderModal: this.value
    }
  },
  watch: {
    innerShowAdderModal: function(newVal) {
      this.$emit('toggle-show', newVal)
    },
    value: function(newVal) {
      this.innerShowAdderModal = newVal
    },
    fundCode: function(newVal) {
      API.queryFundInfo({ fundCode: newVal }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.fundName = resp.fundName
        }
      })
    }
  },
  methods: {
    doAddFundInfo: function() {
      API.addFundInfo({
        fundCode: this.fundCode,
        fundName: this.fundName,
        purchaseAmount: this.purchaseAmount,
        purchaseValue: this.purchaseValue,
        purchaseCost: this.purchaseCost,
        purchaseFee: this.purchaseFee,
        purchaseDate: this.purchaseDate,
        purchaseConfirmedDate: this.purchaseConfirmedDate
      }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.$emit('reload-fund-info')
          this.$Message.success('添加成功')
        } else {
          this.$Message.success('添加失败 ' + resp.msg)
        }
      })
    }
  }
}
</script>