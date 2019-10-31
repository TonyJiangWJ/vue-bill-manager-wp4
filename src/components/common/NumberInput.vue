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
      innerValue: ''
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