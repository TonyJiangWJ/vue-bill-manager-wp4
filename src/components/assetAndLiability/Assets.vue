<template>
  <div class="common-container">
    <Modal v-model="addAssetModal" title="添加资产信息" :width="380" @on-ok="doAddAsset">
      <Row type="flex" justify="center">
        <Col span="10">父类别</Col>
        <Col span="10">
        <Select v-model="addAssetParentType">
          <Option v-for="parentType in assetParentList" :value="parentType.id" :key="parentType.id">{{ parentType.typeDesc }}</Option>
        </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">子类别</Col>
        <Col span="10">
        <Select v-model="addAssetChildType">
          <Option v-for="childType in assetChildList" :value="childType.id" :key="childType.id">{{ childType.typeDesc }}</Option>
        </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">自定义名称</Col>
        <Col span="10"><Input v-model="addAssetExtName" type="text" placeholder="自定义名称" /></Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">金额</Col>
        <Col span="10"><Input v-model="addAssetAmount" type="text" @on-blur="checkAssetAmount" placeholder="金额" /></Col>
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
    </Modal>
    <Modal v-model="addLiabilityModal" title="添加分期账单" :width="380" @on-ok="doAddLiability">
      <Row type="flex" justify="center">
        <Col span="10">父类别</Col>
        <Col span="10">
          <Select v-model="liabilityParent">
            <Option v-for="parentType in liabilityParentList" :value="parentType.id" :key="parentType.id">{{ parentType.typeDesc }}</Option>
          </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">子类别</Col>
        <Col span="10">
          <Select v-model="liabilityChildType">
            <Option v-for="childType in liabilityChildList" :value="childType.id" :key="childType.id">{{ childType.typeDesc }}</Option>
          </Select>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">分期期数</Col>
        <Col span="10"><InputNumber v-model="installment" placeholder="分期期数" style="width:100%"/></Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">首期还款日</Col>
        <Col span="10"><DatePicker type="date" placeholder="首期还款日" v-model="repaymentDay" style="width:100%"/></Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">总金额</Col>
        <Col span="10"><Input v-model="liabilityAmount" type="text" @on-blur="checkLiabilityAmount" placeholder="总金额" /></Col>
      </Row>
    </Modal>
    <Divider orientation="left">概览</Divider>
    <Row type="flex" justify="center" align="top" :gutter="5">
      <Col :xs="24" :sm="12">
        <h2>
          <span style="margin-left: 5px;">总资产</span>
          <span style="color: green;">{{totalAsset|longToString}}</span>
          <Button size="small" type="default" @click="addAsset">添加资产</Button>
        </h2>
        <asset-item :assetModels="assetModels" @reloadAssetInfo="loadAssetInfo"/>
      </Col>
      <Col :xs="24" :sm="12">
        <h2>
          <span style="margin-left: 5px;">总负债</span>
          <span style="color: red;">￥{{totalLiability|longToString}}</span>
          <Button size="small" type="default" @click="addLiability">添加分期账单</Button>
        </h2>
        <liability-item :liabilityModels="liabilityModels" />
      </Col>
    </Row>
    <div>
      <div style="margin: 5px;">
        <h2>净资产 <span style="color: #ff0000;" :style="'color: '+(cleanAsset>0 ? '#008000' : '#ff0000')">{{cleanAsset|longToString}}</span></h2>
        <h2>现金流 <span style="color: #ff0000;" :style="'color: '+(availableAsset>0 ? '#008000' : '#ff0000')">{{availableAsset|longToString}}</span></h2>
      </div>
    </div>
    <div class="layui-col-md12 layui-col-xs12">
      <Divider orientation="left">分期还款
      </Divider>
      <Timeline>
        <liability-time-line-item
          v-for="monthLiabilityModel in monthLiabilityModels"
          :key="monthLiabilityModel.month"
          :month-liability-model="monthLiabilityModel"
          @reloadAssetInfo="loadAssetInfo">
        </liability-time-line-item>
      </TimeLine>
    </div>
  </div>
</template>

<script>
import AssetItemDetail from '@/components/assetAndLiability/asset/AssetItemDetail'
import AssetItem from '@/components/assetAndLiability/asset/AssetItem'
import LiabilityItem from '@/components/assetAndLiability/liability/LiabilityItem'
import LiabilityTimeLineItem from '@/components/assetAndLiability/liability/LiabilityTimeLineItem'
import API from '@/js/api.js'
export default {
  name: 'Assets',
  data () {
    return {
      collsapeAsset: false,
      addAssetParentType: '',
      addAssetChildType: '',
      addAssetAmount: null,
      addAssetExtName: '',
      available: true,
      liabilityParent: '',
      liabilityChildType: '',
      installment: null,
      repaymentDay: '',
      liabilityAmount: null,
      totalAsset: '',
      totalLiability: '',
      cleanAsset: '',
      availableAsset: '',
      monthLiability: {
        assetAfterThisMonth: ''
      },
      assetModels: [],
      liabilityModels: [],
      monthLiabilityModels: [],
      liabilityParentList: [],
      liabilityChildList: [],
      assetParentList: [],
      assetChildList: [],
      addAssetModal: false,
      addLiabilityModal: false
    }
  },
  filters: {
    longToString: function (val) {
      return (val / 100).toFixed(2)
    }
  },
  components: {
    AssetItem,
    AssetItemDetail,
    LiabilityItem,
    LiabilityTimeLineItem
  },
  methods: {
    addAsset: function () {
      this.addAssetModal = true
    },
    addLiability: function () {
      this.addLiabilityModal = true
    },
    resetAsset: function () {
      this.addAssetParentType = ''
      this.addAssetChildType = ''
      this.addAssetExtName = ''
      this.addAssetAmount = null
    },
    resetLiability: function () {
      this.liabilityParent = ''
      this.liabilityChildType = ''
      this.liabilityChildList = []
      this.liabilityAmount = null
      this.repaymentDay = ''
      this.installment = null
    },
    checkAssetAmount: function () {
      this.addAssetAmount = this.checkNumic(this.addAssetAmount)
    },
    checkLiabilityAmount: function () {
      this.liabilityAmount = this.checkNumic(this.liabilityAmount)
    },
    doAddAsset: function () {
      let request = {
        type: this.addAssetChildType,
        name: this.addAssetExtName,
        amount: (this.addAssetAmount * 100).toFixed(0),
        available: this.available
      }
      API.addAsset(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.loadAssetInfo()
          this.debug('添加成功')
          this.resetAsset()
        }
      })
    },
    doAddLiability: function () {
      let request = {
        type: this.liabilityChildType,
        repaymentDay: String(this.repaymentDay),
        amount: (this.liabilityAmount * 100).toFixed(0),
        installment: this.installment
      }
      API.addLiability(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.loadAssetInfo()
          this.debug('添加成功')
          this.resetLiability()
        }
      })
    },
    loadAssetInfo: function () {
      API.requestAssetManage().then(resp => {
        if (resp && resp.code === API.CODE_CONST.SUCCESS) {
          let assetManageDTO = resp.assetManage
          this.totalAsset = assetManageDTO.totalAsset
          this.cleanAsset = assetManageDTO.cleanAsset
          this.availableAsset = assetManageDTO.availableAsset
          this.totalLiability = assetManageDTO.totalLiability
          this.assetModels = assetManageDTO.assetModels
          this.liabilityModels = assetManageDTO.liabilityModels
          this.monthLiabilityModels = assetManageDTO.monthLiabilityModels
        }
      })
    }
  },
  watch: {
    liabilityParent: function () {
      this.liabilityChildType = ''
      API.getChildByParent({ id: this.liabilityParent }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.liabilityChildList = resp.assetTypes
        }
      })
    },
    addAssetParentType: function () {
      this.addAssetChildType = ''
      API.getChildByParent({ id: this.addAssetParentType }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.assetChildList = resp.assetTypes
        }
      })
    }
  },
  created () {
    this.loadAssetInfo()
    API.getLiabilityParents()
      .then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.liabilityParentList = resp.assetTypes
        }
      })
      .then(() => {
        API.getAssetParents().then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            this.assetParentList = resp.assetTypes
          }
        })
      })
    this.debug(this.availableAsset)
  }
}
</script>
