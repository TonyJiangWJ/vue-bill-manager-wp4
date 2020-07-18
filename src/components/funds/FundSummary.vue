<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-07-02 11:02:52
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-18 09:35:54
 * @Description: 
--> 
<template>
  <div>
    <Table stripe border :columns="fundColumns" :data="innerFundDatas" @on-sort-change="sortChange" @on-expand="handleExpand"></Table>
  </div>
</template>
<script>
// eslint-disable-next-line
import FundDetailsExpand from '@/components/funds/FundDetailsExpand'
import FundChangeMixin from '@/components/funds/fund-change-mixin.js'
export default {
  name: 'FundSummary',
  components: {
    // eslint-disable-next-line
    FundDetailsExpand
  },
  mixins: [FundChangeMixin],
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
          todayIncreaseRate: '',
          lastDayIncrease: '',
          lastDayIncreaseRate: '',
          todayConfirmedIncrease: '',
          todayConfirmedIncreaseRate: '',
          actualIncrease: '',
          actualIncreaseRate: ''
        }
      }
    }
  },
  data() {
    return {
      expendedFunds: {},
      summaryFundsColumns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            let that = this
            return h(FundDetailsExpand, {
              props: {
                fundCode: params.row.fundCode,
                hasActualIncrease: this.hasActualIncrease,
                hasLastDayConfirmed: this.hasLastDayConfirmed,
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
          title: '当日增长',
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
          title: '估算总增长',
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
        }
      ],
      lastDayIncreaseColumn: {
        title: '上日增长',
        sortable: 'custom',
        key: 'lastDayConfirmedIncrease',
        minWidth: 150,
        align: 'center',
        render: (h, params) => {
          return h(
            'span',
            {
              class: parseFloat(params.row.lastDayConfirmedIncrease) >= 0 ? 'green' : 'red'
            },
            params.row.lastDayConfirmedIncrease + '(' + parseFloat(params.row.lastDayConfirmedIncreaseRate).toFixed(2) + '%)'
          )
        }
      },
      actualIncreaseColumns: [
        {
          title: '确认当日增长',
          key: 'todayConfirmedIncrease',
          minWidth: 150,
          align: 'center',
          sortable: 'custom',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.todayConfirmedIncrease) >= 0 ? 'green' : 'red'
              },
              params.row.todayConfirmedIncrease + '(' + parseFloat(params.row.todayConfirmedIncreaseRate).toFixed(2) + '%)'
            )
          }
        },
        {
          title: '确认总增长',
          key: 'todayActualIncrease',
          minWidth: 150,
          align: 'center',
          sortable: 'custom',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.todayActualIncrease) >= 0 ? 'green' : 'red'
              },
              params.row.todayActualIncrease + '(' + parseFloat(params.row.todayActualIncreaseRate).toFixed(2) + '%)'
            )
          }
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
    },
    hasLastDayConfirmed: function() {
      return this.$isNotEmpty(this.summaryInfo.lastDayConfirmedIncrease)
    },
    hasActualIncrease: function() {
      return this.$isNotEmpty(this.summaryInfo.actualIncrease)
    }
  },
  watch: {
    summaryFunds: {
      handler(n) {
        this.setInnerFundDatas(n)
        if (this.innerFundDatas && this.innerFundDatas.length > 0) {
          // 更新已展开信息
          this.$debug('更新已展开信息：{}', JSON.stringify(this.expendedFunds))
          this.innerFundDatas.forEach(fund => (fund._expanded = this.expendedFunds[fund.fundCode]))
          this.handleInnerSort()
        }
      },
      deep: true,
      immediate: true
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
        this.innerFundDatas = this.innerFundDatas.sort((a, b) => {
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
    handleExpand: function(row, status) {
      this.$debug('更新展开状态 {} status: {}', row.fundCode, status)
      this.expendedFunds[row.fundCode] = status
    }
  },
  mounted() {
    this.summaryFundsColumns.map(column => {
      this.$set(column, 'minWidth', 150)
      this.$set(column, 'align', 'center')
    })
    this.$debug('mounted, lastDay: {} actual: {}', this.hasLastDayConfirmed, this.hasActualIncrease)
    this.setInnerFundColumns(this.summaryFundsColumns)
    this.removeColumnsIfNeeded()
  }
}
</script>