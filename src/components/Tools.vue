<template>
  <div>
    <Breadcrumb>
        <BreadcrumbItem to="/tools/" :class="breadcrumbSelected=='tools'?'active':''">通用工具</BreadcrumbItem>
        <BreadcrumbItem to="/tools/jsonFormat" :class="breadcrumbSelected=='jsonFormat'?'active':''">JSON格式化工具</BreadcrumbItem>
        <BreadcrumbItem to="/tools/sqlLogFormat" :class="breadcrumbSelected=='sqlLogFormat'?'active':''">iBatis/MyBatis日志转换</BreadcrumbItem>
        <BreadcrumbItem to="/tools/encryption" :class="breadcrumbSelected=='encryption'?'active':''">基础加密通信</BreadcrumbItem>
        <BreadcrumbItem to="/tools/t2test" :class="breadcrumbSelected=='t2test'?'active':''">T2测试接口</BreadcrumbItem>
        <BreadcrumbItem to="/tools/taxCal" :class="breadcrumbSelected=='taxCal'?'active':''">个税计算</BreadcrumbItem>
        <span></span>
    </Breadcrumb>
    <div class="tool-container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'

export default {
  name: 'Tools',
  components: {
    TopBar
  },
  data () {
    return {}
  },
  computed: {
    breadcrumbSelected: function () {
      if (this.$route.path.includes('/tools/jsonFormat')) {
        return 'jsonFormat'
      } else if (this.$route.path.includes('/tools/sqlLogFormat')) {
        return 'sqlLogFormat'
      } else if (this.$route.path.includes('/tools/encryption')) {
        return 'encryption'
      } else if (this.$route.path.includes('/tools/t2test')) {
        return 't2test'
      } else if (this.$route.path.includes('/tools/taxCal')) {
        return 'taxCal'
      } else {
        return 'tools'
      }
    }
  },
  methods: {
    jumpList: function () {
      this.$router.push({path: '/tools/testList'})
    }
  },
  mounted () {
    TopBar.selected = 'tools'
  }
}
</script>

<style>
  .lay-span span {
    margin: 0 10px;
    color: #999;
  }

  .lay-span a {
    color: #999;
  }

  .ivu-breadcrumb>span:last-child {
    font-weight: 500;
    color: #495060;
  }
  .ivu-breadcrumb>span.active {
    font-weight: 700;
    color: #495060;
  }
</style>
<style>
.ivu-row {
  margin: 5px 0;
}

.ivu-input-number,.ivu-date-picker {
  width: 100% !important;
}
</style>
