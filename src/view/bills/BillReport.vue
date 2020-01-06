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
    <div id="charts" :style="'text-align: center;width: 100%;height: ' + computedHeight + 'px'" />

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
    <div id="daily-charts" :style="'text-align: center;width: 100%;height: ' + computedHeight + 'px'" />
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
    startMonthDate: function(n, o) {
      if (this.isDate(n)) {
        this.startMonth = this.dateFormat(n, 'yyyy-MM')
      } else {
        this.startMonth = ''
      }
    },
    endMonthDate: function(n, o) {
      if (this.isDate(n)) {
        this.endMonth = this.dateFormat(n, 'yyyy-MM')
      } else {
        this.endMonth = ''
      }
    }
  },
  methods: {
    isDate: function(val) {
      return Object.prototype.toString.call(val) === '[object Date]'
    },
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
      let monthList = this.reportList.map(r => r.month)
      let totalCostList = this.reportList.map(r => parseFloat(r.totalCost))
      let totalIncomeList = this.reportList.map(r => parseFloat(r.totalIncome))
      let totalCleanCostList = this.reportList.map(r => parseFloat(r.totalCostExceptDeletedAndHidden))
      let totalCleanIncomeList = this.reportList.map(r => parseFloat(r.totalIncomeExceptDeletedAndHidden))
      let avgTotalCost = this.getAvg(totalCostList)
      let avgTotalIncome = this.getAvg(totalIncomeList)
      let avgCleanCost = this.getAvg(totalCleanCostList)
      let avgCleanIncome = this.getAvg(totalCleanIncomeList)
      this.$debug('平均总支出：' + avgTotalCost)
      if (this.charts === null) {
        this.charts = echarts.init(document.getElementById('charts'))
      }
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['总支出', '总收入', '净支出', '净收入', '平均总支出', '平均总收入', '平均净支出', '平均净收入']
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
          boundaryGap: false,
          data: monthList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '总支出',
            type: 'line',
            data: totalCostList
          },
          {
            name: '总收入',
            type: 'line',
            data: totalIncomeList
          },
          {
            name: '净支出',
            type: 'line',
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
            type: 'line',
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
          }
        ]
      }
      this.charts.setOption(option)
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
      let monthList = this.dailyReportList.map(r => r.month)
      let totalCostList = this.dailyReportList.map(r => parseFloat(r.totalCost))
      let totalIncomeList = this.dailyReportList.map(r => parseFloat(r.totalIncome))
      let totalCleanCostList = this.dailyReportList.map(r => parseFloat(r.totalCostExceptDeletedAndHidden))
      let totalCleanIncomeList = this.dailyReportList.map(r => parseFloat(r.totalIncomeExceptDeletedAndHidden))
      let avgTotalCost = this.getAvg(totalCostList)
      let avgTotalIncome = this.getAvg(totalIncomeList)
      let avgCleanCost = this.getAvg(totalCleanCostList)
      let avgCleanIncome = this.getAvg(totalCleanIncomeList)
      this.$debug('平均总支出：' + avgTotalCost)
      if (this.dailyCharts === null) {
        this.dailyCharts = echarts.init(document.getElementById('daily-charts'))
      }
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['总支出', '总收入', '净支出', '净收入', '平均总支出', '平均总收入', '平均净支出', '平均净收入']
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
        dataZoom: [
          {
            show: true,
            start: 24,
            end: 100
          },
          {
            type: 'inside',
            start: 24,
            end: 100
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: 'empty',
            width: 30,
            height: '80%',
            showDataShadow: false,
            left: '93%'
          }
        ],
        series: [
          {
            name: '总支出',
            type: 'bar',
            data: totalCostList
          },
          {
            name: '总收入',
            type: 'bar',
            data: totalIncomeList
          },
          {
            name: '净支出',
            type: 'bar',
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
            type: 'bar',
            data: totalCleanIncomeList
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
          }
        ]
      }
      this.dailyCharts.setOption(option)
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