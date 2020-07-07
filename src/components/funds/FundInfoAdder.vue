<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-06-29 22:01:55
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-08 01:57:04
 * @Description: 
--> 

<template>
  <Modal v-model="innerShowAdderModal" title="添加基金信息" :width="400" @on-ok="doAddFundInfo">
    <Form ref="newRecord" :model="fundInfo" label-position="right" :label-width="120" :rules="ruleValidate">
      <FormItem label="基金代码" prop="fundCode">
        <Input v-model="fundInfo.fundCode" type="text" placeholder="基金代码" />
      </FormItem>
      <FormItem label="基金名称" prop="fundName">
        <Input v-model="fundInfo.fundName" type="text" placeholder="基金名称" />
      </FormItem>
      <FormItem label="买入单位净值" prop="purchaseValue">
        <NumberInput v-model="fundInfo.purchaseValue" placeholder="买入单位净值" :fixed="4" />
      </FormItem>
      <FormItem label="买入确认份额" prop="purchaseAmount">
        <NumberInput v-model="fundInfo.purchaseAmount" placeholder="买入确认份额" :fixed="2" />
      </FormItem>
      <FormItem label="买入总支出" prop="purchaseCost">
        <NumberInput v-model="fundInfo.purchaseCost" placeholder="买入总支出" />
      </FormItem>
      <FormItem label="买入手续费" prop="purchaseFee">
        <NumberInput v-model="fundInfo.purchaseFee" placeholder="买入手续费" />
      </FormItem>
      <FormItem label="买入日期" prop="purchaseDate">
        <DatePicker type="date" placeholder="买入日期" v-model="fundInfo.purchaseDate" style="width:100%" />
      </FormItem>
      <FormItem label="买入确认日期" prop="purchaseConfirmDate">
        <DatePicker type="date" placeholder="买入确认日期" v-model="fundInfo.purchaseConfirmDate" style="width:100%" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import API from '@/js/api.js'
import NumberInput from '@/components/common/NumberInput'
export default {
  name: 'FundInfoAdder',
  components: {
    NumberInput
  },
  model: {
    value: 'value',
    event: 'toggle-show'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fundInfo: {
        fundCode: '',
        fundName: '',
        purchaseValue: '',
        purchaseAmount: '',
        purchaseCost: '',
        purchaseFee: '',
        purchaseDate: '',
        purchaseConfirmDate: ''
      },
      ruleValidate: {
        fundCode: {
          required: true
        },
        fundName: {
          required: true
        },
        purchaseValue: {
          required: true
        },
        purchaseAmount: {
          required: true
        },
        purchaseCost: {
          required: true
        },
        purchaseFee: {
          required: true
        },
        purchaseDate: {
          required: true
        },
        purchaseConfirmDate: {
          required: true
        }
      },
      innerShowAdderModal: this.value
    }
  },
  watch: {
    innerShowAdderModal: function(newVal) {
      this.$emit('toggle-show', newVal)
    },
    value: function(newVal) {
      this.innerShowAdderModal = newVal
    },
    fundCode: function(newVal) {
      if (newVal.length >= 6) {
        API.queryFundInfo({ fundCode: newVal }).then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            this.fundInfo.fundName = resp.fundName
          }
        })
      }
    }
  },
  computed: {
    fundCode: function () {
      return this.fundInfo.fundCode
    }
  },
  methods: {
    doAddFundInfo: function() {
      this.$refs['newRecord'].validate(valid => {
        if (valid) {
          this.fundInfo.purchaseDate = this.dateFormat(this.fundInfo.purchaseDate, 'yyyy-MM-dd')
          this.fundInfo.purchaseConfirmDate = this.dateFormat(this.fundInfo.purchaseConfirmDate, 'yyyy-MM-dd')
          // TODO 校验是否已经存在
          API.addFundInfo(this.fundInfo).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.$emit('reload-funds')
              this.$Message.success('添加成功')
              this.fundInfo.purchaseValue = ''
              this.fundInfo.purchaseAmount = ''
              this.fundInfo.purchaseCost = ''
              this.fundInfo.purchaseFee = ''
              this.fundInfo.purchaseDate = ''
              this.fundInfo.purchaseConfirmDate = ''
            } else {
              this.$Message.success('添加失败 ' + resp.msg)
            }
          })
        }
      })
    }
  }
}
</script>