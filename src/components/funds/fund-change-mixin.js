/*
 * @Author: TonyJiangWJ
 * @Date: 2020-07-17 22:09:54
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-18 09:37:14
 * @Description: 
 */

export default {
  data () {
    return {
      sortKey: '',
      sortOrder: 1,
      innerFundDatas: [],
      fundColumns: []
    }
  },
  methods: {
    removeLastDaysColumnIfNeeded: function () {
      let index = this.fundColumns.findIndex(f => f.key === 'lastDayConfirmedIncrease')
      if (!this.hasLastDayConfirmed) {
        if (index > -1) {
          this.fundColumns.splice(index, 1)
        }
      } else {
        if (index === -1) {
          let flagIndex = this.fundColumns.findIndex(f => f.key === 'confirmedIncrease')
          this.fundColumns = this.fundColumns
            .slice(0, flagIndex + 1)
            .concat([this.lastDayIncreaseColumn])
            .concat(this.fundColumns.slice(flagIndex + 1))
        }
      }
    },
    removeActualColumnsIfNeeded: function () {
      
      let index = this.fundColumns.findIndex(f => f.key === 'todayConfirmedIncrease')
      if (!this.hasActualIncrease) {
        if (index > -1) {
          this.fundColumns.splice(index, 1)
        }
        index = this.fundColumns.findIndex(f => f.key === 'todayActualIncrease')
        if (index > -1) {
          this.fundColumns.splice(index, 1)
        }
      } else {
        if (index === -1) {
          let flagIndex = this.fundColumns.findIndex(f => f.key === 'assessmentIncrease')
          this.fundColumns = this.fundColumns
            .slice(0, flagIndex)
            .concat(this.actualIncreaseColumns[0])
            .concat(this.fundColumns.slice(flagIndex))
          flagIndex = this.fundColumns.findIndex(f => f.key === 'assessmentIncrease')
          this.fundColumns = this.fundColumns
            .slice(0, flagIndex + 1)
            .concat(this.actualIncreaseColumns[1])
            .concat(this.fundColumns.slice(flagIndex + 1))
        }
      }
    },
    removeColumnsIfNeeded: function () {
      this.removeLastDaysColumnIfNeeded()
      this.removeActualColumnsIfNeeded()
    },
    copyArrayInfo: function(originArray) {
      let result = []
      if (originArray && originArray.length > 0) {
        for (let i = 0; i < originArray.length; i++) {
          result.push(originArray[i])
        }
      }
      return result
    },
    setInnerFundDatas: function (fundDatas) {
      this.$debug('setInnerFundDatas')
      this.innerFundDatas = this.copyArrayInfo(fundDatas)
    },
    setInnerFundColumns: function (fundColumns) {
      this.$debug('setInnerFundColumns')
      this.fundColumns = fundColumns
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
    }
  },
  watch: {
    hasLastDayConfirmed: function (n) {
      this.$debug('hasLastDayConfirmed: {}', n)
      this.removeLastDaysColumnIfNeeded()
    },
    hasActualIncrease: function (n) {
      this.$debug('hasActualIncrease: {}', n)
      this.removeActualColumnsIfNeeded()
    }
  }
}
