<!--
 * @Author: TonyJiangWJ
 * @Date: 2019-12-25 18:43:15
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-01-09 16:10:43
 * @Description: 
 -->
<template>
  <div>
    <div>
      <Breadcrumb>
        <BreadcrumbItem to="/tools/" :class="breadcrumbSelected=='tools'?'active':''">通用工具</BreadcrumbItem>
        <BreadcrumbItem to="/tools/jsonFormat" :class="breadcrumbSelected=='jsonFormat'?'active':''">JSON格式化工具</BreadcrumbItem>
        <BreadcrumbItem to="/tools/sqlLogFormat" :class="breadcrumbSelected=='sqlLogFormat'?'active':''">iBatis/MyBatis日志转换</BreadcrumbItem>
        <BreadcrumbItem to="/tools/encryption" :class="breadcrumbSelected=='encryption'?'active':''">基础加密通信</BreadcrumbItem>
        <!-- <BreadcrumbItem to="/tools/t2test" :class="breadcrumbSelected=='t2test'?'active':''">T2测试接口</BreadcrumbItem> -->
        <BreadcrumbItem to="/tools/taxCal" :class="breadcrumbSelected=='taxCal'?'active':''">个税计算</BreadcrumbItem>
        <span></span>
      </Breadcrumb>
    </div>
    <div class="tool-container">
      <Row type="flex" justify="center" align="middle">
        <i-col :xs="0" :sm="2" :md="2" :lg="3"></i-col>
        <i-col :xs="24" :sm="20" :md="20" :lg="18">
          <keep-alive>
            <router-view class="main-container"></router-view>
          </keep-alive>
        </i-col>
        <i-col :xs="0" :sm="2" :md="2" :lg="3"></i-col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tools',
  data() {
    return {}
  },
  computed: {
    breadcrumbSelected: function() {
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
    jumpList: function() {
      this.$router.push({ path: '/tools/testList' })
    }
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

.ivu-breadcrumb > span:last-child {
  font-weight: 500;
  color: #495060;
}
.ivu-breadcrumb > span.active {
  font-weight: 700;
  color: #495060;
}
.ivu-row {
  margin: 5px 0;
}

.ivu-input-number,
.ivu-date-picker {
  width: 100% !important;
}
.main-container {
  width: 90%;
  margin: 50px auto;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  padding: 5px;
}
</style>
