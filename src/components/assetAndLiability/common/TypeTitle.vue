<template>
  <span>{{type}} ¥{{total|totalStr}}</span>
</template>

<script>
export default {
  name: 'TypeTitle',
  props: {
    type: {
      type: String
    },
    total: {
      type: Number
    }
  },
  filters: {
    totalStr: function (val) {
      return typeof val === 'number' ? (val / 100).toFixed(2) : ''
    }
  }
}
</script>
