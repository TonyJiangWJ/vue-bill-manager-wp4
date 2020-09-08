<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-07-02 11:02:52
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-09-08 13:16:10
 * @Description: 
--> 
<template>
  <div>
    <Table stripe border :columns="fundColumns" :data="innerFundDatas" @on-sort-change="sortChange" @on-expand="handleExpand" @on-cell-click="handleEdit"></Table>
    <Modal v-model="showFundHistoryNetModal" :title="summaryTitle" :mask-closable="false" :width="650">
      <Row>
        <div id="history-net-charts" :style="'text-align: center;width: 620px;height: 400px'" />
      </Row>
      <Row>
        <i-col span="6">
          <Button @click="loadDefaultHistory">近30个工作日</Button>
        </i-col>
        <i-col span="6">
          <Button @click="loadSixMonthsHistory">最近半年</Button>
        </i-col>
        <i-col span="6">
          <Button @click="loadOneYearHistory">最近一年</Button>
        </i-col>
      </Row>
      <Row>
        <i-col>
          <Button type="success" @click="enhanceFund">增强</Button>
        </i-col>
      </Row>
    </Modal>
    <fund-enhance v-model="showEnhanceModal" :fund-code="current.fundCode" @reload-funds="handleReloadFunds"/>
  </div>
</template>
<script>
// eslint-disable-next-line
import FundDetailsExpand from '@/components/funds/FundDetailsExpand'
import FundEnhance from '@/components/funds/FundEnhance'
import FundChangeMixin from '@/components/funds/fund-change-mixin.js'
import echarts from 'echarts'
import API from '@/js/api.js'
export default {
  name: 'FundSummary',
  components: {
    // eslint-disable-next-line
    FundDetailsExpand,
    FundEnhance
  },
  mixins: [FundChangeMixin],
  props: {
    summaryFunds: {
      type: Array,
      default: () => [],
    },
    detailFunds: {
      type: Array,
      default: () => [],
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
          actualIncreaseRate: '',
        }
      },
    },
  },
  data() {
    return {
      expendedFunds: {},
      showFundHistoryNetModal: false,
      showEnhanceModal: false,
      summaryTitle: '',
      current: {
        fundCode: '',
        fundName: '',
        assessmentValue: ''
      },
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
                detailFunds: this.groupedDetailFunds[params.row.fundCode],
              },
              on: {
                reloadFunds: function () {
                  that.$emit('reload-funds')
                },
              },
            })
          },
        },
        {
          title: '基金名称',
          key: 'fundName',
          sortable: 'custom',
        },
        {
          title: '确认增长',
          key: 'confirmedIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.confirmedIncrease) >= 0 ? 'green' : 'red',
              },
              this.filterUndefinedAsMinus(params.row.confirmedIncrease) +
                '(' +
                this.filterUndefinedAsMinus(params.row.confirmedIncreaseRate) +
                '%)'
            )
          },
          sortable: 'custom',
        },
        {
          title: '当日增长',
          key: 'todayIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.todayIncrease) >= 0 ? 'green' : 'red',
              },
              this.filterUndefinedAsMinus(params.row.todayIncrease) +
                '(' +
                this.filterUndefinedAsMinus(params.row.todayIncreaseRate) +
                '%)'
            )
          },
          sortable: 'custom',
        },
        {
          title: '估算总增长',
          key: 'assessmentIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.assessmentIncrease) >= 0 ? 'green' : 'red',
              },
              this.filterUndefinedAsMinus(params.row.assessmentIncrease) +
                '(' +
                this.filterUndefinedAsMinus(params.row.assessmentIncreaseRate) +
                '%)'
            )
          },
          sortable: 'custom',
        },
        {
          title: '基金编码',
          key: 'fundCode',
          sortable: 'custom',
        },
        {
          title: '持有总成本',
          key: 'purchaseCost',
          sortable: 'custom',
        },
        {
          title: '持有份额',
          key: 'purchaseAmount',
          sortable: 'custom',
        },
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
              class: parseFloat(params.row.lastDayConfirmedIncrease) >= 0 ? 'green' : 'red',
            },
            this.filterUndefinedAsMinus(params.row.lastDayConfirmedIncrease) +
              '(' +
              this.filterUndefinedAsMinus(parseFloat(params.row.lastDayConfirmedIncreaseRate).toFixed(2)) +
              '%)'
          )
        },
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
                class: parseFloat(params.row.todayConfirmedIncrease) >= 0 ? 'green' : 'red',
              },
              this.filterUndefinedAsMinus(params.row.todayConfirmedIncrease) +
                '(' +
                this.filterUndefinedAsMinus(parseFloat(params.row.todayConfirmedIncreaseRate).toFixed(2)) +
                '%)'
            )
          },
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
                class: parseFloat(params.row.todayActualIncrease) >= 0 ? 'green' : 'red',
              },
              this.filterUndefinedAsMinus(params.row.todayActualIncrease) +
                '(' +
                this.filterUndefinedAsMinus(parseFloat(params.row.todayActualIncreaseRate).toFixed(2)) +
                '%)'
            )
          },
        },
      ],
    }
  },
  computed: {
    groupedDetailFunds: function () {
      if (this.detailFunds && this.detailFunds.length > 0) {
        let groupedFunds = {}
        this.detailFunds.forEach((fund) => {
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
    hasLastDayConfirmed: function () {
      return this.$isNotEmpty(this.summaryInfo.lastDayConfirmedIncrease)
    },
    hasActualIncrease: function () {
      return this.$isNotEmpty(this.summaryInfo.actualIncrease)
    },
  },
  watch: {
    summaryFunds: {
      handler(n) {
        this.setInnerFundDatas(n)
        if (this.innerFundDatas && this.innerFundDatas.length > 0) {
          // 更新已展开信息
          this.$debug('更新已展开信息：{}', JSON.stringify(this.expendedFunds))
          this.innerFundDatas.forEach((fund) => (fund._expanded = this.expendedFunds[fund.fundCode]))
          this.handleInnerSort()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    copyArrayInfo: function (originArray) {
      let result = []
      if (originArray && originArray.length > 0) {
        for (let i = 0; i < originArray.length; i++) {
          result.push(originArray[i])
        }
      }
      return result
    },
    handleInnerSort: function () {
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
    sortChange: function (sortData) {
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
    },
    handleEdit: function (row, column) {
      this.$debug('click column: {}', JSON.stringify(column))
      if (column.title) {
        this.current = row
        this.loadDefaultHistory()
      }
    },
    loadDefaultHistory: function () {
      this.loadAndRenderEcharts({ fundCode: this.current.fundCode })
    },
    loadSixMonthsHistory: function () {
      this.loadAndRenderEcharts({
        fundCode: this.current.fundCode ,
        purchaseDate: this.dateFormat(new Date(new Date().getTime() - 3600000 * 24 * 180), 'yyyy-MM-dd'),
      })
    },
    loadOneYearHistory: function () {
      this.loadAndRenderEcharts({
        fundCode: this.current.fundCode ,
        purchaseDate: this.dateFormat(new Date(new Date().getTime() - 3600000 * 24 * 365), 'yyyy-MM-dd'),
      })
    },
    loadAndRenderEcharts: function (request) {
      API.loadFundHistoryNetValues(request).then((resp) => {
        this.$debug('请求结果：{}', JSON.stringify(resp))
        this.showFundHistoryNetModal = true
        this.summaryTitle = `${this.current.fundName}的基金变化曲线`
        let self = this
        setTimeout(function () {
          self.setEcharts(resp, self.current.assessmentValue)
        }, 200)
      })
    },
    initEcharts: function () {
      if (this.$el.netCharts === null) {
        this.$debug('初始化echarts')
        this.$el.netCharts = echarts.init(document.getElementById('history-net-charts'))
      }
    },
    setEcharts: function (response, newValue) {
      this.initEcharts()
      let mapping = response.historyNetValues.map((v) => {
        let result = {}
        for (let k in v) {
          result.key = k
          result.value = v[k]
        }
        return result
      })
      let values = mapping.map((v) => v.value)
      let values2 = Array(values.length - 1).concat([values[values.length - 1], newValue])
      this.$debug('values2: {}', JSON.stringify(values2))
      let allValues = values.concat(newValue)
      let maxIdx = -1,
        minIdx = -1
      let max = 0,
        min = 100
      for (let i = 0; i < allValues.length; i++) {
        let val = parseFloat(allValues[i])
        if (max < val) {
          max = val
          maxIdx = i
        }
        if (min > val) {
          min = val
          minIdx = i
        }
      }
      let rate = min / max
      let option = {
        dataZoom: [
          {
            show: true,
            type: 'slider',
            start: parseInt(rate * 100),
            end: 100,
            yAxisIndex: [0],
          },
        ],
        xAxis: {
          type: 'category',
          data: mapping.map((v) => v.key).concat(['today']),
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          trigger: 'item',
        },
        series: [
          {
            data: values,
            type: 'line',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: (params) => {
                    let dataIdx = params.dataIndex
                    if ((dataIdx === maxIdx || dataIdx === minIdx) && dataIdx !== allValues.length - 2) {
                      return params.value
                    } else {
                      return ''
                    }
                  },
                },
              },
            },
          },
          {
            data: values2,
            type: 'line',
            lineStyle: {
              type: 'dotted',
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: (params) => {
                    let dataIdx = params.dataIndex
                    if (dataIdx === maxIdx || dataIdx === minIdx || dataIdx === allValues.length - 1) {
                      return params.value
                    } else {
                      return ''
                    }
                  },
                },
              },
            },
          },
        ],
      }
      this.$debug('option: {}', JSON.stringify(option))
      this.$el.netCharts.setOption(option)
      this.$el.netCharts.resize()
    },
    enhanceFund: function () {
      this.showEnhanceModal = true
    },
    handleReloadFunds: function () {
      this.$emit('reload-funds')
    }
  },
  mounted() {
    this.summaryFundsColumns.map((column) => {
      this.$set(column, 'minWidth', 150)
      this.$set(column, 'align', 'center')
    })
    this.$el.netCharts = null
    this.$debug('mounted, lastDay: {} actual: {}', this.hasLastDayConfirmed, this.hasActualIncrease)
    this.setInnerFundColumns(this.summaryFundsColumns)
    this.removeColumnsIfNeeded()
  },
}
</script>