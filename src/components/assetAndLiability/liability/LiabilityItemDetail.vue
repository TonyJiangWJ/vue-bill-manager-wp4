<template>
  <li>
    <div>
      <span>{{liability.name}}</span>&nbsp;
        <span>￥{{(liability.amount/100).toFixed(2)}}</span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'LiabilityItemDetail',
  props: {
    liability: {
      type: Object
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
