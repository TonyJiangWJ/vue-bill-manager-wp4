<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-07-01 14:37:43
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-15 00:40:39
 * @Description: 
--> 
<template>
  <div>
    <Table stripe border :columns="detailFundsColumns" :data="detailFunds" @on-row-click="handleEdit"></Table>
  </div>
</template>

<script>
export default {
  name: 'FundDetailsExpand',
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
    }
  },
  data() {
    return {
      detailFundsColumns: [
        {
          title: '买入成本',
          key: 'purchaseCost'
        },
        {
          title: '买入单位净值',
          key: 'fundPurchaseValue'
        },
        {
          title: '买入份额',
          key: 'purchaseAmount'
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
            return h(
              'span',
              {
                class: parseFloat(params.row.confirmedIncrease) >= 0 ? this.increaseClass : this.decreaseClass
              },
              params.row.confirmedIncrease + '(' + params.row.confirmedIncreaseRate + '%)'
            )
          }
        },
        {
          title: '今日增长',
          key: 'todayIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.todayIncrease) >= 0 ? this.increaseClass : this.decreaseClass
              },
              params.row.todayIncrease + '(' + params.row.todayIncreaseRate + '%)'
            )
          }
        },
        {
          title: '估算增长',
          key: 'assessmentIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.assessmentIncrease) >= 0 ? this.increaseClass : this.decreaseClass
              },
              params.row.assessmentIncrease + '(' + params.row.assessmentIncreaseRate + '%)'
            )
          }
        }
      ]
    }
  },
  computed: {
    increaseClass: function () {
      return 'green'
    },
    decreaseClass: function () {
      return 'red'
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
  }
}
</script>
<style scoped>
.btn-mg-l {
  margin-left: 0.2rem;
}
</style>