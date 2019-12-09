<template>
  <div class="container">
    <div id="demo-charts" style="height: 400px;width:600px;" />
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'echarts-demo',
  data() {
    return {}
  },
  methods: {
    initEcharts: function() {
      this.$debug('初始化echarts')
      var myChart = echarts.init(document.getElementById('demo-charts'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
    }
  },
  mounted() {
    this.initEcharts()
  }
}
</script>
