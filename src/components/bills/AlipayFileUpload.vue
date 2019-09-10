<template>
  <div class="common-container">
    <Row>
      <Col>
        <Upload  :before-upload="handleUpload" action="none">
          <Button icon="ios-cloud-upload-outline">选择文件</Button>
        </Upload>
        <div v-if="file != null">
          <div>支付宝账单文件： {{file.name}}</div>
          <Button type="success" ghost @click="doUpload" :loading="loadingStatus">{{loadingStatus? 'uploading' : '上传'}}</Button>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import API from '@/js/api.js'

export default {
  name: 'AlipayFileUpload',
  data () {
    return {
      file: null,
      loadingStatus: false
    }
  },
  methods: {
    handleUpload: function (file) {
      let fileName = file.name
      let check = /.*(\.zip|\.csv)$/
      if (check.test(fileName)) {
        this.file = file
      } else {
        this.$Message.error('文件格式不正确')
      }
      return false
    },
    doUpload: function () {
      API.alipayUpload(this.file).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          let self = this
          this.$Modal.confirm({
            title: '上传成功，是否跳转到账单列表？',
            onOk: function () {
              self.$router.push('/bill/record/list')
            }
          })
        } else {
          this.$Message.error('上传失败')
        }
      })
    }
  }
}
</script>
