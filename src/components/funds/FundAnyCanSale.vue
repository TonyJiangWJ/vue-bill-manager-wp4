<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-06-30 09:36:32
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-08 15:47:30
 * @Description: 
--> 
<template>
  <div>
    <Row class="padding2">
      <i-col :md="8" :xs="24" class="mg-top">
        <span>开启查看可出售基金：</span>
        <i-switch v-model="showCanSold" />
      </i-col>
      <i-col :md="4" :xs="8" class="mg-top">
        <span>目标收益率:</span>
      </i-col>
      <i-col :md="8" :xs="10">
        <Slider v-model="targetIncreaseRateProcess" :tip-format="format"></Slider>
      </i-col>
      <i-col :md="3" :xs="5">
        <NumberInput :fixed="1" v-model="targetIncreaseRate" class="mg-left-1" />
      </i-col>
      <i-col span="1">
        <Tooltip placement="top">
          <Icon type="ios-flash" size="20" @click="refreshProcess" class="mg-top"/>
          <div slot="content">
            刷新精确输入数据到进度条，有可能会丢失精度
          </div>
        </Tooltip>
      </i-col>
    </Row>
    <Row class="padding2">
      <i-col>目前过滤持有短于7天的，默认收取卖出手续费为0.5% 目标收益率=估算增长率-手续费比例</i-col>
    </Row>
    <Row class="padding2" v-if="showCanSold">
      <i-col :md="8" :xs="24">
        <span>只显示当日增长是正的：</span>
        <i-switch v-model="showOnlyIncreased" />
      </i-col>
    </Row>
    <template v-if="showCanSold">
      <template v-if="canSoldFunds && canSoldFunds.length > 0">
        <div v-for="soldFund in canSoldFunds" :key="soldFund.fundCode">
          <Row>
            <i-col>
              基金名称：({{soldFund.fundCode}}){{soldFund.fundName}} 总计份额：{{soldFund.totalAmount}} 预计卖出总收益：{{(soldFund.totalIncrease * 0.995).toFixed(2)}}
              ({{(soldFund.totalIncrease * 100 / soldFund.totalCost - 0.5).toFixed(2)}}%)
              总持有份额：{{soldFund.totalPurchaseAmount}} 卖出后剩余份额：{{soldFund.totalPurchaseAmount - soldFund.totalAmount | toFixed2}}
            </i-col>
          </Row>
          <Row>
            <i-col>
              <Button type="primary" size="small" class="v-btn" @click="checkAsSold(soldFund)">全部标记为卖出</Button>
            </i-col>
          </Row>
          <Row>
            <Table stripe border :columns="soldFundDetailColumns" :data="soldFund.fundList" />
          </Row>
        </div>
      </template>
      <template v-else>
        <Row>
          <i-col>无可出售基金</i-col>
        </Row>
      </template>
    </template>
  </div>
</template>

<script>
import API from '@/js/api.js'

export default {
  name: 'FundAnyCanSale',
  props: {
    detailFunds: {
      type: Array,
      default: () => []
    },
    summaryFunds: {
      type: Array,
      default: () => []
    },
    assessmentDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showCanSold: false,
      showOnlyIncreased: true,
      targetIncreaseRate: 6,
      targetIncreaseRateProcess: 24,
      soldFundDetailColumns: [
        {
          title: '基金名称',
          key: 'fundName'
        },
        {
          title: '确认增长',
          key: 'confirmedIncrease',
          render: (h, params) => {
            return h('span', params.row.confirmedIncrease + '(' + params.row.confirmedIncreaseRate + '%)')
          }
        },
        {
          title: '今日增长',
          key: 'todayIncrease',
          render: (h, params) => {
            return h('span', params.row.todayIncrease + '(' + params.row.todayIncreaseRate + '%)')
          }
        },
        {
          title: '估算增长',
          key: 'assessmentIncrease',
          render: (h, params) => {
            return h('span', params.row.assessmentIncrease + '(' + params.row.assessmentIncreaseRate + '%)')
          }
        },
        {
          title: '估算卖出收益',
          key: 'assessmentIncrease',
          render: (h, params) => {
            return h(
              'span',
              (params.row.assessmentIncrease * 0.995).toFixed(2) + '(' + (params.row.assessmentIncreaseRate - 0.5).toFixed(2) + '%)'
            )
          }
        },
        {
          title: '买入成本',
          key: 'purchaseCost',
          render: (h, params) => {
            return h('span', params.row.purchaseCost + '(' + params.row.purchaseAmount + ')')
          }
        },
        {
          title: '买入时间',
          key: 'purchaseDate'
        },
        {
          title: '买入确认时间',
          key: 'purchaseConfirmDate'
        }
      ]
    }
  },
  methods: {
    format(val) {
      return '目标收益率: ' + ((parseFloat(val) * 25) / 100).toFixed(1) + '%'
    },
    reduceAdder: (a, b) => {
      a += b
      return a
    },
    checkAsSold: function(canSoldFund) {
      let that = this
      this.$Modal.confirm({
        title: '是否确认将这些基金标记为卖出？',
        content:
          `基金代码：${canSoldFund.fundCode} 总份额：${canSoldFund.totalAmount} 卖出后剩余份额：${(
            canSoldFund.totalPurchaseAmount - canSoldFund.totalAmount
          ).toFixed(2)}` +
          ` 预计收益：${(canSoldFund.totalIncrease * 0.995).toFixed(2)} 预计手续费：${(canSoldFund.totalAmount * canSoldFund.assessmentValue * 0.005).toFixed(
            2
          )}`,
        onOk: function() {
          that.$debug('卖出基金: ' + JSON.stringify(canSoldFund))
          let fundIds = canSoldFund.fundList.map(f => f.id)
          that.$log('卖出基金id: ' + JSON.stringify(fundIds))
          API.preMarkAsSold({
            fundIds: fundIds,
            fundSoldFeeRate: 0.5,
            assessmentDate: that.assessmentDate
          }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              that.$Message.success('标记成功')
              that.$emit('reload-funds')
            } else {
              that.$Message.error('标记失败 ' + resp.msg)
            }
          })
        }
      })
    },
    refreshProcess: function () {
      let newPrecent = parseInt((this.targetIncreaseRate / 25.0 * 100).toFixed(0))
      if (this.targetIncreaseRateProcess !== newPrecent) {
        this.targetIncreaseRateProcess = newPrecent
      }
    }
  },
  computed: {
    groupedFundDetails: function() {
      let fundGroup = {}
      if (this.detailFunds && this.detailFunds.length > 0) {
        for (let i = 0; i < this.detailFunds.length; i++) {
          let fundDetail = this.detailFunds[i]
          let fundList = fundGroup[fundDetail.fundCode]
          if (!fundList) {
            fundList = []
          }
          fundList.push(fundDetail)
          fundGroup[fundDetail.fundCode] = fundList
        }
      }
      return fundGroup
    },
    groupedSummaryFunds: function() {
      let summaryGroup = {}
      if (this.summaryFunds && this.summaryFunds.length > 0) {
        for (let i = 0; i < this.summaryFunds.length; i++) {
          let summaryFund = this.summaryFunds[i]
          summaryGroup[summaryFund.fundCode] = summaryFund
        }
      }
      return summaryGroup
    },
    canSoldFunds: function() {
      if (this.groupedFundDetails && Object.keys(this.groupedFundDetails).length > 0) {
        let canSold = {}
        let timestamp = new Date().getTime()
        let thresholdDate = new Date(timestamp - 24 * 3600000 * 7 - (timestamp % (3600000 * 24)))
        Object.keys(this.groupedFundDetails).map(key => {
          let fundDetails = this.groupedFundDetails[key]
          if (fundDetails && fundDetails.length > 0) {
            canSold[key] = fundDetails.filter(fund => {
              let dateCheck = new Date(fund.purchaseConfirmDate) < thresholdDate
              // 默认收取0.5% 手续费
              let increaseCheck = parseFloat(fund.assessmentIncreaseRate - 0.5) > this.targetIncreaseRate
              return dateCheck && increaseCheck
            })
          }
        })
        return Object.keys(canSold)
          .map(key => {
            let fundList = canSold[key]
            if (!fundList || fundList.length <= 0) {
              return null
            }
            if (this.showOnlyIncreased && parseFloat(fundList[0].todayIncrease) < 0) {
              return null
            }
            return {
              fundCode: key,
              fundName: fundList[0].fundName,
              totalIncrease: fundList
                .map(f => parseFloat(f.assessmentIncrease))
                .reduce(this.reduceAdder, 0)
                .toFixed(2),
              totalCost: fundList
                .map(f => parseFloat(f.purchaseCost))
                .reduce(this.reduceAdder, 0)
                .toFixed(2),
              totalAmount: fundList
                .map(f => parseFloat(f.purchaseAmount))
                .reduce(this.reduceAdder, 0)
                .toFixed(2),
              totalPurchaseAmount: this.groupedSummaryFunds[key].purchaseAmount,
              assessmentValue: fundList[0].assessmentValue,
              fundList: fundList
            }
          })
          .filter(f => f !== null)
      } else {
        return []
      }
    }
  },
  watch: {
    targetIncreaseRateProcess: function(n) {
      let newRate = ((25 * parseFloat(n)) / 100).toFixed(1)
      this.targetIncreaseRate = newRate
    }
  },
  filters: {
    toFixed2: function(val) {
      if (isNaN(val)) {
        return val
      } else {
        return parseFloat(val).toFixed(2)
      }
    }
  },
  mounted() {
    this.soldFundDetailColumns.forEach(column => this.$set(column, 'minWidth', 140))
  }
}
</script>

<style scoped>
.padding2 {
  padding: 0.5rem;
}
.mg-top {
  margin-top: 0.5rem;
}
.mg-left-1 {
  margin-left: 1rem;
}
</style>