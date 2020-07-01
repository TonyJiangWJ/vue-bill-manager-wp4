<!--
 * @Author: TonyJiangWJ
 * @Date: 2019-12-25 18:43:15
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-01 11:04:53
 * @Description: 
 -->
<template>
  <div class="container">
    <div id="demo-charts" style="height: 600px;width:1200px;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import API from '@/js/api.js'
export default {
  name: 'echarts-demo',
  data() {
    return {}
  },
  methods: {
    getAvg: function(dataList) {
      if (!dataList || dataList.length === 0) {
        return 0
      }
      return (dataList.reduce((a, b) => (a = a + b)) / dataList.length).toFixed(2)
    },
    initEcharts: function() {
      this.$debug('初始化echarts')
      API.loadMonthlyReport({
        startMonth: '2019-01',
        endMonth: '2019-12'
      }).then(response => {
        if (!(response.reportList && response.reportList.length > 0)) {
          return
        }
        let monthList = response.reportList.map(r => r.month)
        let totalCostList = response.reportList.map(r => parseFloat(r.totalCost))
        let totalIncomeList = response.reportList.map(r => parseFloat(r.totalIncome))
        let totalCleanCostList = response.reportList.map(r => parseFloat(r.totalCostExceptDeletedAndHidden))
        let totalCleanIncomeList = response.reportList.map(r => parseFloat(r.totalIncomeExceptDeletedAndHidden))
        let avgTotalCost = this.getAvg(totalCostList)
        let avgTotalIncome = this.getAvg(totalIncomeList)
        let avgCleanCost = this.getAvg(totalCleanCostList)
        let avgCleanIncome = this.getAvg(totalCleanIncomeList)
        this.$debug('平均总支出：' + avgTotalCost)
        let myChart = echarts.init(document.getElementById('demo-charts'))
        let option = {
          title: {
            text: '月度支出'
          },
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
              data: totalCleanCostList
            },
            {
              name: '净收入',
              type: 'line',
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
        myChart.setOption(option)
      })
    }
  },
  mounted() {
    this.initEcharts()
  }
}
</script>
