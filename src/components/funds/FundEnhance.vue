<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-09-03 17:55:02
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-09-08 19:31:30
 * @Description: 
-->
<template>
  <Modal v-model="showModal" title="基金增强" @on-ok="doEnhance">
    <Row>
      <i-col span="8">基金编码：</i-col>
      <i-col span="16">{{fundCode}}</i-col>
    </Row>
    <Row>
      <i-col span="8">最后确认时间：</i-col>
      <i-col span="16">
        <DatePicker type="date" v-model="lastConfirmDate" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8">最新份额：</i-col>
      <i-col span="16">
        <NumberInput :fixed="2" v-model="currentAmount" />
      </i-col>
    </Row>
  </Modal>
</template>

<script>
import API from '@/js/api.js'
export default {
  name: 'FundEnhance',
  model: {
    prop: 'value',
    event: 'toggle-modal',
  },
  props: {
    fundCode: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showModal: this.value,
      lastConfirmDate: '',
      currentAmount: '',
    }
  },
  watch: {
    value: function (v) {
      this.showModal = v
    },
    showModal: function (v) {
      this.$emit('toggle-modal', v)
    },
  },
  methods: {
    doEnhance: function () {
      if (this.lastConfirmDate && this.currentAmount) {
        this.lastConfirmDate = this.$isDate(this.lastConfirmDate)
          ? this.dateFormat(this.lastConfirmDate, 'yyyy-MM-dd')
          : this.lastConfirmDate
        let forRequestDate = this.dateFormat(new Date(new Date(this.lastConfirmDate).getTime() + 24 * 3600000), 'yyyy-MM-dd')
        this.$debug(
          JSON.stringify({
            fundCode: this.fundCode,
            dateBefore: forRequestDate,
            currentAmount: this.currentAmount,
          })
        )
        API.enhanceFundInfo({
          fundCode: this.fundCode,
          dateBefore: forRequestDate,
          currentAmount: this.currentAmount,
        }).then((resp) => {
          if (this.$isSuccess(resp)) {
            this.$Message.success('执行成功')
            this.$emit('reload-funds')
          } else {
            this.$Message.error('执行失败')
          }
        })
      }
    },
  },
}
</script>