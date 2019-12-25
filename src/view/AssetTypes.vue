<!--
 * @Author: TonyJiangWJ
 * @Date: 2018-11-11 22:12:50
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2019-12-25 15:05:49
 * @Description: 
 -->
<template>
  <div class="common-container">
    <Row type="flex" justify="start">
      <i-col span="8">
        <Button @click="addType">添加</Button>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8" offset="4">
        <Tree :data="treeData" :load-data="loadChild" class="t-left" />
      </i-col>
    </Row>
    <Modal v-model="showAddType" title="添加类型" :width="380">
      <Form ref="newTypeForm" :model="newType" label-position="right" :label-width="100" :rules="ruleValidate">
        <FormItem label="类型" prop="typeIdentify">
          <Select v-model="newType.typeIdentify">
            <Option value="A">资产</Option>
            <Option value="L">负债</Option>
          </Select>
        </FormItem>
        <FormItem label="父类型" prop="parentCode">
          <Select v-model="newType.parentCode">
            <Option v-for="parentType in parentTypes" :key="parentType.typeCode" :value="parentType.typeCode">{{parentType.typeDesc}}</Option>
          </Select>
        </FormItem>
        <FormItem label="类型编码" prop="typeCode">
          <Tooltip content="编码已存在" placement="right" :disabled="passed" :always="!passed" style="width: 100%;">
            <Input v-model="newType.typeCode" @on-blur="checkTypeCode" />
          </Tooltip>
        </FormItem>
        <FormItem label="类型名称" prop="typeDesc">
          <Input v-model="newType.typeDesc" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="hideModal">取消</Button>
        <Button type="primary" @click="doAddType">确定</Button>
      </div>
    </Modal>
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
      newType: {
        parentCode: '',
        typeCode: '',
        typeDesc: '',
        typeIdentify: 'A'
      },
      passed: true,
      showAddType: false,
      parentTypes: [],
      ruleValidate: {
        typeCode: {
          required: true,
          message: '类型编码不能为空'
        },
        typeDesc: {
          required: true,
          message: '类型名称不能为空'
        },
        typeIdentify: {
          required: true,
          message: '主类型不能为空'
        }
      }
    }
  },
  methods: {
    addType: function() {
      this.showAddType = true
    },
    hideModal: function() {
      this.showAddType = false
    },
    checkTypeCode: function() {
      API.assetTypeCheck(this.newType.typeCode).then(resp => {
        if (resp.code !== API.CODE_CONST.SUCCESS) {
          this.passed = false
        } else {
          this.passed = true
        }
      })
    },
    doAddType: function() {
      if (!this.passed) {
        return
      }
      this.$refs['newTypeForm'].validate(valid => {
        if (valid) {
          let data = {
            typeCode: this.newType.typeCode,
            typeDesc: this.newType.typeDesc,
            typeIdentify: this.newType.typeIdentify,
            parentCode: this.newType.parentCode
          }
          this.$debug(JSON.stringify(data))
          API.addAssetType(data).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              alert('添加成功')
              this.refresh()
              this.newType = {
                typeIdentify: 'A'
              }
              this.showAddType = false
            } else {
              alert(resp.msg)
            }
          })
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
    refresh: function() {
      API.getAssetParents().then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.parentTypes = resp.assetTypes
        }
      })
      this.treeData = [
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
      ]
    },
    loadChild: function(item, callback) {
      this.$log('点击了：' + JSON.stringify(item))
      if (item.id) {
        API.getChildByParent({
          id: item.id
        }).then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            callback(this.convertToTreeNode(resp.assetTypes))
          }
        })
      } else if (item.title === '负债') {
        API.getLiabilityParents().then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            callback(this.convertToTreeNode(resp.assetTypes, true))
          }
        })
      } else if (item.title === '资产') {
        API.getAssetParents().then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            callback(this.convertToTreeNode(resp.assetTypes, true))
          }
        })
      }
    }
  },
  mounted() {
    this.refresh()
  },
  computed: {
    typeIdentify: function() {
      return this.newType.typeIdentify
    }
  },
  watch: {
    typeIdentify: function(newVal, o) {
      if (newVal === 'L') {
        API.getLiabilityParents().then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            this.parentTypes = resp.assetTypes
          }
        })
      } else if (newVal === 'A') {
        API.getAssetParents().then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            this.parentTypes = resp.assetTypes
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.t-left {
  text-align: left;
}
</style>