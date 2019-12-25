<template>
  <div>
    <Drawer title="标签管理" v-model="innerShowTagManage">
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
          v-for="(tag,index) in boundTagList"
          :key="tag.tagId"
          type="border"
          :color="tagColors[index % tagColors.length]"
          closable
          @on-close="removeTagFromRecords(tag.tagId)"
        >{{tag.tagName}}</Tag>
      </Row>
    </Drawer>
    <Modal v-model="addTagModal" title="添加标签信息" :width="380" @on-ok="doCreateTag">
      <Row type="flex" align="middle">
        <i-col span="8">标签名称</i-col>
        <i-col span="16">
          <Input type="text" v-model="newTag.tagName"/>
        </i-col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import API from '@/js/api.js'

export default {
  name: 'TagManage',
  model: {
    prop: 'showTagManage',
    event: 'change'
  },
  props: {
    boundTagList: {
      type: Array,
      default: () => {
        return []
      }
    },
    recordIdList: {
      type: Array,
      default: () => {
        return []
      }
    },
    showTagManage: {
      type: Boolean,
      default: false
    },
    tagColors: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      newTag: {},
      communalTags: this.boundTagList,
      innerShowTagManage: this.showTagManage,
      addTagModal: false,
      removeTagMode: false,
      showTagColumn: false,
      allTagList: []
    }
  },
  watch: {
    showTagManage: function(n, o) {
      this.innerShowTagManage = n
    },
    innerShowTagManage: function(n, o) {
      this.$emit('change', n)
    }
  },
  methods: {
    addTagToRecords: function(tagId) {
      let request = {
        tagId: tagId,
        costIds: this.recordIdList
      }
      API.batchAddTagToRecords(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          API.loadCommunalTagsFromRecords(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.$debug(resp.tagInfoModels)
              this.communalTags = resp.tagInfoModels
            } else {
              this.communalTags = []
            }
          })
          this.$emit('reload-records')
        }
      })
    },
    removeTagFromRecords: function(tagId) {
      let request = {
        tagId: tagId,
        costIds: this.recordIdList
      }
      API.batchRemoveTagFromRecords(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          API.loadCommunalTagsFromRecords(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.$debug(resp.tagInfoModels)
              this.communalTags = resp.tagInfoModels
            } else {
              this.communalTags = []
            }
          })
          this.$emit('reload-records')
        }
      })
    },
    removeTags: function() {
      this.removeTagMode = !this.removeTagMode
    },
    doRemoveTag: function(tagId) {
      let self = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定要删除该标签吗',
        onOk: function() {
          self.$debug('删除标签')
          API.deleteTag({
            tagId: tagId
          }).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              self.$debug('删除成功')
              self.getAllTagList()
              API.loadRecordTagList({ tradeNo: self.detail.tradeNo }).then(resp => {
                if (resp.code === API.CODE_CONST.SUCCESS) {
                  self.detail.tagInfos = resp.tagInfoModels
                } else if (resp.code === API.CODE_CONST.DATA_NOT_EXIST) {
                  self.detail.tagInfos = []
                }
              })
              this.$emit('reload-records')
            }
          })
        },
        onCancel: function() {
          this.$debug('取消删除')
        }
      })
    },
    createTag: function() {
      this.addTagModal = true
    },
    doCreateTag: function() {
      let request = {
        tagName: this.newTag.tagName
      }
      API.tagNameUnique(request).then(resp => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          API.addTag(request).then(resp => {
            if (resp.code === API.CODE_CONST.SUCCESS) {
              this.$debug('添加成功')
              this.getAllTagList()
              this.newTag.tagName = ''
            } else {
              this.$Message.warning('标签名称添加失败，' + resp.msg)
            }
          })
        } else {
          this.$Message.warning('标签名称重复')
        }
      })
      this.$debug('addTag' + request.tagName)
    },
    toggleTagColumn: function() {
      this.showTagColumn = !this.showTagColumn
      if (this.showTagColumn) {
        this.query()
      }
    },
    getAllTagList: function() {
      API.loadAllTagList({}).then(resp => {
        this.allTagList = []
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.allTagList = resp.tagInfoList
        }
      })
    }
  },
  mounted() {
    this.getAllTagList()
  }
}
</script>
