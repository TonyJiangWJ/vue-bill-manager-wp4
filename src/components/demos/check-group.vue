<template>
  <div>
    <div style="border-top: solid 1px;">
      <check-item
        @on-check-change="checkChange"
        :label="checkboxGroupItem.label"
        :checked="checkboxGroupItem.checked"/>
        <div><Button size="small" type="primary" @click="deleteItem">删除</Button><Button size="small" @click="addNew">新增</Button></div>
      <div v-if="groupChildren">
        <check-item v-for="innerGroupItem in groupChildren"
            class="item-trans"
            :key="innerGroupItem.label"
            @on-check-change="checkChange"
            :label="innerGroupItem.label" :checked="innerGroupItem.checked"/>
      </div>
    </div>
  </div>
</template>

<script>
import checkItem from './check-item'
export default {
  name: 'CheckGroup',
  components: { checkItem },
  props: {
    checkboxGroupItem: Object
  },
  data () {
    return {
      groupChildren: this.checkboxGroupItem.children
    }
  },
  methods: {
    checkChange: function (payload) {
      console.log('点击了 ' + payload.label + ', 结果：' + payload.checked)
      let item = this.groupChildren.filter((item) => item.label === payload.label)
      item[0].checked = payload.checked
      console.log(this.groupChildren)
    },
    addNew: function () {
      if (!this.groupChildren) {
        this.groupChildren = []
      }
      this.groupChildren.push({label: 'AAA' + Math.random().toFixed(3) * 1000, checked: false})
    },
    deleteItem: function () {
      this.groupChildren = this.groupChildren.filter((item) => item.checked === false)
    }
  }
}
</script>
<style scoped>
  .item-trans {
    transition: 1s 0.5s;
    animation: 1s rainbow;
  }

  @keyframes rainbow {
    0% { opacity: 0;}
    50% { opacity: 60; }
    100% { opacity: 100; }
  }
</style>
