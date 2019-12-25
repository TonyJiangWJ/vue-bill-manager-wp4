<!--
 * @Author: TonyJiangWJ
 * @Date: 2018-12-06 14:34:56
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2019-12-25 14:52:47
 * @Description: 
 -->
<template>
  <div>
    <Row>
      <i-col span="24">
        <h2>JSON格式化校验工具</h2>
      </i-col>
    </Row>
    <Row>
      <i-col span="22" offset="1">
        <Input type="textarea" :rows="8" v-model="sourceStr" placeholder="source" />
      </i-col>
    </Row>
    <Row>
      <i-col span="22" offset="1">
        <Input type="textarea" :rows="12" v-model="targetStr" placeholder="target" />
      </i-col>
    </Row>
    <Row>
      <i-col span="22" offset="1">
        <Button type="primary" @click="checkJson">格式化校验</Button>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'JsonFormat',
  data() {
    return {
      sourceStr: '',
      targetStr: ''
    }
  },
  methods: {
    checkJson: function() {
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
