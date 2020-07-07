<!--
 * @Author: TonyJiangWJ
 * @Date: 2020-07-01 11:08:10
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-07-08 03:43:33
 * @Description: 
--> 
<template>
  <div>
    <Row v-if="editFundList && editFundList.length > 0">
      <i-col :md="6" :xs="8">
        <Button size="small" type="success" @click="checkAllFundsStatus">校验是否存在</Button>
      </i-col>
      <i-col :md="6" :xs="8">
        <Button size="small" type="error" @click="removeExistFunds">移除已存在的</Button>
      </i-col>
      <i-col :md="6" :xs="8">
        <Button size="small" type="primary" @click="checkAndSaveFunds">保存基金信息</Button>
      </i-col>
    </Row>
    <Row>
      <i-col>
        <Input v-model="importFundJsonStr" type="textarea" :autosize="false" :rows="5" />
      </i-col>
    </Row>
    <Row v-if="importFundJsonStr">
      <i-col :md="6" :xs="8">
        <Button size="small" class="v-btn" @click="reflushStr">重新转换字符串</Button>
      </i-col>
    </Row>
    <Row>
      <Table stripe border :columns="importFundColumns" :data="editFundList">
        <template slot-scope="{ row, index }" slot="fundCode">
          <Input type="text" v-model="edit.fundCode" v-if="editIndex === index" />
          <span v-else :class="row.exist ? 'fund-exists' : ''">{{ row.fundCode }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="fundName">
          <Input type="text" v-model="edit.fundName" v-if="editIndex === index" />
          <span v-else>{{ row.fundName }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="purchaseDate">
          <DatePicker type="date" v-model="edit.purchaseDate" style="width:100%" v-if="editIndex === index" />
          <span v-else>{{ row.purchaseDate }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="confirmDate">
          <DatePicker type="date" v-model="edit.confirmDate" style="width:100%" v-if="editIndex === index" />
          <span v-else>{{ row.confirmDate }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="purchaseValue">
          <NumberInput :fixed="4" v-model="edit.purchaseValue" v-if="editIndex === index" />
          <span v-else>{{ row.purchaseValue }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="purchaseAmount">
          <NumberInput :fixed="2" v-model="edit.purchaseAmount" v-if="editIndex === index" />
          <span v-else>{{ row.purchaseAmount }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="purchaseCost">
          <NumberInput :fixed="2" v-model="edit.purchaseCost" v-if="editIndex === index" />
          <span v-else>{{ row.purchaseCost }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="purchaseFee">
          <NumberInput :fixed="2" v-model="edit.purchaseFee" v-if="editIndex === index" />
          <span v-else>{{ row.purchaseFee }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="action">
          <div v-if="editIndex === index">
            <Button size="small" class="v-btn" @click="handleSave(index)">保存</Button>
            <Button size="small" class="v-btn" style="margin-left: 0.5rem;" @click="editIndex = -1">取消</Button>
          </div>
          <div v-else>
            <Button size="small" class="v-btn" @click="handleEdit(row, index)">修改</Button>
            <Button size="small" class="v-btn" type="warning" @click="handleForceAdd(row)" v-if="row.exist">强制提交</Button>
            <Button size="small" class="v-btn" type="error" @click="handleDelete(row, index)">删除</Button>
          </div>
        </template>
      </Table>
    </Row>
  </div>
</template>

<script>
import NumberInput from '@/components/common/NumberInput'
import API from '@/js/api.js'
export default {
  name: 'FundImport',
  components: {
    NumberInput
  },
  data() {
    return {
      importFundJsonStr: '',
      editFundList: [],
      edit: {
        fundCode: '',
        fundName: '',
        purchaseDate: '',
        confirmDate: '',
        purchaseValue: '',
        purchaseAmount: '',
        purchaseCost: '',
        purchaseFee: ''
      },
      editIndex: -1,
      importFundColumns: [
        {
          title: '选择',
          type: 'selection',
          minWidth: 80
        },
        {
          title: '基金代码',
          slot: 'fundCode',
          minWidth: 100
        },
        {
          title: '基金名称',
          slot: 'fundName',
          minWidth: 200
        },
        {
          title: '买入日期',
          slot: 'purchaseDate',
          minWidth: 180
        },
        {
          title: '买入确认日期',
          slot: 'confirmDate',
          minWidth: 180
        },
        {
          title: '单位净值',
          slot: 'purchaseValue'
        },
        {
          title: '买入份额',
          slot: 'purchaseAmount'
        },
        {
          title: '买入总金额',
          slot: 'purchaseCost'
        },
        {
          title: '买入手续费',
          slot: 'purchaseFee'
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 220
        }
      ]
    }
  },
  methods: {
    reflushStr: function() {
      let originStr = this.importFundJsonStr
      this.importFundJsonStr = ''
      this.importFundJsonStr = originStr
    },
    removeExistFunds: function() {
      this.editFundList = this.editFundList.filter(fundInfo => !fundInfo.exist)
    },
    checkAllFundsStatus: function() {
      let requestFundList = this.editFundList.map(fundInfo => {
        return {
          fundCode: fundInfo.fundCode,
          confirmDate: fundInfo.confirmDate,
          purchaseAmount: fundInfo.purchaseAmount
        }
      })
      return API.checkAllFundsStatus({
        fundCheckList: requestFundList
      }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          if (resp.existsList && resp.existsList.length > 0) {
            this.$debug(JSON.stringify(resp.existsList))
            const existsList = resp.existsList
            this.editFundList
              .filter(fundInfo => {
                for (let i = 0; i < existsList.length; i++) {
                  let existFund = existsList[i]
                  if (
                    existFund.fundCode === fundInfo.fundCode &&
                    existFund.confirmDate === fundInfo.confirmDate &&
                    parseFloat(existFund.purchaseAmount) === parseFloat(fundInfo.purchaseAmount)
                  ) {
                    return true
                  }
                }
                return false
              })
              .forEach(fundInfo => this.$set(fundInfo, 'exist', true))
          }
        }
        return Promise.resolve(this.editFundList)
      })
    },
    checkAndSaveFunds: function() {
      this.checkAllFundsStatus().then(fundList => {
        let requestList = fundList.filter(fundInfo => !fundInfo.exist)
        if (requestList && requestList.length > 0) {
          requestList.forEach(fundInfo => (fundInfo.purchaseConfirmDate = fundInfo.confirmDate))
          API.batchAddFunds({
            fundInfoList: requestList
          }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.$Message.success('批量新增成功')
              this.$emit('reload-funds')
            } else {
              this.$Message.error('批量新增失败')
            }
          })
        } else {
          this.$Message.error('批量导入的基金可能全部都已存在，无可新增的基金')
        }
      })
    },
    checkTargetFundStatus: function(fundInfo) {
      let request = {
        fundCode: fundInfo.fundCode,
        purchaseDate: fundInfo.purchaseDate,
        purchaseValue: fundInfo.purchaseValue,
        purchaseAmount: fundInfo.purchaseAmount
      }
      this.$debug('校验基金信息：{}', JSON.stringify(request))
    },
    handleForceAdd: function(row) {
      this.$Modal.confirm({
        title: '当前已存在同确认日期，同份额的数据，是否确认保存新的买入信息?',
        onOk: function() {
          let request = {}
          Object.assign(request, row)
          request.purchaseConfirmDate = request.confirmDate
          API.addFundInfo(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.$emit('reload-funds')
              this.$Message.success('添加成功')
            } else {
              this.$Message.success('添加失败 ' + resp.msg)
            }
          })
        }
      })
    },
    handleSave: function(index) {
      this.$debug('修改：「{}」', index)
      this.editIndex = -1
      this.editFundList[index].fundCode = this.edit.fundCode
      this.editFundList[index].fundName = this.edit.fundName
      this.editFundList[index].purchaseDate = this.dateFormat(this.edit.purchaseDate, 'yyyy-MM-dd')
      this.editFundList[index].confirmDate = this.dateFormat(this.edit.confirmDate, 'yyyy-MM-dd')
      this.editFundList[index].purchaseValue = this.edit.purchaseValue
      this.editFundList[index].purchaseAmount = this.edit.purchaseAmount
      this.editFundList[index].purchaseCost = this.edit.purchaseCost
      this.editFundList[index].purchaseFee = this.edit.purchaseFee
    },
    handleEdit: function(row, index) {
      this.editIndex = index
      this.edit.fundCode = row.fundCode
      this.edit.fundName = row.fundName
      this.edit.purchaseDate = row.purchaseDate
      this.edit.confirmDate = row.confirmDate
      this.edit.purchaseValue = row.purchaseValue
      this.edit.purchaseAmount = row.purchaseAmount
      this.edit.purchaseCost = row.purchaseCost
      this.edit.purchaseFee = row.purchaseFee
    },
    handleDelete: function(row, index) {
      this.$debug('删除：「{}」', index)
      let that = this
      this.$Modal.confirm({
        title: '确定要删除该条记录吗？',
        content: `(${row.fundCode})${row.fundName} 买入日期：${row.purchaseDate} 买入份额：${row.purchaseAmount}`,
        onOk: function() {
          that.editFundList.splice(index, 1)
        }
      })
    }
  },
  watch: {
    importFundList: function(n) {
      this.editFundList = n
    }
  },
  computed: {
    importFundList: function() {
      if (this.$isNotEmpty(this.importFundJsonStr)) {
        let list = []
        try {
          list = JSON.parse(this.importFundJsonStr)
        } catch (e) {
          this.$debug('解析JSON异常' + e)
        }
        return list
      } else {
        return []
      }
    }
  },
  mounted() {
    this.importFundColumns.forEach(column => {
      if (!this.$isNotEmpty(column.minWidth)) {
        this.$set(column, 'minWidth', 120)
        this.$set(column, 'align', 'center')
      }
    })
  }
}
</script>

<style scoped>
.fund-exists {
  background: red;
}
</style>