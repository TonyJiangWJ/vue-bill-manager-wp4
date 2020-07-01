<!--
 * @Author: TonyJiangWJ
 * @Date: 2019-12-25 15:36:22
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-06-29 22:39:27
 * @Description: 新增负债信息弹框组件
 -->
<template>
  <Modal v-model="showAdderModal" title="添加分期账单" :width="380" @on-ok="doAddLiability">
    <Row type="flex" justify="center">
      <i-col span="10">父类别</i-col>
      <i-col span="10">
        <Select v-model="liabilityParent">
          <Option v-for="parentType in liabilityParentList" :value="parentType.id" :key="parentType.id">{{ parentType.typeDesc }}</Option>
        </Select>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">子类别</i-col>
      <i-col span="10">
        <Select v-model="liabilityChildType">
          <Option v-for="childType in liabilityChildList" :value="childType.id" :key="childType.id">{{ childType.typeDesc }}</Option>
        </Select>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">分期期数</i-col>
      <i-col span="10">
        <InputNumber v-model="installment" placeholder="分期期数" style="width:100%" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">首期还款日</i-col>
      <i-col span="10">
        <DatePicker type="date" placeholder="首期还款日" v-model="repaymentDay" style="width:100%" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">总金额</i-col>
      <i-col span="10">
        <NumberInput v-model="liabilityAmount" placeholder="总金额" />
      </i-col>
    </Row>
  </Modal>
</template>
<script>
import API from '@/js/api.js'
import NumberInput from '@/components/common/NumberInput'
export default {
  name: 'LiablilityAdder',
  components: {
    NumberInput
  },
  model: {
    prop: 'value',
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
      showAdderModal: this.value,
      liabilityParent: '',
      liabilityChildType: '',
      installment: null,
      repaymentDay: '',
      liabilityAmount: null,
      liabilityParentList: [],
      liabilityChildList: []
    }
  },
  watch: {
    showAdderModal: function(newVal) {
      this.$emit('toggle-show', newVal)
    },
    value: function(newVal) {
      this.showAdderModal = newVal
    },
    liabilityParent: function() {
      this.liabilityChildType = ''
      API.getChildByParent({ id: this.liabilityParent }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.liabilityChildList = resp.assetTypes
        }
      })
    }
  },
  methods: {
    resetLiability: function () {
      this.liabilityParent = ''
      this.liabilityChildType = ''
      this.liabilityChildList = []
      this.liabilityAmount = null
      this.repaymentDay = ''
      this.installment = null
    },
    doAddLiability: function () {
      let request = {
        type: this.liabilityChildType,
        repaymentDay: String(this.repaymentDay),
        amount: (this.liabilityAmount * 100).toFixed(0),
        installment: this.installment
      }
      API.addLiability(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.$emit('reload-asset-info')
          this.$debug('添加成功')
          this.resetLiability()
        }
      })
    },
  },
  mounted() {
    API.getLiabilityParents().then(resp => {
      if (resp.code === API.CODE_CONST.SUCCESS) {
        this.liabilityParentList = resp.assetTypes
      }
    })
  }
}
</script>