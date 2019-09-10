<template>
  <Row>
    <Col span="12">
      {{label}}
    </Col>
    <Col span="12">
      <Checkbox v-model="innerChecked" @on-change="onCheckChange"/>
    </Col>
  </Row>
</template>

<script>
export default {
  name: 'CheckItem',
  props: {
    checked: Boolean,
    label: String
  },
  data () {
    return { innerChecked: this.checked }
  },
  methods: {
    onCheckChange: function () {
      let payload = {
        label: this.label,
        checked: this.innerChecked
      }
      this.$emit('on-check-change', payload)
    }
  }
}
</script>
