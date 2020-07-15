<!--
 * @Author: TonyJiangWJ
 * @Date: 2019-12-25 15:18:24
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-15 19:09:50
 * @Description: 添加资产信息弹出框组件
 -->
<template>
  <Modal v-model="showAdderModal" title="添加资产信息" :width="380" @on-ok="doAddAsset">
    <Row type="flex" justify="center">
      <i-col span="10">父类别</i-col>
      <i-col span="10">
        <Select v-model="addAssetParentType">
          <Option v-for="parentType in assetParentList" :value="parentType.id" :key="parentType.id">{{ parentType.typeDesc }}</Option>
        </Select>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">子类别</i-col>
      <i-col span="10">
        <Select v-model="addAssetChildType">
          <Option v-for="childType in assetChildList" :value="childType.id" :key="childType.id">{{ childType.typeDesc }}</Option>
        </Select>
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">自定义名称</i-col>
      <i-col span="10">
        <Input v-model="addAssetExtName" type="text" placeholder="自定义名称" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">金额</i-col>
      <i-col span="10">
        <NumberInput v-model="addAssetAmount" placeholder="金额" />
      </i-col>
    </Row>
    <Row type="flex" justify="center">
      <i-col span="10">随时使用</i-col>
      <i-col span="10">
        <i-switch v-model="available">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </i-col>
    </Row>
  </Modal>
</template>

<script>
import API from '@/js/api.js'
export default {
  name: 'AssetAdder',
  model: {
    prop: 'value',
    event: 'toggle-show'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showAdderModal: this.value,
      addAssetParentType: '',
      addAssetChildType: '',
      addAssetAmount: null,
      addAssetExtName: '',
      available: true,

      assetParentList: [],
      assetChildList: []
    }
  },
  watch: {
    showAdderModal: function(newVal) {
      this.$emit('toggle-show', newVal)
    },
    addAssetParentType: function() {
      this.addAssetChildType = ''
      API.getChildByParent({ id: this.addAssetParentType }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.assetChildList = resp.assetTypes
        }
      })
    },
    value: function (newVal) {
      this.showAdderModal = newVal
    }
  },
  methods: {
    resetAsset: function() {
      this.addAssetParentType = ''
      this.addAssetChildType = ''
      this.addAssetExtName = ''
      this.addAssetAmount = null
    },
    doAddAsset: function() {
      let request = {
        type: this.addAssetChildType,
        name: this.addAssetExtName,
        amount: (this.addAssetAmount * 100).toFixed(0),
        available: this.available
      }
      API.addAsset(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.$emit('reload-asset-info')
          this.$debug('添加成功')
          this.resetAsset()
        }
      })
    }
  },
  mounted() {
    API.getAssetParents().then(resp => {
      if (resp.code === API.CODE_CONST.SUCCESS) {
        this.assetParentList = resp.assetTypes
      }
    })
  }
}
</script>