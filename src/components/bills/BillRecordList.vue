<template>
  <div class="common-container">
    <div>
      <Row type="flex" justify="space-around">
        <Col :xs="10" :sm="6" :md="5" :lg="4">
          <DatePicker type="date" placeholder="开始时间" v-model="startDate"></DatePicker>
        </Col>
        <Col :xs="10" :sm="6" :md="5" :lg="4">
          <DatePicker type="date" placeholder="结束时间" v-model="endDate"></DatePicker>
        </Col>
        <Col :xs="10" :sm="6" :md="5" :lg="4">
          <Input type="text" placeholder="查询内容" v-model="content"></Input>
        </Col>
        <Col :xs="10" :sm="6" :md="5" :lg="4">
          <Button @click="clear">清空</Button>
          <Button type="primary" @click="doQuery">查询</Button>
        </Col>
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
    <Drawer title="账单详情" v-model="showRecordDetail" :width="drawerWidth">
      <div>
        <Row>
          <Col span="8">
            <p>账单编号:</p>
          </Col>
          <Col span="16">{{detail.tradeNo}}</Col>
        </Row>
        <Row>
          <Col span="8">订单编号:</Col>
          <Col span="16">{{detail.orderNo}}</Col>
        </Row>
        <Row>
          <Col span="8">创建时间:</Col>
          <Col span="16">{{detail.createTime}}</Col>
        </Row>
        <Row>
          <Col span="8">支付时间:</Col>
          <Col span="16">{{detail.paidTime}}</Col>
        </Row>
        <Row>
          <Col span="8">修改时间:</Col>
          <Col span="16">{{detail.modifyTime}}</Col>
        </Row>
        <Row>
          <Col span="8">交易对方:</Col>
          <Col span="16">{{detail.target}}</Col>
        </Row>
        <Row>
          <Col span="8">金额:</Col>
          <Col span="16">{{detail.money}}</Col>
        </Row>
        <Row>
          <Col span="8">账单状态:</Col>
          <Col span="16">{{detail.tradeStatus}}</Col>
        </Row>
        <Row>
          <Col span="8">收支类型:</Col>
          <Col span="16">{{detail.inOutType}}</Col>
        </Row>
        <Row>
          <Col span="8">订单状态:</Col>
          <Col span="16">{{detail.orderStatus}}</Col>
        </Row>
        <Row>
          <Col span="8">服务手续费:</Col>
          <Col span="16">{{detail.serviceCost}}</Col>
        </Row>
        <Row>
          <Col span="8">退款:</Col>
          <Col span="16">{{detail.refundMoney}}</Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span="8">交易类型:</Col>
          <Col span="16">
            <Input type="text" v-model="detail.orderType"></Input>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span="8">交易地点:</Col>
          <Col span="16">
            <Input type="text" v-model="detail.location"></Input>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span="8">商品名:</Col>
          <Col span="16">
            <Input type="text" v-model="detail.goodsName"></Input>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span="8">备注:</Col>
          <Col span="16">
            <Input type="text" v-model="detail.memo"></Input>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span="8">是否已删除</Col>
          <Col span="16">
            <Button size="small" @click="toggleDelete" :type="detail.isDeleted==='未删除'?'success':'error'" ghost>{{detail.isDeleted}}</Button>
          </Col>
        </Row>
        <Row type="flex" align="middle">
          <Col span="8">是否显示</Col>
          <Col span="16">
            <Button size="small" @click="toggleHide" :type="detail.isHidden==='显示'?'success':'error'" ghost>{{detail.isHidden}}</Button>
          </Col>
        </Row>
        <Divider />
        <Row type="flex" align="middle">
          <Col span="8">标签:</Col>
          <Col span="16">
            <Tag v-for="(tag,index) in detail.tagInfos" type="border" :key="tag.id" :color="tagColors[index % tagColors.length]">{{tag.tagName}}</Tag>
          </Col>
        </Row>
        <Divider />
        <Row type="flex" align="middle">
          <Col span="8">操作</Col>
          <Col span="12">
            <Row :gutter="16">
              <Col>
                <Button class="gap-5" type="success" @click="tagManage = true;getAllTagList()">关联标签</Button>
              </Col>
              <Col>
                <Button class="gap-5" type="success" @click="saveRecordChange()">保存修改</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Drawer>
    <Modal v-model="addTagModal" title="添加标签信息" :width="380" @on-ok="doCreateTag">
      <Row type="flex" align="middle">
        <Col span="8">标签名称</Col>
        <Col span="16">
          <Input type="text" v-model="newTag.tagName"></Input>
        </Col>
      </Row>
    </Modal>
    <Modal v-model="addCostRecordModal" title="添加账单信息" :width="380">
      <Form ref="newRecord" :model="newRecord" label-position="right" :label-width="100" :rules="ruleValidate">
        <FormItem label="交易时间:" prop="createTime">
          <DatePicker type="datetime" v-model="newRecord.createTime" clearable />
        </FormItem>
        <FormItem label="交易地点:" prop="location">
          <Input type="text" v-model="newRecord.location" />
        </FormItem>
        <FormItem label="金额:" prop="money">
          <Input type="text" @on-blur="checkAmount" v-model="newRecord.money" />
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
        <Button @click="addCostRecordModal=false">取消</Button>
        <Button type="primary" @click="doAddCostRecord">确定</Button>
      </div>
    </Modal>
    <Drawer title="标签管理" v-model="tagManage">
      <Button size="small" @click="createTag">新增标签</Button>
      <Button size="small" @click="removeTags" type="dashed">{{removeTagMode?'取消':''}}删除标签</Button>
      <Divider orientation="left">全部标签</Divider>
      <Row>
        <template v-if="!removeTagMode">
          <Button
            class="gap-5"
            v-for="tag in allTagList"
            :key="tag.tagId"
            icon="ios-add"
            type="dashed"
            size="small"
            @click.native="addTagToRecord(tag.tagId)"
          >{{tag.tagName}}</Button>
        </template>
        <template v-else>
          <Tag v-for="tag in allTagList" :key="tag.tagId" type="border" color="red" closable @on-close="doRemoveTag(tag.tagId)">{{tag.tagName}}</Tag>
        </template>
      </Row>
      <Divider orientation="left">已关联标签</Divider>
      <Row>
        <Tag
          v-for="(tag,index) in detail.tagInfos"
          :key="tag.tagId"
          type="border"
          :color="tagColors[index % tagColors.length]"
          closable
          @on-close="removeTagFromRecord(tag.tagId)"
        >{{tag.tagName}}</Tag>
      </Row>
    </Drawer>
    <Drawer title="标签管理" v-model="communalTagManage">
      <Button size="small" @click="createTag">新增标签</Button>
      <Button size="small" @click="removeTags" type="dashed">{{removeTagMode?'取消':''}}删除标签</Button>
      <Divider orientation="left">全部标签</Divider>
      <Row>
        <template v-if="!removeTagMode">
          <Button
            class="gap-5"
            v-for="tag in allTagList"
            :key="tag.tagId"
            icon="ios-add"
            type="dashed"
            size="small"
            @click.native="addTagToRecords(tag.tagId)"
          >{{tag.tagName}}</Button>
        </template>
        <template v-else>
          <Tag v-for="tag in allTagList" :key="tag.tagId" type="border" color="red" closable @on-close="doRemoveTag(tag.tagId)">{{tag.tagName}}</Tag>
        </template>
      </Row>
      <Divider orientation="left">已关联标签</Divider>
      <Row>
        <Tag
          v-for="(tag,index) in communalTags"
          :key="tag.tagId"
          type="border"
          :color="tagColors[index % tagColors.length]"
          closable
          @on-close="removeTagFromRecords(tag.tagId)"
        >{{tag.tagName}}</Tag>
      </Row>
    </Drawer>
    <Divider />
    <Page
      :total="totalItem"
      show-total
      show-sizer
      size="small"
      :current="pageNo"
      :page-size="pageSize"
      @on-change="queryNewPage"
      @on-page-size-change="queryNewSize"
    />
    <Divider />
    <Row>
      <Col>
        <Button size="small" type="dashed" @click="toggleTagColumn">{{showTagColumn === true ? '隐藏' : '显示'}}标签</Button>
        <Button size="small" type="success" ghost @click="addCostRecord">添加账单</Button>
      </Col>
      <Col>
        <Button size="small" type="primary" ghost @click="calSumAmount">计算总金额</Button>
        <span>{{sumAmount===0?'':sumAmount}}</span>
      </Col>
      <Col>
        <Button size="small" type="primary" ghost @click="batchManageTags" :disabled="!haveSelectedItem">批量设置标签</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
import API from '@/js/api.js'
import TagListContainer from '@/components/bills/TagListContainer.vue'

function CostRecord (item) {
  this.createTime = item.createTime
  this.goodsName = item.goodsName
  this.inOutType = item.inOutType
  this.isDeleted = item.isDeleted === 0 ? '未删除' : '已删除'
  this.isHidden = item.isHidden === 0 ? '显示' : '隐藏'
  this.location = item.location
  this.money = item.money
  this.orderStatus = item.orderStatus
  this.orderType = item.orderType
  this.target = item.target
  this.tradeNo = item.tradeNo
  this.id = item.id
  this.version = item.version
  // extends
  this.tradeStatus = item.tradeStatus
  this.orderNo = item.orderNo
  this.modifyTime = item.modifyTime
  this.paidTime = item.paidTime
  this.memo = item.memo
  this.serviceCost = item.serviceCost
  this.refundMoney = item.refundMoney

  this.tags = item.tags
  this.tagInfos = item.tagInfos
}

export default {
  name: 'BillRecordList',
  components: {
    TagListContainer
  },
  data () {
    return {
      haveSelectedItem: false,
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
      tagManage: false,
      communalTagManage: false,
      addTagModal: false,
      removeTagMode: false,
      addCostRecordModal: false,
      drawerWidth: 256,
      detail: {},
      allTagList: [],
      showTagColumn: false,
      newTag: {
        tagName: ''
      },
      newRecord: {},
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
          filterRemote: function (value, row) {
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
          filterRemote: function (value, row) {
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
          filterRemote: function (value, row) {
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
  methods: {
    selectChanged: function () {
      this.haveSelectedItem = this.checkHaveItemSelection()
      this.selectedCostIds = this.$refs.selection.getSelection().map(elem => elem.id)
    },
    checkHaveItemSelection: function () {
      let selected = this.$refs.selection.getSelection()
      return typeof selected !== 'undefined' && selected.length > 0
    },
    batchManageTags: function () {
      this.getAllTagList()
      this.communalTagManage = true
      if (this.checkHaveItemSelection()) {
        let request = {
          costIds: this.selectedCostIds
        }
        this.debug(JSON.stringify(request))
        API.loadCommunalTagsFromRecords(request).then(resp => {
          if (resp.code === API.CODE_CONST.SUCCESS) {
            this.debug(resp.tagInfoModels)
            this.communalTags = resp.tagInfoModels
          } else {
            this.communalTags = []
          }
        })
      } else {
        this.selectedCostIds = []
      }
    },
    calSumAmount: function () {
      this.sumAmount = 0
      if (this.checkHaveItemSelection()) {
        let selected = this.$refs.selection.getSelection()
        this.debug(selected.length)
        let sum = selected
          .map(elem => parseFloat(elem.money))
          .reduce((a, b) => {
            return a + b
          })
        this.debug(sum)
        this.sumAmount = sum.toFixed(2)
      }
    },
    checkAmount: function () {
      this.newRecord.money = this.checkNumic(this.newRecord.money)
    },
    addCostRecord: function () {
      this.addCostRecordModal = true
    },
    doAddCostRecord: function () {
      this.debug('data:' + JSON.stringify(this.newRecord))
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
              this.addCostRecordModal = false
              this.$Message.success('添加成功')
              this.newRecord = {}
              this.query()
            }
          })
        } else {
          this.$Message.error('请检查输入是否正确')
        }
      })
    },
    toggleDelete: function () {
      let nowStatus = this.detail.isDeleted === '已删除'
      let newStatus = nowStatus ? '未删除' : '已删除'
      let self = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定要' + (nowStatus ? '取消删除' : '删除') + '该项吗?',
        onOk: function () {
          this.debug('标记删除')
          API.toggleRecordDelete({
            nowStatus: nowStatus ? '1' : '0',
            tradeNo: self.detail.tradeNo
          }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              self.detail.isDeleted = newStatus
              self.query()
            }
          })
        }
      })
    },
    toggleHide: function () {
      let nowStatus = this.detail.isHidden === '隐藏'
      let newStatus = nowStatus ? '显示' : '隐藏'
      let self = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定要' + (nowStatus ? '显示' : '隐藏') + '该项吗?',
        onOk: function () {
          self.debug('标记显示')
          API.toggleRecordHide({
            nowStatus: nowStatus ? '1' : '0',
            tradeNo: self.detail.tradeNo
          }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              self.detail.isHidden = newStatus
              self.query()
            }
          })
        }
      })
    },
    saveRecordChange: function () {
      let request = {
        version: this.detail.version,
        tradeNo: this.detail.tradeNo,
        memo: this.detail.memo,
        location: this.detail.location,
        goodsName: this.detail.goodsName,
        orderType: this.detail.orderType
      }
      API.updateRecord(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.query()
        }
      })
    },
    addTagToRecord: function (tagId) {
      let request = {
        tagId: tagId,
        tradeNo: this.detail.tradeNo
      }
      API.addTagToRecord(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          API.loadRecordTagList(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.detail.tagInfos = resp.tagInfoModels
            } else if (resp.code === API.CODE_CONST.DATA_NOT_EXIST) {
              this.detail.tagInfos = []
            }
          })
          if (this.showTagColumn) {
            this.query()
          }
        }
      })
    },
    removeTagFromRecord: function (tagId) {
      let request = {
        tagId: tagId,
        tradeNo: this.detail.tradeNo
      }
      API.removeTagFromRecord(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          API.loadRecordTagList(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.detail.tagInfos = resp.tagInfoModels
            } else if (resp.code === API.CODE_CONST.DATA_NOT_EXIST) {
              this.detail.tagInfos = []
            }
          })
          if (this.showTagColumn) {
            this.query()
          }
        }
      })
    },
    addTagToRecords: function (tagId) {
      let request = {
        tagId: tagId,
        costIds: this.selectedCostIds
      }
      API.batchAddTagToRecords(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          API.loadCommunalTagsFromRecords(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.debug(resp.tagInfoModels)
              this.communalTags = resp.tagInfoModels
            } else {
              this.communalTags = []
            }
          })
          if (this.showTagColumn) {
            this.query()
          }
        }
      })
    },
    removeTagFromRecords: function (tagId) {
      let request = {
        tagId: tagId,
        costIds: this.selectedCostIds
      }
      API.batchRemoveTagFromRecords(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          API.loadCommunalTagsFromRecords(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.debug(resp.tagInfoModels)
              this.communalTags = resp.tagInfoModels
            } else {
              this.communalTags = []
            }
          })
          if (this.showTagColumn) {
            this.query()
          }
        }
      })
    },
    removeTags: function () {
      this.removeTagMode = !this.removeTagMode
    },
    doRemoveTag: function (tagId) {
      let self = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定要删除该标签吗',
        onOk: function () {
          self.debug('删除标签')
          API.deleteTag({
            tagId: tagId
          }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              self.debug('删除成功')
              self.getAllTagList()
              API.loadRecordTagList({ tradeNo: self.detail.tradeNo }).then(resp => {
                if (resp.code === API.CODE_CONST.SUCCESS) {
                  self.detail.tagInfos = resp.tagInfoModels
                } else if (resp.code === API.CODE_CONST.DATA_NOT_EXIST) {
                  self.detail.tagInfos = []
                }
              })
              if (this.showTagColumn) {
                self.query()
              }
            }
          })
        },
        onCancel: function () {
          this.debug('取消删除')
        }
      })
    },
    createTag: function () {
      this.addTagModal = true
    },
    doCreateTag: function () {
      let request = {
        tagName: this.newTag.tagName
      }
      API.tagNameUnique(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          API.addTag(request).then(resp => {
            this.debug('添加成功')
            this.getAllTagList()
            this.newTag.tagName = ''
          })
        } else {
          this.$Message.warning('标签名称重复')
        }
      })
      this.debug('addTag' + request.tagName)
    },
    toggleTagColumn: function () {
      this.showTagColumn = !this.showTagColumn
      if (this.showTagColumn) {
        this.query()
      }
    },
    sortData: function (column) {
      this.debug(column.key + ',' + column.order)
      this.sort = column.order
      this.orderBy = column.key
      this.pageNo = 0
      this.query()
    },
    clickedRow: function (row, index) {
      this.debug(row)
      this.debug(index)
      this.debug(this.showRecordDetail)

      let request = {
        tradeNo: row.tradeNo
      }
      API.loadRecordDetail(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.detail = new CostRecord(resp.recordDetail)
        } else {
          this.detail = {}
        }
      })
      let width = document.documentElement.clientWidth
      this.debug(width)
      this.drawerWidth = width / 2 > 256 ? width / 2 : 256
      if (this.drawerWidth > 500) {
        this.drawerWidth = 500
      }
      this.showRecordDetail = true
    },
    clear: function () {
      this.content = ''
      this.startDate = ''
      this.endDate = ''
    },
    getDateOrEmpty: function (dateStr) {
      if (dateStr !== '') {
        return this.dateFormat(dateStr, 'yyyy-MM-dd')
      } else {
        return ''
      }
    },
    queryNewPage: function (index) {
      this.pageNo = index
      this.query()
    },
    queryNewSize: function (newSize) {
      this.pageSize = newSize
      this.pageNo = 0
      this.query()
    },
    getAllTagList: function () {
      API.loadAllTagList({}).then(resp => {
        this.allTagList = []
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.allTagList = resp.tagInfoList
        }
      })
    },
    doQuery: function () {
      this.pageNo = 0
      this.query()
    },
    query: function () {
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
          this.debug('请求成功')
          this.costRecordList = []
          if (typeof resp.costRecordList !== 'undefined' && resp.costRecordList.length > 0) {
            for (var i = 0; i < resp.costRecordList.length; i++) {
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
          this.currentAmount = resp.currentAmount
        } else {
          this.debug('请求失败')
          if (resp.code === API.CODE_CONST.DATA_NOT_EXIST) {
            this.debug('数据不存在')
          }
        }
      })
    }
  },
  created () {
    this.query()
  },
  watch: {
    showTagColumn: function () {
      if (this.showTagColumn === true) {
        this.costRecordColumns = [this.addtionalTagColumn].concat(this.costRecordColumns)
      } else {
        this.costRecordColumns = this.costRecordColumns.filter(elem => elem.title !== this.addtionalTagColumn.title)
      }
    }
  }
}
</script>
