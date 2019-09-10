<template>
  <Collapse v-model="collapseLiability">
    <Panel v-for="liabilityModel in liabilityModels" :key="liabilityModel.type" :name="liabilityModel.type">
      <type-title :type="liabilityModel.type" :total="liabilityModel.total"/>
      <div slot="content" v-for="liability in liabilityModel.liabilityList" :key="liability.id">
        <ul class="liability-detail">
          <liability-item-detail :liability="liability"/>
        </ul>
      </div>
    </Panel>
  </Collapse>
</template>

<script>
import TypeTitle from '@/components/assetAndLiability/common/TypeTitle'
import LiabilityItemDetail from '@/components/assetAndLiability/liability/LiabilityItemDetail'

export default {
  name: 'LiabilityItem',
  props: {
    liabilityModels: {
      type: Array
    }
  },
  components: {
    TypeTitle, LiabilityItemDetail
  },
  data () {
    return {
      show: false,
      collapseLiability: ''
    }
  },
  filters: {
    longToString: function (val) {
      return (val / 100).toFixed(2)
    }
  },
  methods: {
    toggleShow: function () {
      this.show = !this.show
    }
  }
}
</script>
<style scoped>
.liability-detail {
  padding: 5px;
}
.liability-detail > li {
  list-style-type: disc;
}
</style>
