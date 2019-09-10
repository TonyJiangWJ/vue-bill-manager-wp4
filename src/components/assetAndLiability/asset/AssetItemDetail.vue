<template>
  <li>
    <div @click.stop="showLayer">
      <span>{{asset.name}}</span>&nbsp;
      <span :style="available?'color:green;':'color:red;'">￥{{asset.amount|longToString}}</span>
    </div>
    <Modal v-model="assetModal" title="资产详情" @on-ok="updateAssetInfo" :width="380">
      <Row type="flex" justify="center">
        <Col span="10">名称</Col>
        <Col span="10"><Input type="text" v-model="assetName" :maxlength="20"/></Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">金额</Col>
        <Col span="10"><Input v-model="assetAmount" type="text" @on-blur="checkAmount" placeholder="金额"/></Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">随时使用</Col>
        <Col span="10">
          <i-switch v-model="available">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </Col>
      </Row>
      <div slot="footer">
        <Button v-if="assetAmount == 0" type="dashed" @click="deleteAsset">删除</Button>
        <Button type="default" @click="assetModal=false">取消</Button>
        <Button type="primary" @click="updateAssetInfo">确定</Button>
      </div>
    </Modal>
  </li>
</template>

<script>
import API from '@/js/api.js'

export default {
  name: 'AssetItemDetail',
  props: {
    asset: {
      type: Object
    }
  },
  data () {
    return {
      assetModal: false,
      assetName: this.asset.name,
      assetAmount: (this.asset.amount / 100).toFixed(2),
      available: this.asset.available === 'Y'
    }
  },
  filters: {
    longToString: function (val) {
      return (val / 100).toFixed(2)
    }
  },
  methods: {
    showLayer: function () {
      this.assetModal = true
      this.assetAmount = (this.asset.amount / 100).toFixed(2)
      this.assetName = this.asset.name
      this.available = this.asset.available === 'Y'
    },
    updateAssetInfo: function () {
      let request = {
        version: this.asset.version,
        id: this.asset.id,
        name: this.assetName,
        amount: (this.assetAmount * 100).toFixed(0),
        available: this.available
      }
      API.updateAsset(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.debug('更新成功')
          this.assetModal = false
          this.$emit('reloadAssetInfo')
        }
      })
    },
    deleteAsset: function () {
      let self = this
      let config = {
        title: '提示',
        content: '是否确认删除该资产',
        onOk: function () {
          self.debug('删除当前资产' + self.asset.id)
          let request = {
            assetId: self.asset.id
          }
          API.deleteAsset(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              self.debug('删除成功')
              self.assetModal = false
              self.$emit('reloadAssetInfo')
            }
          })
        }
      }
      this.$Modal.confirm(config)
    },
    checkAmount: function () {
      this.assetAmount = this.checkNumic(this.assetAmount)
    }
  },
  created () {
    this.assetAmountInpt = this.assetAmount
    this.debug(this.available)
  }
}
</script>
