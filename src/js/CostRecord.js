
export const CostRecord = function (item) {
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