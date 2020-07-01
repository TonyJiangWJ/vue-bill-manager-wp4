<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-06-28 21:54:55
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-01 15:42:57
 * @Description: 
--> 
<template>
  <div class="common-container" ref="container">
    <Row type="flex" justify="space-around">
      <i-col :xs="8" :sm="6" :md="5" :lg="4" class="v-gap">
        <DatePicker type="date" placeholder="查询日期" v-model="assessmentDateQuery"></DatePicker>
      </i-col>
      <i-col :xs="10" :sm="10" :md="10" :lg="8">
        <Button @click="clear" class="v-btn">清空</Button>
        <Button type="primary" @click="doQuery" class="v-btn">查询</Button>
      </i-col>
    </Row>
    <Row style="margin-top: 1.2rem;">
      <i-col v-if="fundHistoryResp && fundHistoryResp.length > 0">
        <div id="charts" :style="'text-align: center;width: 100%;height: ' + computedHeight + 'px'" />
      </i-col>
      <i-col v-else>
        <span>暂无当前日期的历史数据</span>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="6">总持有成本：</i-col>
      <i-col span="6">{{summaryInfo.totalCost}}</i-col>
      <i-col span="6">确认增长：</i-col>
      <i-col
        span="6"
        :class="parseFloat(summaryInfo.confirmedIncrease) > 0 ? 'green':'red'"
      >{{summaryInfo.confirmedIncrease}}({{summaryInfo.confirmedIncreaseRate}}%)</i-col>
    </Row>
    <Row>
      <i-col span="6">总持有金额：</i-col>
      <i-col span="6">{{summaryInfo.totalHold}}</i-col>
      <i-col span="6">估算增长：</i-col>
      <i-col
        span="6"
        :class="parseFloat(summaryInfo.assessmentIncrease) > 0 ? 'green':'red'"
      >{{summaryInfo.assessmentIncrease}}({{summaryInfo.assessmentIncreaseRate}}%)</i-col>
    </Row>
    <Row>
      <i-col span="6">总手续费：</i-col>
      <i-col span="6">{{summaryInfo.totalFee}}</i-col>
      <i-col span="6">今日增长：</i-col>
      <i-col span="6" :class="parseFloat(summaryInfo.todayIncrease) > 0 ? 'green':'red'">{{summaryInfo.todayIncrease}}({{summaryInfo.todayIncreaseRate}}%)</i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="4">
        <Button size="small" type="primary" ghost @click="showFundInfoAdder=true" class="v-btn">添加基金</Button>
      </i-col>
      <i-col span="4">
        <Button size="small" type="primary" ghost @click="showFundInfoImporter=true" class="v-btn">批量导入基金</Button>
      </i-col>
    </Row>
    <Row>
      <fund-import />
    </Row>
    <Table stripe border :columns="summaryFundsColumns" :data="summaryFunds"></Table>
    <Divider />
    <fund-any-can-sale :detail-funds="detailFunds" :fund-history-resp="fundHistoryResp" />

    <fund-info-adder v-model="showFundInfoAdder" @reload-fund-info="loadFundChanges" />
  </div>
</template>

<script>
import echarts from 'echarts'
import API from '@/js/api.js'
import FundInfoAdder from '@/components/funds/FundInfoAdder'
import FundImport from '@/components/funds/FundImport'
import FundAnyCanSale from '@/components/funds/FundAnyCanSale'
// eslint-disable-next-line
import FundDetailsExpand from '@/components/funds/FundDetailsExpand'
export default {
  name: 'FundHistoryValues',
  components: {
    FundInfoAdder,
    FundImport,
    FundAnyCanSale,
    // eslint-disable-next-line
    FundDetailsExpand
  },
  data() {
    return {
      autoLoadInterval: null,
      assessmentDate: this.dateFormat(new Date(), 'yyyy-MM-dd'),
      assessmentDateQuery: this.dateFormat(new Date(), 'yyyy-MM-dd'),
      computedHeight: 800,
      fundHistoryResp: null,
      showFundInfoAdder: false,
      summaryFunds: [],
      detailFunds: [],
      summaryInfo: {
        totalCost: '',
        totalHold: '',
        totalFee: '',
        confirmedIncrease: '',
        confirmedIncreaseRate: '',
        assessmentIncrease: '',
        assessmentIncreaseRate: '',
        todayIncrease: '',
        todayIncreaseRate: ''
      },
      summaryFundsColumns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(FundDetailsExpand, {
              props: {
                fundCode: params.row.fundCode,
                detailFunds: this.groupedDetailFunds[params.row.fundCode]
              },
              on: {
                'reload-funds': function() {
                  this.doQuery()
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
          key: 'fundCode'
        },
        {
          title: '持有总成本',
          key: 'purchaseCost'
        },
        {
          title: '持有份额',
          key: 'purchaseAmount'
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
          }
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
          }
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
    }
  },
  watch: {
    assessmentDateQuery: function(n) {
      if (this.isDate(n)) {
        this.assessmentDate = this.dateFormat(n, 'yyyy-MM-dd')
      } else {
        this.assessmentDate = ''
      }
    }
  },
  methods: {
    isDate: function(val) {
      return Object.prototype.toString.call(val) === '[object Date]'
    },
    getChartsOption: function(fundHistoryResp) {
      let s = 0
      let minIdx = {},
        maxIdx = {}
      // 计算每个系列最大值和最小值的下标
      Object.keys(fundHistoryResp.increaseRateMapping).forEach(key => {
        let rateList = fundHistoryResp.increaseRateMapping[key]
        let max = -100,
          min = 100
        for (let i = 0; i < rateList.length; i++) {
          if (max < parseFloat(rateList[i])) {
            max = parseFloat(rateList[i])
            maxIdx[key] = i
          }
          if (min > parseFloat(rateList[i])) {
            min = parseFloat(rateList[i])
            minIdx[key] = i
          }
        }
      })
      this.$debug('minIdx:' + JSON.stringify(minIdx))
      this.$debug('maxIdx:' + JSON.stringify(maxIdx))
      let option = {
        dataZoom: [
          {
            show: true,
            type: 'slider',
            start: 0,
            end: 100,
            xAxisIndex: [0],
            bottom: '15%'
          }
        ],
        title: {
          text: this.assessmentDate + ' 基金估值变化曲线'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '2%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: Array(fundHistoryResp.length)
            .join(',')
            .split(',')
            .map(() => s++)
        },
        yAxis: {
          type: 'value'
        },
        series: Object.keys(fundHistoryResp.increaseRateMapping).map(k => {
          return {
            name: k,
            type: 'line',
            itemStyle: {
              normal: {
                lineStyle: {
                  type: k === '总增长率' ? 'dotted' : 'solid'
                },
                label: {
                  show: true,
                  formatter: params => {
                    let dataIdx = params.dataIndex
                    if (dataIdx === fundHistoryResp.length - 1 || dataIdx === maxIdx[k] || dataIdx === minIdx[k]) {
                      return params.value
                    } else {
                      return ''
                    }
                  }
                }
              }
            },
            data: (() => {
              let fundRateList = fundHistoryResp.increaseRateMapping[k]
              if (fundRateList.length < fundHistoryResp.length) {
                fundRateList = Array(fundHistoryResp.length - fundRateList.length + 1)
                  .join(',0')
                  .split(',')
                  .slice(1)
                  .concat(fundRateList)
              }
              return fundRateList
            })()
          }
        })
      }
      return option
    },
    clear: function() {
      this.assessmentDate = ''
      this.assessmentDateQuery = null
    },
    doQuery: function() {
      this.loadData()
      this.loadFundChanges()
    },
    loadFundChanges: function() {
      if (!this.assessmentDate) {
        this.$Message.error('请输入查询日期')
        return
      }
      API.loadFundChangeInfos({
        assessmentDate: this.assessmentDate
      }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          Object.keys(this.summaryInfo).forEach(key => {
            this.$set(this.summaryInfo, key, resp[key])
          })
          this.summaryFunds = resp.summaryFundInfos.sort((f1, f2) => {
            let { todayIncreaseRate: r1 } = f1,
              { todayIncreaseRate: r2 } = f2
            r1 = parseFloat(r1)
            r2 = parseFloat(r2)
            return r1 > r2 ? 1 : r1 === r2 ? 0 : -1
          })
          this.detailFunds = resp.fundDetailInfos.sort((f1, f2) => {
            let { fundCode: code1, assessmentIncreaseRate: r1 } = f1,
              { fundCode: code2, assessmentIncreaseRate: r2 } = f2
            return code1 > code2 ? 1 : code1 < code2 ? -1 : parseFloat(r1) > parseFloat(r2) ? 1 : r1 === r2 ? 0 : -1
          })
        }
      })
    },
    loadData: function() {
      if (!this.assessmentDate) {
        this.$Message.error('请输入查询日期')
        return
      }
      API.loadFundHistoryValues({
        assessmentDate: this.assessmentDate
      }).then(response => {
        if (response.code === API.CODE_CONST.SUCCESS) {
          this.fundHistoryResp = response
          let that = this
          setTimeout(function() {
            that.initEcharts()
          }, 200)
        }
      })
    },
    initEcharts: function() {
      this.$debug('初始化echarts')

      if (!this.fundHistoryResp || !this.fundHistoryResp.length) {
        this.$Message.error('未查询到相关数据')
        this.$el.charts = null
        return
      }

      if (this.$el.charts === null) {
        this.$el.charts = echarts.init(document.getElementById('charts'))
      }

      this.$el.charts.setOption(this.getChartsOption(this.fundHistoryResp))
      this.$el.charts.resize()
    },
    remove: function(row) {
      this.$debug('delete row info:' + JSON.stringify(row))
      this.$Modal.confirm({
        title: '确定要删除：' + row.fundName + ' 吗？',
        onOk: function() {
          API.deleteFundInfo({ id: row.id }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.$Message.success('删除成功')
              this.loadFundChanges()
            } else {
              this.$Message.error('删除失败 ' + resp.msg)
            }
          })
        }
      })
    }
  },
  mounted() {
    this.$el.charts = null
    let that = this
    that.$debug('mounted')
    that.loadData()
    that.loadFundChanges()
    this.autoLoadInterval = setInterval(function() {
      that.$debug('每一分钟定时轮询')
      that.loadData()
      that.loadFundChanges()
    }, 60000)
    window.onresize = function() {
      that.computedHeight = 800
      let windowWidth = window.innerWidth
      let windowHeight = window.innerHeight
      if (windowHeight / windowWidth > 1.3) {
        that.computedHeight = windowWidth * 0.9
      }
      that.$el.charts.resize()
    }
    this.summaryFundsColumns.map(column => {
      this.$set(column, 'minWidth', 150)
      this.$set(column, 'align', 'center')
    })
  },
  destroyed() {
    this.$debug('离开页面，准备关闭定时器：{}', this.autoLoadInterval)
    if (this.autoLoadInterval) {
      clearInterval(this.autoLoadInterval)
    }
  }
}
</script>

<style>
.red {
  color: red !important;
}
.green {
  color: green !important;
}
</style>