<template>
  <div>
    <Drawer title="账单详情" v-model="innerShowDrawer" :width="drawerWidth">
      <div>
        <Row>
          <i-col span="8">
            <p>账单编号:</p>
          </i-col>
          <i-col span="16">{{detail.tradeNo}}</i-col>
        </Row>
        <Row>
          <i-col span="8">订单编号:</i-col>
          <i-col span="16">{{detail.orderNo}}</i-col>
        </Row>
        <Row>
          <i-col span="8">创建时间:</i-col>
          <i-col span="16">{{detail.createTime}}</i-col>
        </Row>
        <Row>
          <i-col span="8">支付时间:</i-col>
          <i-col span="16">{{detail.paidTime}}</i-col>
        </Row>
        <Row>
          <i-col span="8">修改时间:</i-col>
          <i-col span="16">{{detail.modifyTime}}</i-col>
        </Row>
        <Row>
          <i-col span="8">交易对方:</i-col>
          <i-col span="16">{{detail.target}}</i-col>
        </Row>
        <Row>
          <i-col span="8">金额:</i-col>
          <i-col span="16">{{detail.money}}</i-col>
        </Row>
        <Row>
          <i-col span="8">账单状态:</i-col>
          <i-col span="16">{{detail.tradeStatus}}</i-col>
        </Row>
        <Row>
          <i-col span="8">收支类型:</i-col>
          <i-col span="16">{{detail.inOutType}}</i-col>
        </Row>
        <Row>
          <i-col span="8">订单状态:</i-col>
          <i-col span="16">{{detail.orderStatus}}</i-col>
        </Row>
        <Row>
          <i-col span="8">服务手续费:</i-col>
          <i-col span="16">{{detail.serviceCost}}</i-col>
        </Row>
        <Row>
          <i-col span="8">退款:</i-col>
          <i-col span="16">{{detail.refundMoney}}</i-col>
        </Row>
        <Row type="flex" align="middle">
          <i-col span="8">交易类型:</i-col>
          <i-col span="16">
            <Input type="text" v-model="detail.orderType"/>
          </i-col>
        </Row>
        <Row type="flex" align="middle">
          <i-col span="8">交易地点:</i-col>
          <i-col span="16">
            <Input type="text" v-model="detail.location"/>
          </i-col>
        </Row>
        <Row type="flex" align="middle">
          <i-col span="8">商品名:</i-col>
          <i-col span="16">
            <Input type="text" v-model="detail.goodsName"/>
          </i-col>
        </Row>
        <Row type="flex" align="middle">
          <i-col span="8">备注:</i-col>
          <i-col span="16">
            <Input type="text" v-model="detail.memo"/>
          </i-col>
        </Row>
        <Row type="flex" align="middle">
          <i-col span="8">是否已删除</i-col>
          <i-col span="16">
            <Button size="small" @click="toggleDelete" :type="detail.isDeleted==='未删除'?'success':'error'" ghost>{{detail.isDeleted}}</Button>
          </i-col>
        </Row>
        <Row type="flex" align="middle">
          <i-col span="8">是否显示</i-col>
          <i-col span="16">
            <Button size="small" @click="toggleHide" :type="detail.isHidden==='显示'?'success':'error'" ghost>{{detail.isHidden}}</Button>
          </i-col>
        </Row>
        <Divider />
        <Row type="flex" align="middle">
          <i-col span="8">标签:</i-col>
          <i-col span="16">
            <Tag v-for="(tag,index) in detail.tagInfos" type="border" :key="tag.id" :color="tagColors[index % tagColors.length]">{{tag.tagName}}</Tag>
          </i-col>
        </Row>
        <Divider />
        <Row type="flex" align="middle">
          <i-col span="8">操作</i-col>
          <i-col span="12">
            <Row :gutter="16">
              <i-col>
                <Button class="gap-5" type="success" @click="manageRecordTag">关联标签</Button>
              </i-col>
              <i-col>
                <Button class="gap-5" type="success" @click="saveRecordChange()">保存修改</Button>
              </i-col>
            </Row>
          </i-col>
        </Row>
      </div>
    </Drawer>
    <tag-manage :record-id-list="[detail.id]" :bound-tag-list="detail.tagInfos"
      @reload-records="reloadDetail"
      v-model="showTagManage"/>
  </div>
</template>

<script>

import API from '@/js/api.js'
import TagManage from '@/components/bills/billRecord/TagManage.vue'
import { CostRecord } from '@/js/CostRecord.js'

export default {
  name: "RecordDetailDrawer",
  components: {
    TagManage
  },
  model: {
    prop: 'showDrawer',
    event: 'change'
  },
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    tradeNo: {
      type: String
    },
    tagColors: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      detail: {},
      boundTagList: [],
      showTagManage: false,
      innerShowDrawer: this.showDrawer
    }
  },
  watch: {
    innerShowDrawer: function (n) {
      if (n === false) {
        this.$debug('隐藏drawer')
        this.$emit('change', n)
      }
    },
    showDrawer: function (n) {
      this.innerShowDrawer = n
    },
    tradeNo: function (n, o) {
      this.$debug('账单选择变更：' + n)
      if (n !== o) {
        this.reloadDetail()
      }
    }
  },
  computed: {
    drawerWidth: function () {
      let width = document.documentElement.clientWidth
      this.$debug(width)
      let drawerWidth = width / 2 > 256 ? width / 2 : 256
      if (drawerWidth > 500) {
        drawerWidth = 500
      }
      return drawerWidth
    }
  },
  methods: {
    reloadDetail: function() {
      this.$emit('requery-list')
      let request = {
        tradeNo: this.tradeNo
      }
      API.loadRecordDetail(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.detail = new CostRecord(resp.recordDetail)
        } else {
          this.detail = {}
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
          this.$emit('requery-list')
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
          this.$debug('标记删除')
          API.toggleRecordDelete({
            nowStatus: nowStatus ? '1' : '0',
            tradeNo: self.detail.tradeNo
          }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              self.detail.isDeleted = newStatus
              self.$emit('requery-list')
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
          self.$debug('标记显示')
          API.toggleRecordHide({
            nowStatus: nowStatus ? '1' : '0',
            tradeNo: self.detail.tradeNo
          }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              self.detail.isHidden = newStatus
              self.$emit('requery-list')
            }
          })
        }
      })
    },
    manageRecordTag: function () {
      this.showTagManage = true
    }
  }
}
</script>
