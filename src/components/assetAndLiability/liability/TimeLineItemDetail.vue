<template>
  <li @click.stop="clickTimeLineItem">
    <div>
      <span>{{liability.name}}</span>&nbsp;
      <span>￥{{liability.amount|longToString}}</span>
      <span :style="liability.paid>0?'':'display:none;'">
          (<span style="color: rgb(255, 0, 0);">{{liability.amount-liability.paid|longToString}}</span>)
      </span>
      &nbsp;
      <span>{{liability.index}}</span><span>/</span><span>{{liability.installment}}</span>&nbsp;
      <span>还款日：{{liability.repaymentDay}}</span>
    </div>
    <Modal v-model="liabilityModal" title="资产详情" :width="380">
      <Row type="flex" justify="center">
        <Col span="10">类别</Col>
        <Col span="10"><Input type="text" :value="liability.name" :maxlength="20" readonly/></Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">金额</Col>
        <Col span="10"><Input v-model="liabilityAmount" type="text" @on-blur="checkAmount" placeholder="金额"/></Col>
      </Row>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">已还金额</Col>
        <Col span="10"><Input v-model="liabilityPaid" type="text" @on-blur="checkPaid" placeholder="已还金额"/></Col>
      </Row>
      <div slot="footer">
        <Button type="dashed" @click="liabilityPaid=liabilityAmount">还清</Button>
        <Button type="default" @click="liabilityModal=false">取消</Button>
        <Button type="primary" @click="updateLiabilityInfo">确定</Button>
      </div>
    </Modal>
  </li>
</template>

<script>
import API from '@/js/api'

export default {
  name: 'TimeLineItemDetail',
  props: {
    liability: {}
  },
  data () {
    return {
      liabilityModal: false,
      liabilityAmount: (this.liability.amount / 100).toFixed(2),
      liabilityPaid: (this.liability.paid / 100).toFixed(2)
    }
  },
  filters: {
    longToString: function (val) {
      return (val / 100).toFixed(2)
    }
  },
  methods: {
    clickTimeLineItem: function (liability) {
      this.liabilityModal = true
      this.liabilityAmount = (this.liability.amount / 100).toFixed(2)
      this.liabilityPaid = (this.liability.paid / 100).toFixed(2)
    },
    checkAmount: function () {
      this.liabilityAmount = this.checkNumic(this.liabilityAmount)
    },
    checkPaid: function () {
      this.liabilityPaid = this.checkNumic(this.liabilityPaid)
    },
    updateLiabilityInfo: function () {
      let request = {
        version: this.liability.version,
        id: this.liability.id,
        amount: (this.liabilityAmount * 100).toFixed(0),
        paid: (this.liabilityPaid * 100).toFixed(0)
      }
      API.updateLiability(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.debug('更新成功')
          this.$emit('reloadAssetInfo')
        }
      })
      this.liabilityModal = false
    }
  },
  created: function () {
    // this.debug(JSON.stringify(this.liabilityModel.liabilityList))
  }
}
</script>

<style lang="postcss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
