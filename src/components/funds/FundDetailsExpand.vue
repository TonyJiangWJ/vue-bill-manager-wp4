<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-07-01 14:37:43
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-02 01:59:33
 * @Description: 
--> 
<template>
  <div>
    <Table stripe border :columns="detailFundsColumns" :data="detailFunds">
        <template slot-scope="{ row, index }" slot="fundName">
          <Input type="text" v-model="edit.fundName" v-if="editIndex === index" />
          <span v-else>{{ row.fundName }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="purchaseDate">
          <DatePicker type="date" v-model="edit.purchaseDate" style="width:100%" v-if="editIndex === index"/>
          <span v-else>{{ row.purchaseDate }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="purchaseConfirmDate">
          <DatePicker type="date" v-model="edit.purchaseConfirmDate" style="width:100%"  v-if="editIndex === index"/>
          <span v-else>{{ row.purchaseConfirmDate }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="fundPurchaseValue">
          <NumberInput :fixed="4" v-model="edit.fundPurchaseValue" v-if="editIndex === index" />
          <span v-else>{{ row.fundPurchaseValue }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="purchaseAmount">
          <NumberInput :fixed="2" v-model="edit.purchaseAmount" v-if="editIndex === index" />
          <span v-else>{{ row.purchaseAmount }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="purchaseCost">
          <NumberInput :fixed="2" v-model="edit.purchaseCost" v-if="editIndex === index" />
          <span v-else>{{ row.purchaseCost }}</span>
        </template>
      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <Button @click="handleSave(index)">保存</Button>
          <Button @click="editIndex = -1">取消</Button>
        </div>
        <div v-else>
          <Button size="small" @click="handleEdit(row, index)">修改</Button>
          <Button type="error" size="small" @click="remove(row)">删除</Button>
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
import API from '@/js/api.js'
import NumberInput from '@/components/common/NumberInput'
export default {
  name: 'FundDetailsExpand',
  components: {
    NumberInput
  },
  props: {
    detailFunds: {
      type: Array,
      default: () => []
    },
    fundCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editIndex: -1,
      edit: {
        id: null,
        fundCode: '',
        fundName: '',

      },
      detailFundsColumns: [
        {
          title: '基金名称',
          slot: 'fundName'
        },
        {
          title: '买入成本',
          slot: 'purchaseCost'
        },
        {
          title: '买入单位净值',
          slot: 'fundPurchaseValue'
        },
        {
          title: '买入份额',
          slot: 'purchaseAmount'
        },
        {
          title: '买入时间',
          slot: 'purchaseDate'
        },
        {
          title: '买入确认时间',
          slot: 'purchaseConfirmDate'
        },
        {
          title: '确认增长',
          key: 'confirmedIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.confirmedIncrease) >= 0 ? 'green' : 'red'
              },
              params.row.confirmedIncrease + '(' + params.row.confirmedIncreaseRate + '%)'
            )
          }
        },
        {
          title: '今日增长',
          key: 'todayIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.todayIncrease) >= 0 ? 'green' : 'red'
              },
              params.row.todayIncrease + '(' + params.row.todayIncreaseRate + '%)'
            )
          }
        },
        {
          title: '估算增长',
          key: 'assessmentIncrease',
          render: (h, params) => {
            return h(
              'span',
              {
                class: parseFloat(params.row.assessmentIncrease) >= 0 ? 'green' : 'red'
              },
              params.row.assessmentIncrease + '(' + params.row.assessmentIncreaseRate + '%)'
            )
          }
        },
        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ]
    }
  },
  methods: {
    handleSave: function (index) {
      this.$debug('save target: {}', index)
    },
    handleEdit: function (row, index) {
      this.$debug('save target: {} purchaseValue: {}', index, row.fundPurchaseValue)
    },
    remove: function(row) {
      this.$debug('delete row info:' + JSON.stringify(row))
      let that = this
      this.$Modal.confirm({
        title: '确定要删除：' + row.fundName + ' 吗？',
        onOk: function() {
          API.deleteFundInfo({ id: row.id }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.$Message.success('删除成功')
              that.$emit('reloadFunds')
            } else {
              this.$Message.error('删除失败 ' + resp.msg)
            }
          })
        }
      })
    }
  },
  mounted() {
    this.detailFundsColumns.map(column => {
      this.$set(column, 'minWidth', 150)
      this.$set(column, 'align', 'center')
    })
  }
}
</script>
