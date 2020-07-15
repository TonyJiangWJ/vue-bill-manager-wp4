<template>
  <div class="common-container">
    <div>
      <Row type="flex" justify="space-around">
        <i-col :xs="10" :sm="6" :md="5" :lg="4" class="v-gap">
          <DatePicker type="date" placeholder="开始时间" v-model="startDate"></DatePicker>
        </i-col>
        <i-col :xs="10" :sm="6" :md="5" :lg="4" class="v-gap">
          <DatePicker type="date" placeholder="结束时间" v-model="endDate"></DatePicker>
        </i-col>
        <i-col :xs="10" :sm="6" :md="5" :lg="4" class="v-gap">
          <Input type="text" placeholder="查询内容" v-model="content" />
        </i-col>
        <i-col :xs="10" :sm="6" :md="5" :lg="4">
          <Button @click="clear" class="v-btn">清空</Button>
          <Button type="primary" @click="doQuery" class="v-btn">查询</Button>
        </i-col>
      </Row>
    </div>
    <Divider />
    <Table
      stripe
      border
      ref="selection"
      @on-selection-change="selectChanged"
      :columns="costRecordColumns"
      :data="costRecordList"
      @on-row-click="clickedRow"
      @on-sort-change="sortData"
    ></Table>
    <cost-record-adder v-model="showCostRecordAdder" @requery-list="query" />
    <record-detail-drawer :tag-colors="tagColors" v-model="showRecordDetail" :trade-no="selectedTradeNo" @requery-list="query" />
    <tag-manage
      :tag-colors="tagColors"
      :record-id-list="selectedCostIds"
      :bound-tag-list="communalTags"
      v-model="showTagManage"
      @reload-records="reloadRecordsTag"
    />
    <Divider />
    <Page
      :total="totalItem"
      show-total
      show-sizer
      size="small"
      :current="pageNo"
      :page-size="pageSize"
      :page-size-opts="pageSizeOpts"
      @on-change="queryNewPage"
      @on-page-size-change="queryNewSize"
    />
    <Divider />
    <Row>
      <i-col>
        <Button size="small" type="dashed" @click="toggleTagColumn" class="v-btn">{{showTagColumn === true ? '隐藏' : '显示'}}标签</Button>
        <Button size="small" type="success" ghost @click="addCostRecord" class="v-btn">添加账单</Button>
      </i-col>
      <i-col>
        <Button size="small" type="primary" ghost @click="calSumAmount" class="v-btn">计算总金额</Button>
        <span>{{sumAmount===0?'':sumAmount}}</span>
      </i-col>
      <i-col>
        <Button size="small" type="primary" ghost @click="batchManageTags" :disabled="!haveSelectedItem" class="v-btn">批量设置标签</Button>
      </i-col>
      <i-col>
        <Button size="small" type="primary" ghost @click="batchDeleted" :disabled="!haveSelectedItem" class="v-btn">批量删除</Button>
        <Button size="small" type="primary" ghost @click="batchUndeleted" :disabled="!haveSelectedItem" class="v-btn">批量取消删除</Button>
      </i-col>
      <i-col>
        <Button size="small" type="primary" ghost @click="batchHidden" :disabled="!haveSelectedItem" class="v-btn">批量隐藏</Button>
        <Button size="small" type="primary" ghost @click="batchShow" :disabled="!haveSelectedItem" class="v-btn">批量显示</Button>
      </i-col>
    </Row>
  </div>
</template>

<script>
import API from '@/js/api.js'
import TagListContainer from '@/components/bills/TagListContainer.vue'
import CostRecordAdder from '@/components/bills/billRecord/CostRecordAdder'
import RecordDetailDrawer from '@/components/bills/billRecord/RecordDetailDrawer'
import TagManage from '@/components/bills/billRecord/TagManage'
import { CostRecord } from '@/js/CostRecord.js'

export default {
  name: 'BillRecordList',
  components: {
    CostRecordAdder,
    RecordDetailDrawer,
    TagManage
  },
  data() {
    return {
      startDate: '',
      endDate: '',
      content: '',
      currentAmount: 0,
      costRecordList: [],
      totalPage: 0,
      totalItem: 0,
      pageSize: 0,
      pageNo: 0,
      isDeleted: '0',
      isHidden: '0',
      inOutType: '支出',
      orderBy: '',
      sort: '',
      newPageSize: 0,
      sumAmount: 0,
      showRecordDetail: false,
      showTagManage: false,
      showCostRecordAdder: false,
      communalTagManage: false,
      selectedTradeNo: '',
      allTagList: [],
      showTagColumn: false,
      newTag: {
        tagName: ''
      },
      pageSizeOpts: [10, 20, 30, 40],
      communalTags: [],
      selectedCostIds: [],
      tagColors: [
        'primary',
        'success',
        'warning',
        'magenta',
        'volcano',
        'orange',
        'gold',
        'yellow',
        'lime',
        'green',
        'cyan',
        'blue'
      ],
      addtionalTagColumn: {
        title: '标签',
        minWidth: 150,
        tooltip: true,
        render: (h, params) => {
          return h(TagListContainer, {
            props: {
              row: params.row
            }
          })
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
          minWidth: 180
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
          filterRemote: function(value) {
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
          filterRemote: function(value) {
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
          filterRemote: function(value) {
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
  computed: {
    haveSelectedItem: function() {
      return this.selectedCostIds !== 'undefined' && this.selectedCostIds.length > 0
    }
  },
  methods: {
    selectChanged: function() {
      this.selectedCostIds = this.$refs.selection.getSelection().map(elem => elem.id)
    },
    checkHaveItemSelection: function() {
      let selected = this.$refs.selection.getSelection()
      return typeof selected !== 'undefined' && selected.length > 0
    },
    reloadRecordsTag: function() {
      let request = {
        costIds: this.selectedCostIds
      }
      API.loadCommunalTagsFromRecords(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.communalTags = resp.tagInfoModels
        } else {
          this.communalTags = []
        }
      })
      if (this.showTagColumn) {
        this.query()
      }
    },
    batchManageTags: function() {
      this.getAllTagList()
      this.communalTagManage = true
      if (this.checkHaveItemSelection()) {
        let request = {
          costIds: this.selectedCostIds
        }
        this.$debug(JSON.stringify(request))
        API.loadCommunalTagsFromRecords(request).then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS || resp.code === API.CODE_CONST.DATA_NOT_EXIST) {
            this.$debug(resp.tagInfoModels)
            this.communalTags = resp.tagInfoModels
            this.showTagManage = true
            this.$debug('设置显示标签管理' + this.showTagManage)
          } else {
            this.communalTags = []
          }
        })
      } else {
        this.selectedCostIds = []
      }
    },
    executeBatchDelete: function (request) {
      API.batchUpdateDelete(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.$Message.success('修改成功')
          this.query()
        } else {
          this.$Message.error('修改失败，' + resp.msg)
        }
      })
    },
    executeBatchHide: function (request) {
      API.batchUpdateHide(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.$Message.success('修改成功')
          this.query()
        } else {
          this.$Message.error('修改失败，' + resp.msg)
        }
      })
    },
    confirmAndExecute: function(msg, execFunc) {
      this.$Modal.confirm({
        title: '警告',
        content: '确定要' + msg + '吗?',
        onOk: function() {
          this.$debug('标记 ' + msg)
          execFunc()
        }
      })
    },
    batchDeleted: function() {
      this.confirmAndExecute('批量删除这些记录', () =>
        this.executeBatchDelete({
          costIds: this.selectedCostIds,
          isDeleted: 1
        })
      )
    },
    batchUndeleted: function() {
      this.confirmAndExecute('批量取消删除这些记录', () =>
        this.executeBatchDelete({
          costIds: this.selectedCostIds,
          isDeleted: 0
        })
      )
    },
    batchHidden: function() {
      this.confirmAndExecute('批量隐藏这些记录', () =>
        this.executeBatchHide({
          costIds: this.selectedCostIds,
          isHidden: 1
        })
      )
    },
    batchShow: function() {
      this.confirmAndExecute('批量显示这些记录', () =>
        this.executeBatchHide({
          costIds: this.selectedCostIds,
          isHidden: 0
        })
      )
    },
    calSumAmount: function() {
      this.sumAmount = 0
      if (this.checkHaveItemSelection()) {
        let selected = this.$refs.selection.getSelection()
        this.$debug(selected.length)
        let sum = selected
          .map(elem => parseFloat(elem.money))
          .reduce((a, b) => {
            return a + b
          })
        this.$debug(sum)
        this.sumAmount = sum.toFixed(2)
      }
    },
    addCostRecord: function() {
      this.showCostRecordAdder = true
    },
    toggleTagColumn: function() {
      this.showTagColumn = !this.showTagColumn
      if (this.showTagColumn) {
        this.query()
      }
    },
    sortData: function(column) {
      this.$debug(column.key + ',' + column.order)
      this.sort = column.order
      this.orderBy = column.key
      this.pageNo = 0
      this.query()
    },
    clickedRow: function(row, index) {
      this.$debug(row)
      this.$debug(index)
      this.$debug(this.showRecordDetail)
      this.selectedTradeNo = row.tradeNo
      this.$debug('选择账单：' + this.selectedTradeNo)
      this.showRecordDetail = true
    },
    clear: function() {
      this.content = ''
      this.startDate = ''
      this.endDate = ''
    },
    getDateOrEmpty: function(dateStr) {
      if (dateStr !== '') {
        return this.dateFormat(dateStr, 'yyyy-MM-dd')
      } else {
        return ''
      }
    },
    queryNewPage: function(index) {
      this.pageNo = index
      this.query()
    },
    queryNewSize: function(newSize) {
      this.pageSize = newSize
      this.pageNo = 0
      this.query()
    },
    getAllTagList: function() {
      API.loadAllTagList({}).then(resp => {
        this.allTagList = []
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.allTagList = resp.tagInfoList
        }
      })
    },
    doQuery: function() {
      this.pageNo = 0
      this.query()
    },
    query: function() {
      let requestData = {
        startDate: this.getDateOrEmpty(this.startDate),
        endDate: this.getDateOrEmpty(this.endDate),
        content: this.content,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        isDeleted: this.isDeleted,
        isHidden: this.isHidden,
        inOutType: this.inOutType,
        sort: this.sort,
        orderBy: this.orderBy,
        showTags: this.showTagColumn
      }
      API.loadBillList(requestData).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.$debug('请求成功')
          this.costRecordList = []
          if (typeof resp.costRecordList !== 'undefined' && resp.costRecordList.length > 0) {
            for (let i = 0; i < resp.costRecordList.length; i++) {
              if (this.selectedCostIds && this.selectedCostIds.length > 0) {
                let dataItem = new CostRecord(resp.costRecordList[i])
                if (this.selectedCostIds.indexOf(dataItem.id) > -1) {
                  dataItem._checked = true
                }
                this.costRecordList.push(dataItem)
              } else {
                this.costRecordList.push(new CostRecord(resp.costRecordList[i]))
              }
            }
          }
          this.totalPage = resp.totalPage
          this.totalItem = resp.totalItem
          this.pageSize = resp.pageSize
          this.pageNo = resp.pageNo === 0 ? 1 : resp.pageNo
          if (this.pageNo > resp.totalPage) {
            this.pageNo = 1
          }
          this.pageSizeOpts = [10, 20, 30, 40, resp.totalItem >= 200 ? 200 : resp.totalItem]
          this.currentAmount = resp.currentAmount
        } else {
          this.$debug('请求失败')
          if (resp.code === API.CODE_CONST.DATA_NOT_EXIST) {
            this.$debug('数据不存在')
          }
        }
      })
    }
  },
  created() {
    this.query()
  },
  watch: {
    showTagColumn: function() {
      if (this.showTagColumn === true) {
        this.costRecordColumns = [this.addtionalTagColumn].concat(this.costRecordColumns)
      } else {
        this.costRecordColumns = this.costRecordColumns.filter(elem => elem.title !== this.addtionalTagColumn.title)
      }
    }
  }
}
</script>
