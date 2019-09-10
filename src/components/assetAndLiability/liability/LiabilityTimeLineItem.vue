<template>
  <TimelineItem>
    <div>
        <h3 @click.stop="toggleShowDetail">
            <span>{{monthLiabilityModel.month}}</span>&nbsp;
            <span>￥{{monthLiabilityModel.remain|longToString}}</span>
            <span :style="{ color: monthLiabilityModel.assetAfterThisMonth>0 ? '#008000' : '#ff0000' }">￥{{monthLiabilityModel.assetAfterThisMonth|longToString}}</span>
        </h3>
        <transition name="fade">
          <Collapse v-if="show">
            <Panel v-for="liabilityModel in monthLiabilityModel.liabilityModels"
              :key="liabilityModel.type+monthLiabilityModel.month">
              <type-title :type="liabilityModel.type" :total="liabilityModel.remain"/>
              <div slot="content">
                <ul class="liability-detail">
                  <time-line-item-detail v-for="liability in liabilityModel.liabilityList"
                    :key="liability.name+liability.amount"
                    :liability="liability"
                    @reloadAssetInfo="reloadAssetInfo">
                  </time-line-item-detail>
                </ul>
              </div>
            </Panel>
          </Collapse>
        </transition>
    </div>
  </TimelineItem>
</template>

<script>
import TimeLineItemDetail from '@/components/assetAndLiability/liability/TimeLineItemDetail'
import TypeTitle from '@/components/assetAndLiability/common/TypeTitle'

export default {
  name: 'LiabilityTimeLineItem',
  components: {
    TimeLineItemDetail,
    TypeTitle
  },
  props: {
    monthLiabilityModel: {}
  },
  data () {
    return {
      show: false
    }
  },
  filters: {
    longToString: function (val) {
      return (val / 100).toFixed(2)
    }
  },
  methods: {
    toggleShowDetail: function () {
      this.show = !this.show
    },
    reloadAssetInfo: function (payload) {
      this.$emit('reloadAssetInfo', payload)
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.liability-detail {
  padding: 5px;
}
.liability-detail > li {
  list-style-type: disc;
}
</style>
