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
        <i-col span="10">类别</i-col>
        <i-col span="10"><Input type="text" :value="liability.name" :maxlength="20" readonly/></i-col>
      </Row>
      <Row type="flex" justify="center">
        <i-col span="10">金额</i-col>
        <i-col span="10"><NumberInput v-model="liabilityAmount" placeholder="金额"/></i-col>
      </Row>
      <Row type="flex" justify="center">
        <i-col span="10">已还金额</i-col>
        <i-col span="10"><NumberInput v-model="liabilityPaid" placeholder="已还金额"/></i-col>
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
import NumberInput from '@/components/common/NumberInput'
export default {
  name: 'TimeLineItemDetail',
  components: {
    NumberInput
  },
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
    clickTimeLineItem: function () {
      this.liabilityModal = true
      this.liabilityAmount = (this.liability.amount / 100).toFixed(2)
      this.liabilityPaid = (this.liability.paid / 100).toFixed(2)
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
          this.$debug('更新成功')
          this.$emit('reloadAssetInfo')
        }
      })
      this.liabilityModal = false
    }
  },
  created: function () {
    // this.$debug(JSON.stringify(this.liabilityModel.liabilityList))
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
