<template>
  <div>
    <Row type="flex" justify="center" align="top">
      <Col :xs="0" :sm="3"></Col>
      <Col :xs="24" :sm="18">
        <Row>
          <Col span="24"><h2>iBatis/MyBatis日志分析工具（一次分析一条完整数据）</h2></Col>
        </Row>
        <Row>
          <Col span="22" offset="1">
            <Input type="textarea" :rows="8" placeholder="source" v-model="sqlSourceStr"/>
          </Col>
        </Row>
        <Row>
          <Col span="22" offset="1">
            <Input type="textarea" :rows="12" placeholder="target" v-model="sqlResultStr"/>
          </Col>
        </Row>
        <Row>
          <Col span="4" offset="1">
            <Button type="primary" @click="convertSql">转换日志</Button>
          </Col>
          <Col span="4">
            <Button class="clip-btn" :data-clipboard-text="sqlResultStr">点我复制结果</Button>
          </Col>
        </Row>
      </Col>
      <Col :xs="0" :sm="3"></Col>
    </Row>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard'
export default {
  name: 'SqlLogFormat',
  data () {
    return {
      sqlSourceStr: '',
      sqlResultStr: ''
    }
  },
  methods: {
    convertSql: function () {
      var source = this.sqlSourceStr
      try {
        var sql = /.*Preparing.*:(.*)>?/.exec(source)[1].trim().replace(/\s+/g, ' ')
        var params = /Parameters.*:\s*\[(.*)]/.exec(source)[1]
        var paramsList = params.split(/,[\s]*/)
        for (var i = 0; i < paramsList.length; i++) {
          var param = paramsList[i]
          sql = sql.replace(/\?/, '\'' + param + '\'').replace(/limit.*'(\d+)',.*'(\d+)'/, 'limit $1, $2').replace(/>$/, '')
        }
        this.debug(sql)
        this.sqlResultStr = sql
      } catch (e) {
        this.debug(e)
        this.sqlResultStr = '请确认复制的内容包含完整的Preparing和Parameters信息'
      }
    }
  },
  mounted () {
    var clipboard = new ClipboardJS('.clip-btn')

    clipboard.on('success', function (e) {
      console.info('Action:', e.action)
      console.info('Text:', e.text)
      console.info('Trigger:', e.trigger)
      e.clearSelection()
    })
  }
}
</script>
