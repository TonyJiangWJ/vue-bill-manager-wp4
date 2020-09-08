<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-07-01 14:37:43
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-21 15:01:17
 * @Description: 
--> 
<template>
  <div>
    <Table stripe border :columns="fundColumns" :data="innerFundDatas" @on-sort-change="sortChange" @on-row-click="handleEdit"></Table>
  </div>
</template>

<script>
import FundChangeMixin from '@/components/funds/fund-change-mixin.js'
export default {
  name: 'FundDetailsExpand',
  mixins: [FundChangeMixin],
  props: {
    detailFunds: {
      type: Array,
      default: () => []
    },
    fundCode: {
      type: String,
      default: ''
    },
    colorType: {
      type: String,
      default: '1'
    },
    hasLastDayConfirmed: {
      type: Boolean,
      default: false
    },
    hasActualIncrease: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detailFundsColumns: [
        {
          title: '买入成本',
          key: 'purchaseCost',
          sortable: 'custom'
        },
        {
          title: '确认增长',
          sortable: 'custom',
          key: 'confirmedIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.confirmedIncrease) >= 0 ? this.increaseClass : this.decreaseClass
              },
              this.filterUndefinedAsMinus(params.row.confirmedIncrease) + '(' + this.filterUndefinedAsMinus(params.row.confirmedIncreaseRate) + '%)'
            )
          }
        },
        {
          title: '当日增长',
          sortable: 'custom',
          key: 'todayIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.todayIncrease) >= 0 ? this.increaseClass : this.decreaseClass
              },
              this.filterUndefinedAsMinus(params.row.todayIncrease) + '(' + this.filterUndefinedAsMinus(params.row.todayIncreaseRate) + '%)'
            )
          }
        },
        {
          title: '估算总增长',
          sortable: 'custom',
          key: 'assessmentIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.assessmentIncrease) >= 0 ? this.increaseClass : this.decreaseClass
              },
              this.filterUndefinedAsMinus(params.row.assessmentIncrease) + '(' + this.filterUndefinedAsMinus(params.row.assessmentIncreaseRate) + '%)'
            )
          }
        },
        {
          title: '买入单位净值',
          key: 'fundPurchaseValue',
          sortable: 'custom'
        },
        {
          title: '买入份额',
          key: 'purchaseAmount',
          sortable: 'custom'
        },
        {
          title: '买入时间',
          key: 'purchaseDate',
          sortable: 'custom'
        },
        {
          title: '买入确认时间',
          key: 'purchaseConfirmDate',
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
            this.filterUndefinedAsMinus(params.row.lastDayConfirmedIncrease) + '(' + this.filterUndefinedAsMinus(parseFloat(params.row.lastDayConfirmedIncreaseRate).toFixed(2)) + '%)'
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
              this.filterUndefinedAsMinus(params.row.todayConfirmedIncrease) + '(' + this.filterUndefinedAsMinus(parseFloat(params.row.todayConfirmedIncreaseRate).toFixed(2)) + '%)'
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
              this.filterUndefinedAsMinus(params.row.todayActualIncrease) + '(' + this.filterUndefinedAsMinus(parseFloat(params.row.todayActualIncreaseRate).toFixed(2)) + '%)'
            )
          }
        }
      ]
    }
  },
  computed: {
    increaseClass: function() {
      return 'green'
    },
    decreaseClass: function() {
      return 'red'
    }
  },
  watch: {
    detailFunds: {
      handler(n) {
        this.setInnerFundDatas(n)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleEdit: function(row, index) {
      this.$debug('edit target: {} purchaseValue: {}', index, row.fundPurchaseValue)
      this.$store.commit('fundManager/setCurrentEdit', row)
      this.$store.commit('fundManager/showEditDrawer')
    }
  },
  mounted() {
    this.detailFundsColumns.map(column => {
      this.$set(column, 'minWidth', 150)
      this.$set(column, 'align', 'center')
    })
    this.setInnerFundColumns(this.detailFundsColumns)
    this.removeColumnsIfNeeded()
  }
}
</script>
<style scoped>
.btn-mg-l {
  margin-left: 0.2rem;
}
</style>