<!--
 * @Author: TonyJiangWJ
 * @Date: 2018-11-11 22:12:50
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2019-12-08 14:25:38
 * @Description: 
 -->
<template>
  <div>
    <Row type="flex" justify="start">
      <Col span="8">
        <Button>添加</Button>
      </Col>
    </Row>
    <Row>
      <Col span="8" offset="4">
        <Tree :data="treeData" :load-data="loadChild" class="t-left"/>
      </Col>
    </Row>
  </div>
</template>

<script>
import API from '@/js/api'
export default {
  name: 'AssetTypes',
  data() {
    return {
      treeData: [
        {
          title: '资产',
          loading: false,
          children: []
        },
        {
          title: '负债',
          loading: false,
          children: []
        }
      ],
      parentCode: '',
      typeCode: '',
      typeDesc: '',
      typeIdentify: 'A'
    }
  },
  methods: {
    save: function() {
      let data = {
        typeCode: this.typeCode,
        typeDesc: this.typeDesc,
        typeIdentify: this.typeIdentify,
        parentCode: this.parentCode
      }
      this.$debug(JSON.stringify(data))
      API.addAssetType(data).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          alert('添加成功')
          this.loadParents()
        } else {
          alert(resp.msg)
        }
      })
    },
    convertToTreeNode: function(assetTypes, hasChild) {
      if (assetTypes && assetTypes.length > 0) {
        return assetTypes.map(r => {
          let node = {
            typeCode: r.typeCode,
            title: r.typeDesc,
            id: r.id
          }
          if (hasChild) {
            node.loading = false
            node.children = []
          }
          return node
        })
      } else {
        return []
      }
    },
    deleteType: function(typeId) {
      let data = {
        id: typeId
      }
      this.$debug('request:' + JSON.stringify(data))
    },
    loadChild: function(item, callback) {
      console.log('点击了：' + JSON.stringify(item))
      if (item.id) {
        API.getChildByParent({
          id: item.id
        }).then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            callback(this.convertToTreeNode(resp.assetTypes))
          }
        })
      } else if (item.title === '资产') {
        API.getLiabilityParents().then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            callback(this.convertToTreeNode(resp.assetTypes, true))
          }
        })
      } else if (item.title === '负债') {
        API.getAssetParents().then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            callback(this.convertToTreeNode(resp.assetTypes, true))
          }
        })
      }
    }
  },
  mounted() {
    // this.loadParents()
  },
  watch: {
    typeIdentify: function() {
      this.parentCode = ''
    }
  }
}
</script>

<style scoped>
.t-left {
  text-align: left;
}
</style>