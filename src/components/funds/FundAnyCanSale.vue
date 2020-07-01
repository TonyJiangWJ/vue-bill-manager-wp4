<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-06-30 09:36:32
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-01 13:37:44
 * @Description: 
--> 
<template>
  <div>
    <Row class="padding2">
      <i-col span="6" class="mg-top">
        <span>目标收益率:</span>
      </i-col>
      <i-col span="12">
        <Slider v-model="targetIncreaseRate" :tip-format="format"></Slider>
      </i-col>
      <i-col span="4">
        <InputNumber v-model="targetIncreaseRate"/>
      </i-col>
    </Row>
    
    <template v-if="canSoldFunds && canSoldFunds.length > 0">
      <div v-for="soldFund in canSoldFunds" :key="soldFund.fundCode">
        <Row>
          <i-col>
            基金名称：({{soldFund.fundCode}}){{soldFund.fundName}} 总持有份额：{{soldFund.totalAmount}} 总增长：{{soldFund.totalIncrease}}
            {{(soldFund.totalIncrease * 100 / soldFund.totalCost).toFixed(2)}}%
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
  </div>
</template>

<script>
export default {
  name: 'FundAnyCanSale',
  props: {
    detailFunds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      targetIncreaseRate: 6,
      soldFundDetailColumns: [
        {
          title: '基金名称',
          key: 'fundName'
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
        }
      ]
    }
  },
  methods: {
    format(val) {
      return '目标收益率: ' + val + '%'
    },
    reduceAdder: (a, b) => {
      a += b
      return a
    },
    checkAsSold: function (canSoldFund) {
      this.$Modal.confirm({
        title: '是否确认将这些基金标记为卖出？',
        content: '基金代码：' + canSoldFund.fundCode + ' 总持有份额：' + canSoldFund.totalAmount + ' 预计收益：' + canSoldFund.totalIncrease,
        onOk: function () {
          this.$debug('卖出基金: ' + JSON.stringify(canSoldFund))
          let fundIds = canSoldFund.fundList.map(f => f.id)
          this.$log('卖出基金id: ' + JSON.stringify(fundIds))
        }
      })
    }
  },
  computed: {
    groupedFundDetails: function() {
      if (this.detailFunds && this.detailFunds.length > 0) {
        let fundGroup = {}
        for (let i = 0; i < this.detailFunds.length; i++) {
          let fundDetail = this.detailFunds[i]
          let fundList = fundGroup[fundDetail.fundCode]
          if (!fundList) {
            fundList = []
          }
          fundList.push(fundDetail)
          fundGroup[fundDetail.fundCode] = fundList
        }
        return fundGroup
      } else {
        return {}
      }
    },
    canSoldFunds: function() {
      if (this.groupedFundDetails && Object.keys(this.groupedFundDetails).length > 0) {
        let canSold = {}
        Object.keys(this.groupedFundDetails).map(key => {
          let fundDetails = this.groupedFundDetails[key]
          if (fundDetails && fundDetails.length > 0) {
            canSold[key] = fundDetails.filter(fund => parseFloat(fund.assessmentIncreaseRate - 0.5) > this.targetIncreaseRate)
          }
        })
        return Object.keys(canSold)
          .map(key => {
            let fundList = canSold[key]
            if (!fundList || fundList.length <= 0) {
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
              fundList: fundList
            }
          })
          .filter(f => f !== null)
      } else {
        return []
      }
    }
  },
  mounted() {
    this.soldFundDetailColumns.forEach(column => this.$set(column, 'minWidth', 120))
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
</style>