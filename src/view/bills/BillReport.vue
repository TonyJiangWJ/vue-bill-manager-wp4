<template>
  <div class="common-container" ref="container">
    <Row type="flex" justify="space-around">
      <i-col :xs="8" :sm="6" :md="5" :lg="4" class="v-gap">
        <DatePicker type="month" placeholder="开始月份" v-model="startMonthDate"></DatePicker>
      </i-col>
      <i-col :xs="8" :sm="6" :md="5" :lg="4" class="v-gap">
        <DatePicker type="month" placeholder="结束月份" v-model="endMonthDate"></DatePicker>
      </i-col>
      <i-col :xs="10" :sm="10" :md="10" :lg="8">
        <Button @click="clear" class="v-btn">清空</Button>
        <Button type="primary" @click="doQuery" class="v-btn">查询</Button>
      </i-col>
    </Row>
    <Row style="margin-top: 1.2rem;">
      <i-col>
        <div id="charts" :style="'text-align: center;width: 100%;height: ' + computedHeight + 'px'" />
      </i-col>
    </Row>
    <Divider />
    <Row type="flex" justify="space-around">
      <i-col :xs="8" :sm="6" :md="5" :lg="4" class="v-gap">
        <DatePicker type="date" placeholder="开始时间" v-model="startDate"></DatePicker>
      </i-col>
      <i-col :xs="8" :sm="6" :md="5" :lg="4" class="v-gap">
        <DatePicker type="date" placeholder="结束时间" v-model="endDate"></DatePicker>
      </i-col>
      <i-col :xs="10" :sm="10" :md="10" :lg="8">
        <Button @click="clearDaily" class="v-btn">清空</Button>
        <Button type="primary" @click="doQueryDaily" class="v-btn">查询</Button>
      </i-col>
    </Row>
    <Row style="margin-top: 1.2rem;">
      <i-col>
        <div id="daily-charts" :style="'text-align: center;width: 100%;height: ' + computedHeight + 'px'" />
      </i-col>
    </Row>
  </div>
</template>

<script>
import echarts from 'echarts'
import API from '@/js/api.js'
export default {
  name: 'BillReport',
  data() {
    return {
      startMonth: '',
      endMonth: '',
      startDate: new Date(new Date().getTime() - 3600000 * 24 * 30),
      endDate: new Date(),
      startMonthDate: null,
      endMonthDate: null,
      reportList: [],
      dailyReportList: [],
      charts: null,
      dailyCharts: null,
      computedHeight: 500
    }
  },
  watch: {
    startMonthDate: function(n) {
      if (this.$isDate(n)) {
        this.startMonth = this.dateFormat(n, 'yyyy-MM')
      } else {
        this.startMonth = ''
      }
    },
    endMonthDate: function(n) {
      if (this.$isDate(n)) {
        this.endMonth = this.dateFormat(n, 'yyyy-MM')
      } else {
        this.endMonth = ''
      }
    }
  },
  methods: {
    clear: function() {
      this.startMonthDate = ''
      this.endMonthDate = ''
    },
    doQuery: function() {
      this.loadReportData()
    },
    clearDaily: function() {
      this.startDate = new Date(new Date().getTime() - 3600000 * 24 * 30)
      this.endDate = new Date()
    },
    doQueryDaily: function() {
      this.loadDailyReportData()
    },
    getAvg: function(dataList) {
      if (!dataList || dataList.length === 0) {
        return 0
      }
      return (dataList.reduce((a, b) => (a = a + b)) / dataList.length).toFixed(2)
    },
    getSum: function(dataList) {
      if (!dataList || dataList.length === 0) {
        return 0
      }
      return dataList.reduce((a, b) => (a = a + b)).toFixed(2)
    },
    getChartsOption: function(reportList, daily) {
      if (!(reportList && reportList.length > 0)) {
        return
      }
      let monthList = reportList.map(r => r.month)
      let totalCostList = reportList.map(r => parseFloat(r.totalCost))
      let totalIncomeList = reportList.map(r => parseFloat(r.totalIncome))
      let totalCleanCostList = reportList.map(r => parseFloat(r.totalCostExceptDeletedAndHidden))
      let totalCleanIncomeList = reportList.map(r => parseFloat(r.totalIncomeExceptDeletedAndHidden))
      let avgTotalCost = this.getAvg(totalCostList)
      let avgTotalIncome = this.getAvg(totalIncomeList)
      let avgCleanCost = this.getAvg(totalCleanCostList)
      let avgCleanIncome = this.getAvg(totalCleanIncomeList)
      let totalCleanCost = this.getSum(totalCleanCostList)
      let totalCleanIncome = this.getSum(totalCleanIncomeList)
      this.$debug('平均总支出：' + avgTotalCost + ' 净收入：' + totalCleanIncome + ' 净支出：' + totalCleanCost)

      let option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['总支出', '总收入', '净支出', '净收入', '平均总支出', '平均总收入', '平均净支出', '平均净收入', '收支占比'],
          selected: {
            '总支出': false,
            '总收入': false,
            '平均总支出': false,
            '平均总收入': false,
            '收支占比': false,
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: monthList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '总支出',
            type: daily ? 'bar' : 'line',
            data: totalCostList
          },
          {
            name: '总收入',
            type: daily ? 'bar' : 'line',
            data: totalIncomeList
          },
          {
            name: '净支出',
            type: daily ? 'bar' : 'line',
            data: totalCleanCostList,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            }
          },
          {
            name: '净收入',
            type: daily ? 'bar' : 'line',
            data: totalCleanIncomeList,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            }
          },
          {
            name: '平均总支出',
            type: 'line',
            lineStyle: {
              normal: {
                type: 'dashed'
              }
            },
            data: new Array(monthList.length).fill(avgTotalCost)
          },
          {
            name: '平均总收入',
            type: 'line',
            lineStyle: {
              normal: {
                type: 'dashed'
              }
            },
            data: new Array(monthList.length).fill(avgTotalIncome)
          },
          {
            name: '平均净支出',
            type: 'line',
            lineStyle: {
              normal: {
                type: 'dashed'
              }
            },
            data: new Array(monthList.length).fill(avgCleanCost)
          },
          {
            name: '平均净收入',
            type: 'line',
            lineStyle: {
              normal: {
                type: 'dashed'
              }
            },
            data: new Array(monthList.length).fill(avgCleanIncome)
          },
          {
            name: '收支占比',
            show: false,
            type: 'pie',
            center: ['75%', '35%'],
            radius: ['20%', '35%'],
            z: 100,
            tooltip: {
              trigger: 'item',
              formatter: '{b}:<br/> {c}元 {d}%',
            },
            data: [
              {
                name: '总净收入',
                value: totalCleanIncome,
                label: {
                  show: false,
                  position: 'center',
                  emphasis: {
                    show: true
                  }
                }
              },
              {
                name: '总净支出',
                value: totalCleanCost,
                label: {
                  show: false,
                  position: 'center',
                  emphasis: {
                    show: true
                  }
                }
              }
            ]
          }
        ]
      }
      if (daily) {
        option.dataZoom = [
          {
            show: true,
            start: 24,
            end: 100
          },
          {
            type: 'inside',
            start: 24,
            end: 100
          }
        ]
      } else {
        option.dataZoom = [
          {
            show: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ]
      }
      return option
    },
    loadReportData: function() {
      API.loadMonthlyReport({
        startMonth: this.startMonth,
        endMonth: this.endMonth
      }).then(response => {
        if (response.code === API.CODE_CONST.SUCCESS) {
          this.reportList = response.reportList
          this.initEcharts()
        }
      })
    },
    initEcharts: function() {
      this.$debug('初始化echarts')

      if (!(this.reportList && this.reportList.length > 0)) {
        return
      }

      if (this.charts === null) {
        this.charts = echarts.init(document.getElementById('charts'))
      }

      this.charts.setOption(this.getChartsOption(this.reportList))
      this.charts.resize()
    },
    loadDailyReportData: function() {
      API.loadDailyReport({
        startDate: this.dateFormat(this.startDate, 'yyyy-MM-dd'),
        endDate: this.dateFormat(this.endDate, 'yyyy-MM-dd')
      }).then(response => {
        if (response.code === API.CODE_CONST.SUCCESS) {
          this.dailyReportList = response.reportList
          this.initDailyEcharts()
        }
      })
    },
    initDailyEcharts: function() {
      this.$debug('初始化echarts')

      if (!(this.dailyReportList && this.dailyReportList.length > 0)) {
        return
      }
      if (this.dailyCharts === null) {
        this.dailyCharts = echarts.init(document.getElementById('daily-charts'))
      }
      this.dailyCharts.setOption(this.getChartsOption(this.dailyReportList, true))
      this.dailyCharts.resize()
    }
  },
  mounted() {
    this.loadReportData()
    this.loadDailyReportData()
    let that = this
    window.onresize = function() {
      that.computedHeight = 500
      let windowWidth = window.innerWidth
      let windowHeight = window.innerHeight
      if (windowHeight / windowWidth > 1.3) {
        that.computedHeight = windowWidth * 0.9
      }
      that.charts.resize()
      that.dailyCharts.resize()
    }
  }
}
</script>
