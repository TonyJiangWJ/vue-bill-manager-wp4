<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-06-28 21:54:55
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-18 10:42:50
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
    <Divider />
    <Row v-if="fundHistoryResp && fundHistoryResp.length > 0">
      <i-col :md="4" :xs="8">
        <Button size="small" @click="showAllCharts" class="v-btn">显示所有线</Button>
      </i-col>
      <i-col :md="4" :xs="8">
        <Button size="small" @click="hideAllCharts" class="v-btn">隐藏所有线</Button>
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
        :class="parseFloat(summaryInfo.confirmedIncrease) > 0 ? increaseClass : decreaseClass"
      >{{summaryInfo.confirmedIncrease}}({{summaryInfo.confirmedIncreaseRate}}%)</i-col>
    </Row>
    <Row>
      <i-col span="6">总持有金额：</i-col>
      <i-col span="6">{{summaryInfo.totalHold}}</i-col>
      <i-col span="6">估算总增长：</i-col>
      <i-col
        span="6"
        :class="parseFloat(summaryInfo.assessmentIncrease) > 0 ? increaseClass : decreaseClass"
      >{{summaryInfo.assessmentIncrease}}({{summaryInfo.assessmentIncreaseRate}}%)</i-col>
    </Row>
    <Row>
      <i-col span="6">总手续费：</i-col>
      <i-col span="6">{{summaryInfo.totalFee}}</i-col>
      <i-col span="6">当日增长：</i-col>
      <i-col span="6" :class="parseFloat(summaryInfo.todayIncrease) > 0 ? increaseClass : decreaseClass">{{summaryInfo.todayIncrease}}({{summaryInfo.todayIncreaseRate}}%)</i-col>
    </Row>
    <Row v-if="$isNotEmpty(summaryInfo.lastDayConfirmedIncrease)">
      <i-col offset="12" span="6">上日增长：</i-col>
      <i-col span="6" :class="parseFloat(summaryInfo.lastDayConfirmedIncrease) > 0 ? increaseClass : decreaseClass">{{summaryInfo.lastDayConfirmedIncrease}}({{summaryInfo.lastDayConfirmedIncreaseRate}}%)</i-col>
    </Row>
    <template v-if="$isNotEmpty(summaryInfo.actualIncrease)">
    <Row>
      <i-col offset="12" span="6">确认当日增长：</i-col>
      <i-col span="6" :class="parseFloat(summaryInfo.todayConfirmedIncrease) > 0 ? increaseClass : decreaseClass">{{summaryInfo.todayConfirmedIncrease}}({{summaryInfo.todayConfirmedIncreaseRate}}%)</i-col>
    </Row>
    <Row>
      <i-col offset="12" span="6">确认当日总增长：</i-col>
      <i-col span="6" :class="parseFloat(summaryInfo.actualIncrease) > 0 ? increaseClass : decreaseClass">{{summaryInfo.actualIncrease}}({{summaryInfo.actualIncreaseRate}}%)</i-col>
    </Row>
    </template>
    <Divider />
    <Row type="flex" justify="center" align="middle" class="mg-btm">
      <i-col :md="4" :sm="8" :xs="8">
        <Button size="small" type="primary" ghost @click="showFundInfoAdder=true" class="v-btn">添加基金</Button>
      </i-col>
      <i-col :md="8" :sm="8" :xs="14">
        <Tooltip placement="top">
          <Icon type="ios-help-circle-outline" size="25" />
          <div slot="content">
            <p>[{</p>
            <p>"fundCode": "基金编码",</p>
            <p>"fundName": "基金名称",</p>
            <p>"purchaseDate": "买入日期",</p>
            <p>"confirmDate": "买入确认日期",</p>
            <p>"purchaseValue": "买入单位净值",</p>
            <p>"purchaseAmount": "买入份额",</p>
            <p>"purchaseCost": "买入总支出",</p>
            <p>"purchaseFee": "买入手续费"</p>
            <p>}]</p>
          </div>
        </Tooltip>
        <span style="margin-left:0.5rem;margin-bottom: 0.5rem;">批量导入基金:</span>
        <i-switch style="margin-left:0.5rem;margin-bottom: 0.2rem;" v-model="showFundInfoImporter" />
      </i-col>
    </Row>
    <fund-import v-if="showFundInfoImporter" @reload-funds="doQuery" />
    <fund-summary :summary-info="summaryInfo" :detail-funds="detailFunds" :summary-funds="summaryFunds" @reload-funds="doQuery" />
    <Divider />
    <fund-any-can-sale :detail-funds="detailFunds" :summary-funds="summaryFunds" @reload-funds="doQuery" :assessment-date="assessmentDate" />

    <fund-info-adder v-model="showFundInfoAdder" @reload-funds="doQuery" />
    <fund-detail-edit-drawer @reload-funds="doQuery" />
    <fund-part-sale-drawer @reload-funds="doQuery" />
  </div>
</template>

<script>
import echarts from 'echarts'
import API from '@/js/api.js'
import FundInfoAdder from '@/components/funds/FundInfoAdder'
import FundImport from '@/components/funds/FundImport'
import FundAnyCanSale from '@/components/funds/FundAnyCanSale'
import FundSummary from '@/components/funds/FundSummary'
import FundDetailEditDrawer from '@/components/funds/FundDetailEditDrawer'
import FundPartSaleDrawer from '@/components/funds/FundPartSaleDrawer'
export default {
  name: 'FundHistoryValues',
  components: {
    FundInfoAdder,
    FundImport,
    FundAnyCanSale,
    FundSummary,
    FundDetailEditDrawer,
    FundPartSaleDrawer
  },
  data() {
    return {
      colorType: '1',
      autoLoadInterval: null,
      assessmentDate: this.dateFormat(new Date(), 'yyyy-MM-dd'),
      assessmentDateQuery: this.dateFormat(new Date(), 'yyyy-MM-dd'),
      computedHeight: 800,
      fundHistoryResp: null,
      showFundInfoAdder: false,
      showFundInfoImporter: false,
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
        todayIncreaseRate: '',
        lastDayConfirmedIncrease: '',
        lastDayConfirmedIncreaseRate: '',
        todayConfirmedIncrease: '',
        todayConfirmedIncreaseRate: '',
        actualIncrease: '',
        actualIncreaseRate: ''
      }
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
  watch: {
    assessmentDateQuery: function(n) {
      if (this.$isDate(n)) {
        this.assessmentDate = this.dateFormat(n, 'yyyy-MM-dd')
      } else {
        this.assessmentDate = ''
      }
    }
  },
  methods: {
    getChartsOption: function(fundHistoryResp) {
      let s = 0
      let minIdx = {},
        maxIdx = {}
      // 计算每个系列最大值和最小值的下标
      Object.keys(fundHistoryResp.increaseRateMapping).forEach(key => {
        let rateList = fundHistoryResp.increaseRateMapping[key]
        if (rateList.length < fundHistoryResp.length) {
          rateList = Array(fundHistoryResp.length - rateList.length + 1)
            .join(',0')
            .split(',')
            .slice(1)
            .concat(rateList)
        }
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
        // 重新设置前置补零后的增长曲线数组
        fundHistoryResp.increaseRateMapping[key] = rateList
      })
      this.$debug('minIdx:' + JSON.stringify(minIdx))
      this.$debug('maxIdx:' + JSON.stringify(maxIdx))
      let width = document.documentElement.clientWidth
      let option = {
        dataZoom: [
          {
            show: true,
            type: 'slider',
            start: 0,
            end: 100,
            xAxisIndex: [0],
            bottom: '10%'
          }
        ],
        title: {
          text: this.assessmentDate + ' 基金估值变化曲线'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: width >= 700 ? 'plain' : 'scroll',
          pageIconSize: 30,
          data: Object.keys(fundHistoryResp.increaseRateMapping),
          bottom: '2%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
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
            data: fundHistoryResp.increaseRateMapping[k]
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
    toggleCharts: function(show) {
      if (this.$el.charts !== null) {
        let option = this.getChartsOption(this.fundHistoryResp)
        let attrs = this.$el.charts.getOption().legend[0].data
        this.$debug('attrs: {}', JSON.stringify(attrs))
        let obj = {}
        for (var key in attrs) {
          obj[attrs[key]] = show
        }
        this.$debug('obj: {}', JSON.stringify(obj))
        option.legend.selected = obj
        this.$el.charts.setOption(option)
      }
    },
    showAllCharts: function() {
      this.toggleCharts(true)
    },
    hideAllCharts: function() {
      this.toggleCharts(false)
    }
  },
  mounted() {
    this.$el.charts = null
    let that = this
    that.$debug('mounted')
    that.doQuery()
    this.autoLoadInterval = setInterval(function() {
      let currentTime = new Date()
      if (
        (currentTime.getHours() >= 9 && currentTime.getHours() <= 14) ||
        (currentTime.getHours() === 15 && currentTime.getMinutes() <= 20)
      ) {
        that.$debug('每一分钟定时轮询')
        that.doQuery()
      } else {
        that.$debug('超过定时轮询时间段，不执行轮询')
        clearInterval(that.autoLoadInterval)
      }
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
.mg-btm {
  margin-bottom: 0.5rem;
}
</style>