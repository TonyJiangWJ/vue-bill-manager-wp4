<template>
  <Collapse v-model="collapseAsset">
    <Panel v-for="assetModel in assetModels"
      :key="assetModel.type"
      :name="assetModel.type">
      <type-title :type="assetModel.type" :total="assetModel.total"/>
      <div slot="content">
        <ul class="asset-detail">
          <asset-item-detail @reloadAssetInfo="reloadAssetInfo" v-for="asset in assetModel.assetList" :key="asset.id" :asset="asset"/>
        </ul>
      </div>
    </Panel>
  </Collapse>
</template>

<script>
import AssetItemDetail from '@/components/assetAndLiability/asset/AssetItemDetail'
import TypeTitle from '@/components/assetAndLiability/common/TypeTitle'

export default {
  name: 'AssetItem',
  props: {
    assetModels: {
      type: Array
    }
  },
  components: {
    AssetItemDetail,
    TypeTitle
  },
  data () {
    return {
      collapseAsset: '',
      show: false
    }
  },
  computed: {

  },
  methods: {
    reloadAssetInfo: function (payload) {
      this.$emit('reloadAssetInfo', payload)
    },
    toggleShow: function () {
      this.show = !this.show
    }
  }
}
</script>

<style scoped>
.asset-detail {
  padding: 5px;
}
.asset-detail > li {
  list-style-type: disc;
}
</style>
