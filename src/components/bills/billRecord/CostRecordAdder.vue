<template>
  <Modal v-model="innerShowAddModal" title="添加账单信息" :width="380">
      <Form ref="newRecord" :model="newRecord" label-position="right" :label-width="100" :rules="ruleValidate">
        <FormItem label="交易时间:" prop="createTime">
          <DatePicker type="datetime" v-model="newRecord.createTime" clearable />
        </FormItem>
        <FormItem label="交易地点:" prop="location">
          <Input type="text" v-model="newRecord.location" />
        </FormItem>
        <FormItem label="金额:" prop="money">
          <NumberInput v-model="newRecord.money" placeholder="请输入金额，可以自动进行简单的运算" />
        </FormItem>
        <FormItem label="交易对方:" prop="target">
          <Input type="text" v-model="newRecord.target" />
        </FormItem>
        <FormItem label="备注:" prop="memo">
          <Input type="text" v-model="newRecord.memo" />
        </FormItem>
        <FormItem label="交易类型:" prop="orderType">
          <Input type="text" v-model="newRecord.orderType" />
        </FormItem>
        <FormItem label="收入/支出:" prop="inOutType">
          <Select v-model="newRecord.inOutType">
            <Option value="支出">支出</Option>
            <Option value="收入">收入</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="hideModal">取消</Button>
        <Button type="primary" @click="doAddCostRecord">确定</Button>
      </div>
    </Modal>
</template>

<script>

import API from '@/js/api.js'
import NumberInput from '@/components/common/NumberInput.vue'

export default {
  name: "CostRecordAdder",
  components: {
    NumberInput
  },
  model: {
    prop: 'showAddModal',
    event: 'change'
  },
  props: {
    showAddModal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      innerShowAddModal: this.showAddModal,
      newRecord: {},
      ruleValidate: {
        createTime: {
          required: true,
          message: '交易创建时间不能为空'
        },
        money: {
          required: true,
          message: '金额不能为空'
        },
        target: {
          required: true,
          message: '交易对方不能为空'
        },
        inOutType: {
          required: true,
          message: '收支类型不能为空'
        }
      },
      costRecordColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '创建时间',
          sortable: 'custom',
          key: 'createTime',
          minWidth: 150
        },
        {
          title: '金额',
          sortable: 'custom',
          key: 'money',
          minWidth: 80
        },
        {
          title: '商品名称',
          key: 'goodsName',
          minWidth: 150
        },
        {
          title: '收支类型',
          key: 'inOutType',
          minWidth: 110,
          align: 'center',
          filters: [
            {
              label: '收入',
              value: '收入'
            },
            {
              label: '支出',
              value: '支出'
            }
          ],
          filteredValue: ['支出'],
          filterMultiple: false,
          filterRemote: function (value) {
            this.inOutType = value[0]
            this.pageNo = 0
            this.query()
          }
        },
        {
          title: '是否删除',
          key: 'isDeleted',
          minWidth: 110,
          align: 'center',
          filters: [
            {
              label: '已删除',
              value: 1
            },
            {
              label: '未删除',
              value: 0
            }
          ],
          filteredValue: [0],
          filterMultiple: false,
          filterRemote: function (value) {
            this.isDeleted = value[0]
            this.pageNo = 0
            this.query()
          }
        },
        {
          title: '是否显示',
          key: 'isHidden',
          minWidth: 110,
          align: 'center',
          filters: [
            {
              label: '显示',
              value: 0
            },
            {
              label: '隐藏',
              value: 1
            }
          ],
          filteredValue: [0],
          filterMultiple: false,
          filterRemote: function (value) {
            this.isHidden = value[0]
            this.pageNo = 0
            this.query()
          }
        },
        {
          title: '交易对方',
          key: 'target',
          minWidth: 150
        },
        {
          title: '交易类型',
          key: 'orderType',
          minWidth: 150
        },
        {
          title: '地点',
          key: 'location',
          minWidth: 150
        }
      ]
    }
  },
  watch: {
    showAddModal: function (n) {
      this.innerShowAddModal = n
    },
    innerShowAddModal: function (n) {
      this.$emit('change', n)
    }
  },
  methods: {
    hideModal: function () {
      this.$emit('hide-modal')
    },
    doAddCostRecord: function () {
      this.$debug('data:' + JSON.stringify(this.newRecord))
      this.$refs['newRecord'].validate(valid => {
        if (valid) {
          let request = {
            createTime: this.dateFormat(this.newRecord.createTime, 'yyyy-MM-dd HH:mm:ss'),
            inOutType: this.newRecord.inOutType,
            money: this.newRecord.money,
            target: this.newRecord.target,
            location: this.newRecord.location,
            memo: this.newRecord.memo,
            orderType: this.newRecord.orderType,
            goodsName: this.newRecord.goodsName
          }
          API.addRecord(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.hideModal()
              this.$Message.success('添加成功')
              this.$emit('requery-list')
              this.newRecord = {}
              this.innerShowAddModal = false
            }
          })
        } else {
          this.$Message.error('请检查输入是否正确')
        }
      })
    }
  }
}
</script>