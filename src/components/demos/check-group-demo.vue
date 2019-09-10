<template>
  <Row type="flex" justify="center">
    <Col span="6">
    <check-group v-for="checkboxGroupItem in checkboxGroupList"
      :key="checkboxGroupItem.label"
      :checkbox-group-item="checkboxGroupItem"/>
    </Col>
  </Row>
</template>

<script>

import checkGroup from './check-group.vue'

export default {
  name: 'CheckGroupDemo',
  components: { checkGroup },
  data () {
    return {
      checkboxGroupList: [
        {
          label: '水果',
          checked: false,
          children: [
            {
              label: '苹果',
              checked: true
            },
            {
              label: '李子',
              checked: false
            },
            {
              label: '香蕉',
              checked: false
            }
          ]
        },
        {
          label: '零食'
        }
      ]
    }
  },
  methods: {
    checkChange: function () {

    }
  }
}
</script>
