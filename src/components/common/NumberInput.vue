<!--
 * @Author: TonyJiangWJ
 * @Date: 2019-10-24 16:57:17
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2019-12-25 16:48:02
 * @Description: 
 -->
<template>
  <Input type="text" @on-blur="checkAmount" v-model="innerValue" :placeholder="placeholder" />
</template>

<script>
export default {
  name: 'NumberInput',
  model: {
    prop: 'value',
    event: 'update-value'
  },
  props: {
    value: {
      type: String
    },
    placeholder: {
      type: String
    }
  },
  data() {
    return {
      innerValue: this.value
    }
  },
  watch: {
    value: function (newVal) {
      this.innerValue = newVal
    }
  },
  methods: {
    checkAmount: function () {
      this.innerValue = this.$checkNumic(this.innerValue)
      this.$emit('update-value', this.innerValue)
    }
  },
}
</script>