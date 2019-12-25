<!--
 * @Author: TonyJiangWJ
 * @Date: 2019-08-15 16:52:56
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2019-12-25 17:02:22
 * @Description: 资产和负债信息页面
 -->
<template>
  <div class="common-container">
    <asset-adder v-model="addAssetModal" @reload-asset-info="loadAssetInfo"/>
    <liability-adder v-model="addLiabilityModal" @reload-asset-info="loadAssetInfo"/>
    <Divider orientation="left">概览</Divider>
    <Row type="flex" justify="center" align="top" :gutter="5">
      <i-col :xs="24" :sm="12">
        <h2>
          <span style="margin-left: 5px;">总资产</span>
          <span style="color: green;">{{totalAsset|longToString}}</span>
          <Button size="small" type="default" @click="addAsset" class="v-btn">添加资产</Button>
          <Button size="small" type="default" @click="jumpToAssetTypes" class="v-btn">管理资产类别</Button>
        </h2>
        <asset-item :assetModels="assetModels" @reloadAssetInfo="loadAssetInfo"/>
      </i-col>
      <i-col :xs="24" :sm="12">
        <h2>
          <span style="margin-left: 5px;">总负债</span>
          <span style="color: red;">￥{{totalLiability|longToString}}</span>
          <Button size="small" type="default" @click="addLiability" class="v-btn">添加分期账单</Button>
        </h2>
        <liability-item :liabilityModels="liabilityModels" />
      </i-col>
    </Row>
    <div>
      <div style="margin: 5px;">
        <h2>净资产 <span style="color: #ff0000;" :style="'color: '+(cleanAsset>0 ? '#008000' : '#ff0000')">{{cleanAsset|longToString}}</span></h2>
        <h2>现金流 <span style="color: #ff0000;" :style="'color: '+(availableAsset>0 ? '#008000' : '#ff0000')">{{availableAsset|longToString}}</span></h2>
      </div>
    </div>
    <div class="layui-col-md12 layui-col-xs12">
      <Divider orientation="left">分期还款</Divider>
      <Timeline>
        <liability-time-line-item
          v-for="monthLiabilityModel in monthLiabilityModels"
          :key="monthLiabilityModel.month"
          :month-liability-model="monthLiabilityModel"
          @reloadAssetInfo="loadAssetInfo" />
      </TimeLine>
    </div>
  </div>
</template>

<script>
import AssetAdder from '@/components/assetAndLiability/asset/AssetAdder'
import AssetItem from '@/components/assetAndLiability/asset/AssetItem'
import LiabilityItem from '@/components/assetAndLiability/liability/LiabilityItem'
import LiabilityTimeLineItem from '@/components/assetAndLiability/liability/LiabilityTimeLineItem'
import LiabilityAdder from '@/components/assetAndLiability/liability/LiabilityAdder'
import API from '@/js/api.js'
export default {
  name: 'Assets',
  data () {
    return {
      collsapeAsset: false,
      
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
    AssetAdder,
    LiabilityItem,
    LiabilityTimeLineItem,
    LiabilityAdder
  },
  methods: {
    jumpToAssetTypes: function () {
      this.$router.push('/asset/type')
    },
    addAsset: function () {
      this.addAssetModal = true
    },
    addLiability: function () {
      this.addLiabilityModal = true
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
  created () {
    this.loadAssetInfo()
    this.$debug(this.availableAsset)
  }
}
</script>