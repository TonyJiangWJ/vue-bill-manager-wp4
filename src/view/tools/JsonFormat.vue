<template>
  <div id="jsonFormat" class="layui-row layui-col-space5">
    <Row type="flex" justify="center" align="top">
      <Col :xs="24" :sm="3"></Col>
      <Col :xs="24" :sm="18">
        <Row>
          <Col span="24"><h2>JSON格式化校验工具</h2></Col>
        </Row>
        <Row>
          <Col span="22" offset="1"><Input type="textarea" :rows="8" v-model="sourceStr" placeholder="source"/></Col>
        </Row>
        <Row>
          <Col span="22" offset="1"><Input type="textarea" :rows="12" v-model="targetStr" placeholder="target"/></Col>
        </Row>
        <Row>
          <Col span="22" offset="1"><Button type="primary" @click="checkJson">格式化校验</Button></Col>
        </Row>
      </Col>
      <Col :xs="0" :sm="3"></Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'JsonFormat',
  data () {
    return {
      sourceStr: '',
      targetStr: ''
    }
  },
  methods: {
    checkJson: function () {
      var json = JSON.object
      try {
        json = JSON.parse(this.sourceStr)
        this.targetStr = JSON.stringify(json, null, 4)
      } catch (e) {
        this.targetStr = '非法JSON字符串'
      }
    }
  }
}
</script>
