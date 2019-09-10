<template>
  <div>
    <div style="float: left;display: inline;">
      <table>
        <tr>
          <th>code</th>
          <th>desc</th>
        </tr>
        <tr>
          <td colspan="2">负债</td>
        </tr>
        <tr v-for="parent in liabilityParentList" :key="parent.id" @click="showChild(parent.id)">
          <td>{{parent.typeCode}}</td>
          <td>{{parent.typeDesc}}</td>
        </tr>
        <tr>
          <td colspan="2">资产</td>
        </tr>
        <tr v-for="parent in assetParentList" :key="parent.id" @click="showChild(parent.id)">
          <td>{{parent.typeCode}}</td>
          <td>{{parent.typeDesc}}</td>
        </tr>
      </table>
    </div>
    <div style="float: left;display: inline;">
      <table>
        <tr>
          <th>code</th>
          <th>desc</th>
        </tr>
        <tr v-for="parent in childTypeList" :key="parent.id">
          <td>{{parent.typeCode}}</td>
          <td>{{parent.typeDesc}}</td>
        </tr>
      </table>
    </div>
    <div>
      <div>
        <label>类型:{{typeIdentify}}</label>
        <select v-model="typeIdentify">
          <option value="A">资产</option>
          <option value="L">负债</option>
        </select>
      </div>
      <div>
        <label>父类型:{{parentCode}}</label>
        <select v-model="parentCode">
          <option value=""></option>
          <template v-if="typeIdentify==='A'">
          <option v-for="parent in assetParentList" :key="parent.id" :value="parent.typeCode">{{parent.typeDesc}}</option>
          </template>
          <template v-else>
          <option v-for="parent in liabilityParentList" :key="parent.id" :value="parent.typeCode">{{parent.typeDesc}}</option>
          </template>
        </select>
      </div>
      <div>
        <label>类型代码{{typeCode}}</label>
        <input v-model="typeCode" type="text">
      </div>
      <div>
        <label>类型描述{{typeDesc}}</label>
        <input v-model="typeDesc" type="text">
      </div>
      <div><button @click="save">保存</button></div>
    </div>
  </div>
</template>

<script>
import API from '@/js/api'
export default {
  name: 'AssetTypes',
  data () {
    return {
      liabilityParentList: [],
      assetParentList: [],
      childTypeList: [],
      parentCode: '',
      typeCode: '',
      typeDesc: '',
      typeIdentify: 'A'
    }
  },
  methods: {
    save: function () {
      let data = {
        typeCode: this.typeCode,
        typeDesc: this.typeDesc,
        typeIdentify: this.typeIdentify,
        parentCode: this.parentCode
      }
      console.log(JSON.stringify(data))
      API.addAssetType(data).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          alert('添加成功')
          this.loadParents()
        } else {
          alert(resp.msg)
        }
      })
    },
    loadParents: function () {
      API.getLiabilityParents().then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.liabilityParentList = resp.assetTypes
        }
      }).then(() => {
        API.getAssetParents().then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            this.assetParentList = resp.assetTypes
          }
        })
      })
    },
    deleteType: function (typeId) {
      let data = {
        id: typeId
      }
      this.debug('request:' + JSON.stringify(data))
    },
    showChild: function (typeId) {
      let data = {
        id: typeId
      }
      API.getChildByParent(data).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.childTypeList = resp.assetTypes
        }
      })
    }
  },
  mounted () {
    this.loadParents()
  },
  watch: {
    typeIdentify: function () {
      this.parentCode = ''
    }
  }
}
</script>
