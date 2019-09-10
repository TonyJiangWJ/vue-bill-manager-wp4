<template>
  <div class="common-container">
    <Modal v-model="budgetModal" title="预算详情" :width="380">
      <Row v-if="typeof budget.id==='undefined'" type="flex" justify="center">
        <Col span="10">月份</Col>
        <Col span="10"><DatePicker type="month" v-model="yearMonthInfo" @on-change="setYearMonth"  placeholder="月份"></DatePicker></Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">名称</Col>
        <Col span="10"><Input type="text" placeholder="名称" v-model="budget.name" :maxlength="20"/></Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span="10">金额</Col>
        <Col span="10"><Input v-model="budget.amount" type="text" @on-blur="checkAmount" placeholder="金额"/></Col>
      </Row>
      <Divider v-if="budget.id" orientation="left">关联标签</Divider>
      <Row type="flex" justify="start">
        <Tag v-for="(tag,index) in budget.tagInfos" :key="tag.tagId"
          type="border"
          closable @on-close="doRemoveTag(tag.tagId)"
          :color="tagColors[index % tagColors.length]">{{tag.tagName}}</Tag>
      </Row>
      <Divider v-if="budget.id" orientation="left">未关联标签</Divider>
      <Row type="flex" justify="start">
        <Button v-for="(tag) in assignableTagList" :key="tag.tagId"
          class='gap-5' icon="ios-add" size="small" type="dashed"
          @click="doAddTag(tag.tagId)"
          >{{tag.tagName}}</Button>
      </Row>
      <div slot="footer">
        <Button v-if="budget.id && budget.amount == 0" type="dashed" @click="deleteBudget">删除</Button>
        <Button type="default" @click="budgetModal=false">取消</Button>
        <Button type="primary" @click="upsertBudget">确定</Button>
      </div>
    </Modal>

    <Row type='flex' justify="start">
      <Col span="4">预算管理</Col>
      <Col span="6"><Button type="primary" @click="addBudget" size="small">添加预算</Button></Col>
    </Row>
    <Row>
      <Col span="6"><Button type="success" ghost @click="loadReport" size="small">重新载入</Button></Col>
    </Row>
    <Divider/>
    <TimelineItem v-for="report in reportModelList" :key="report.yearMonthInfo">
      <div>
        <h3>
          <Row>
            <span>{{report.yearMonthInfo}}</span>&nbsp;
            <span>总支出：￥{{report.budgetUsed+report.noBudgetUsed|longToString}}</span>
            <span>总预算：￥{{report.totalAmount|longToString}}</span>
            <span>预算支出：￥{{report.budgetUsed|longToString}}</span>
            <span>非预算支出：￥{{report.noBudgetUsed|longToString}}</span>
            <span :style="{ color: report.remain>0 ? '#008000' : '#ff0000' }">{{ report.remain>=0 ? '结余：' : '超支：'}}￥{{report.remain|longToString}}</span>
          </Row>
        </h3>
        <transition name="fade">
          <Collapse v-if="show">
            <Panel v-for="reportItem in report.reportItems"
              :key="reportItem.id">
              <span>{{reportItem.name}} ¥{{reportItem.amount|longToString}} {{reportItem.used|longToString}}
                <span :style="{ color: reportItem.remain>0 ? '#008000' : '#ff0000' }">{{reportItem.remain|longToString}}</span>
              </span>
              <div slot="content">
                <span>预算：¥{{reportItem.amount|longToString}} 支出：￥{{reportItem.used|longToString}}
                  <span :style="{ color: reportItem.remain>0 ? '#008000' : '#ff0000' }">{{reportItem.remain>=0?'剩余':'超支'}}:{{reportItem.remain|longToString}}</span>
                </span>
                <Button type="success" size="small" ghost @click.stop="showDetail(reportItem)">修改</Button>
                <Tag type="border" v-for="(tag,index) in reportItem.tagInfos" :key="tag.tagId" :color="tagColors[index % tagColors.length]">{{tag.tagName}}({{tag.amount|longToString}})</Tag>
              </div>
            </Panel>
          </Collapse>
        </transition>
      </div>
    </TimelineItem>
  </div>
</template>

<script>
import API from '@/js/api.js'

export default {
  name: 'BudgetManage',
  data () {
    return {
      budget: {},
      empty: '',
      yearMonthInfo: null,
      reportModelList: [],
      assignableTagList: [],
      show: true,
      budgetModal: false,
      tagColors: ['primary', 'success', 'warning', 'magenta', 'volcano', 'orange', 'gold', 'yellow', 'lime', 'green', 'cyan', 'blue']
    }
  },
  filters: {
    longToString: function (val) {
      if (typeof val === 'undefined' || val === 0) {
        return '0'
      }
      return (val / 100).toFixed(2)
    }
  },
  methods: {
    setYearMonth: function (val) {
      this.budget.yearMonthInfo = val
    },
    showDetail: function (reportItem) {
      this.budget = Object.assign({}, reportItem)

      this.budgetModal = true
      this.budget.amount = (reportItem.amount / 100).toFixed(2)
      API.listBudgetAssignableTags({budgetId: this.budget.id}).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.assignableTagList = resp.tagInfoList
        }
      })
    },
    addBudget: function () {
      this.budget = {}
      this.budgetModal = true
      this.assignableTagList = []
    },
    upsertBudget: function () {
      this.debug(JSON.stringify(this.budget))

      if (typeof this.budget.id === 'undefined') {
        // insert
        if (typeof this.budget.yearMonthInfo === 'undefined') {
          this.budget.yearMonthInfo = this.dateFormat(this.yearMonthInfo, 'yyyy-MM')
        }

        let request = {
          name: this.budget.name,
          amount: (parseFloat(this.budget.amount) * 100).toFixed(0),
          year: this.budget.yearMonthInfo.substring(0, 4),
          month: parseInt(this.budget.yearMonthInfo.substring(5))
        }
        API.putBudget(request).then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            this.$Message.success('添加成功')
            this.loadReport()
            this.budgetModal = false
          } else {
            this.$Message.error('添加失败')
          }
        })
      } else {
        let request = {
          name: this.budget.name,
          amount: (parseFloat(this.budget.amount) * 100).toFixed(0),
          id: this.budget.id,
          version: this.budget.version
        }
        API.updateBudget(request).then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            this.$Message.success('更新成功')
            this.loadReport()
            this.budgetModal = false
          } else {
            this.$Message.error('更新失败')
          }
        })
      }
    },
    doAddTag: function (tagId) {
      API.bindTagToBudget({
        budgetId: this.budget.id,
        tagId: tagId
      }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.$Message.success('更新成功')
          if (typeof this.budget.tagInfos === 'undefined') {
            this.budget.tagInfos = []
          }
          this.budget.tagInfos.push({tagId: tagId, tagName: this.assignableTagList.find(tag => tag.tagId === tagId).tagName})
          this.assignableTagList.splice(this.assignableTagList.findIndex(tagInfo => tagInfo.tagId === tagId), 1)
        } else {
          this.$Message.error('更新失败')
        }
      })
    },
    doRemoveTag: function (tagId) {
      API.deleteTagFromBudget({
        budgetId: this.budget.id,
        tagId: tagId
      }).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.$Message.success('更新成功')
          let tagInfo = this.budget.tagInfos.splice(this.budget.tagInfos.findIndex(tagInfo => tagInfo.tagId === tagId), 1)[0]
          this.debug('JSON:' + JSON.stringify(tagInfo))
          this.assignableTagList.push(tagInfo)
        } else {
          this.$Message.error('更新失败')
        }
      })
    },
    deleteBudget: function () {
      let self = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定要删除该预算吗?',
        onOk: function () {
          API.deleteBudget({id: self.budget.id}).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              self.$Message.success('删除成功')
              self.loadReport()
              self.budgetModal = false
            } else {
              self.$Message.error('删除失败')
            }
          })
        }
      })
    },
    checkAmount: function () {
      this.budget.amount = this.checkNumic(this.budget.amount)
    },
    loadReport: function () {
      API.loadBudgetReport({}).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.reportModelList = resp.reportModelList
        }
      })
    }
  },
  created () {
    // this.reportModelList = reportModelList
    this.loadReport()
  }
}
</script>
