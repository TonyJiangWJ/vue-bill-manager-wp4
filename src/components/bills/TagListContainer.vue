<template>
  <div>
    <Tag v-for="(tag,index) in row.tags" type="border" :color="tagColors[index % tagColors.length]" :key="tag.tagId">{{tag}}</Tag>
  </div>
</template>

<script>
export default {
  props: {
    row: Object
  },
  data () {
    return {
      tagColors: ['primary', 'success', 'warning', 'magenta', 'volcano', 'orange', 'gold', 'yellow', 'lime', 'green', 'cyan', 'blue']
    }
  }
}
</script>
