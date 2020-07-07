<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-07-02 11:02:52
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-02 16:38:44
 * @Description: 
--> 
<template>
  <div>
    <Table stripe border :columns="summaryFundsColumns" :data="innerSummaryFunds" @on-sort-change="sortChange"
      @on-expand="handleExpand"
    ></Table>
  </div>
</template>
<script>
// eslint-disable-next-line
import FundDetailsExpand from '@/components/funds/FundDetailsExpand'
export default {
  name: 'FundSummary',
  components: {
    // eslint-disable-next-line
    FundDetailsExpand
  },
  props: {
    summaryFunds: {
      type: Array,
      default: () => []
    },
    detailFunds: {
      type: Array,
      default: () => []
    },
    summaryInfo: {
      type: Object,
      default: () => {
        return {
          totalCost: '',
          totalHold: '',
          totalFee: '',
          confirmedIncrease: '',
          confirmedIncreaseRate: '',
          assessmentIncrease: '',
          assessmentIncreaseRate: '',
          todayIncrease: '',
          todayIncreaseRate: ''
        }
      }
    }
  },
  data() {
    return {
      sortKey: '',
      sortOrder: 1,
      expendedFunds: {},
      innerSummaryFunds: this.summaryFunds,
      summaryFundsColumns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            let that = this
            return h(FundDetailsExpand, {
              props: {
                fundCode: params.row.fundCode,
                detailFunds: this.groupedDetailFunds[params.row.fundCode]
              },
              on: {
                reloadFunds: function() {
                  that.$emit('reload-funds')
                }
              }
            })
          }
        },
        {
          title: '基金名称',
          key: 'fundName'
        },
        {
          title: '基金编码',
          key: 'fundCode',
          sortable: 'custom'
        },
        {
          title: '持有总成本',
          key: 'purchaseCost',
          sortable: 'custom'
        },
        {
          title: '持有份额',
          key: 'purchaseAmount',
          sortable: 'custom'
        },
        {
          title: '确认增长',
          key: 'confirmedIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.confirmedIncrease) >= 0 ? 'green' : 'red'
              },
              params.row.confirmedIncrease + '(' + params.row.confirmedIncreaseRate + '%)'
            )
          },
          sortable: 'custom'
        },
        {
          title: '今日增长',
          key: 'todayIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.todayIncrease) >= 0 ? 'green' : 'red'
              },
              params.row.todayIncrease + '(' + params.row.todayIncreaseRate + '%)'
            )
          },
          sortable: 'custom'
        },
        {
          title: '估算增长',
          key: 'assessmentIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.assessmentIncrease) >= 0 ? 'green' : 'red'
              },
              params.row.assessmentIncrease + '(' + params.row.assessmentIncreaseRate + '%)'
            )
          },
          sortable: 'custom'
        }
      ]
    }
  },
  computed: {
    groupedDetailFunds: function() {
      if (this.detailFunds && this.detailFunds.length > 0) {
        let groupedFunds = {}
        this.detailFunds.forEach(fund => {
          let { fundCode } = fund
          let { [fundCode]: groupList = [] } = groupedFunds
          groupList.push(fund)
          groupedFunds[fundCode] = groupList
        })
        return groupedFunds
      } else {
        return {}
      }
    }
  },
  watch: {
    summaryFunds: function(n) {
      this.innerSummaryFunds = this.copyArrayInfo(n)
      if (this.innerSummaryFunds && this.innerSummaryFunds.length > 0) {
        // 更新已展开信息
        this.$debug('更新已展开信息：{}', JSON.stringify(this.expendedFunds))
        this.innerSummaryFunds.forEach(fund => fund._expanded = this.expendedFunds[fund.fundCode])
        this.handleInnerSort()
      }
    }
  },
  methods: {
    copyArrayInfo: function(originArray) {
      let result = []
      if (originArray && originArray.length > 0) {
        for (let i = 0; i < originArray.length; i++) {
          result.push(originArray[i])
        }
      }
      return result
    },
    handleInnerSort: function() {
      this.$debug('执行排序：「{},{}」', this.sortKey, this.sortOrder)
      if (this.$isNotEmpty(this.sortKey)) {
        this.innerSummaryFunds = this.innerSummaryFunds.sort((a, b) => {
          let { [this.sortKey]: compareV1 } = a,
            { [this.sortKey]: compareV2 } = b
          if (!isNaN(compareV1)) {
            compareV1 = parseFloat(compareV1)
            compareV2 = parseFloat(compareV2)
          }
          return compareV1 > compareV2 ? this.sortOrder : compareV1 === compareV2 ? 0 : -this.sortOrder
        })
      }
    },
    sortChange: function(sortData) {
      let { column, key, order } = sortData
      this.$debug('sortChange: [{}, {}, {}]', JSON.stringify(column), key, order)
      this.sortOrder = order === 'asc' ? 1 : -1
      this.sortKey = key
      if (order === 'normal') {
        this.sortKey = 'todayIncreaseRate'
        this.sortOrder = 1
      }
      this.handleInnerSort()
    },
    handleExpand: function (row, status) {
      this.$debug('更新展开状态 {} status: {}', row.fundCode, status)
      this.expendedFunds[row.fundCode] = status
    }
  },
  mounted() {
    this.summaryFundsColumns.map(column => {
      this.$set(column, 'minWidth', 150)
      this.$set(column, 'align', 'center')
    })
  }
}
</script>