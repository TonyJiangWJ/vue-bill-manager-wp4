<template>
  <div>
    <my-table :columns="columns" :data="data" :rowspan-cfg="rowspanCfg" :height="700" />
  </div>
</template>

<script>
/* eslint-disable */
import MyTable from '@/components/my-table/my-table.vue'

export default {
  name: 'ExpandRow',
  components: { MyTable },
  data() {
    return {
      columns: [
        {
          key: 'rowspanKey',
          title: '可合并列'
        },
        {
          key: 'money',
          title: '金额'
        },
        {
          key: 'groupName',
          title: '组名'
        }
      ],
      data: [
        {
          rowspanKey: 'group1',
          money: 13,
          groupName: 'groupName1'
        },
        {
          rowspanKey: 'group1',
          money: 14,
          groupName: 'groupName-not display'
        },
        {
          rowspanKey: 'group1',
          money: 15,
          groupName: 'groupName-not display'
        },
        {
          rowspanKey: 'group2',
          money: 131,
          groupName: 'groupName2'
        },
        {
          rowspanKey: 'group2',
          money: 132,
          groupName: 'groupName-not display'
        },
        {
          rowspanKey: 'group3',
          money: 133,
          groupName: 'groupName3'
        },
        {
          rowspanKey: 'group3',
          money: 134,
          groupName: 'groupName1-not display'
        },
        {
          rowspanKey: 'group5',
          money: 135,
          groupName: 'groupName5'
        }
      ],
      rowspanCfg: [
        {
          key: 'rowspanKey'
          // 指定需要作为判断的列key 不指定则为本身
          // identifyKey: 'rowspanKey'
        },
        {
          key: 'groupName',
          // 指定需要作为判断的列key 不指定则为本身 这里指定rowspanKey 合并后的groupName不会显示 仅仅显示第一个
          identifyKey: 'rowspanKey'
        }
      ]
    }
  }
}
</script>
