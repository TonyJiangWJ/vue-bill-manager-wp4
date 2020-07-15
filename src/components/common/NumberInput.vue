<!--
 * @Author: TonyJiangWJ
 * @Date: 2019-10-24 16:57:17
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-15 18:55:06
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
      type: [String, Number]
    },
    placeholder: {
      type: String
    },
    fixed: {
      type: Number,
      default: 2
    },
    formatter: {
      type: Function,
      default: val => val
    },
    parser: {
      type: Function,
      default: val => val
    }
  },
  data() {
    return {
      innerValue: this.value
    }
  },
  watch: {
    value: function (newVal) {
      this.innerValue = this.formatter(newVal)
    }
  },
  methods: {
    checkAmount: function () {
      let tempVal = this.parser(this.innerValue)
      tempVal = this.$checkNumic(tempVal, this.fixed)
      this.$emit('update-value', tempVal)
      this.innerValue = this.formatter(tempVal)
    }
  },
}
</script>