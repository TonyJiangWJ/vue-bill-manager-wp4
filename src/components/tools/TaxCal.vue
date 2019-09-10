<template>
  <div class="tax-container">
    <Row type="flex" justify="center" align="middle">
      <Col :xs="0" :ms="3"></Col>
      <Col :xs="24" :ms="18">
        <div class="main-container">
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>税前工资:</label></Col>
            <Col :xs="12" :sm="8">
              <InputNumber v-model="beforeTax"/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>税后工资:</label></Col>
            <Col :xs="12" :sm="8">
              <InputNumber v-model="newInHandSalary" readonly/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle" v-if="checkBox.showOldTax">
            <Col :xs="12" :sm="8"><label>(旧)税后工资:</label></Col>
            <Col :xs="12" :sm="8">
              <InputNumber v-model="inHandSalary" readonly/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col offset="8"><Button type="success" @click="calculate">计算</Button>&nbsp;
            <Checkbox v-model="checkBox.showOldTax">显示旧个税信息</Checkbox></Col>
          </Row>
          <Divider/>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><Checkbox v-model="checkBox.customSocialPoint">自定义</Checkbox><label>社&nbsp;&nbsp;&nbsp;保起征点:</label></Col>
            <Col :xs="12" :sm="8">
              <InputNumber v-model="socialInsurancePoint" :disabled='!this.checkBox.customSocialPoint' />
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8">
              <Checkbox v-model="checkBox.customProvidentPoint">自定义</Checkbox><label>公积金起征点:</label>
            </Col>
            <Col :xs="12" :sm="8">
              <Row type="flex" justify="center" align="middle">
                <Col :sm="4">
                  <InputNumber v-model="customProvidentPrecent"
                    :max="100"
                    :formatter="value => `${value}%`"
                    :parser="value => value.replace('%', '')"
                    :disabled='!this.checkBox.customProvidentPoint' />
                </Col>
                <Col :sm="20">
                  <InputNumber v-model="providentFundPoint" :disabled='!this.checkBox.customProvidentPoint' />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle" v-if="checkBox.showOldTax">
            <Col :xs="12" :sm="8"><Checkbox v-model="checkBox.customTaxPoint">自定义</Checkbox><label>旧个税起征点:</label></Col>
            <Col :xs="12" :sm="8">
              <InputNumber v-model="taxPoint" :disabled='!this.checkBox.customTaxPoint'/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><Checkbox v-model="checkBox.customNewTaxPoint">自定义</Checkbox><label>新个税起征点:</label></Col>
            <Col :xs="12" :sm="8">
              <InputNumber v-model="config.newTaxPoint" :disabled='!this.checkBox.customNewTaxPoint'/>
            </Col>
          </Row>
          <Divider orientation="left">五险一金明细</Divider>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>养老保险:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="endowmentInsurance" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Input v-model="endowmentInsurancePercent" readonly/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>医疗保险:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="medicalInsurance" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Input v-model="medicalInsurancePercent" readonly/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>失业保险:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="unemploymentInsurance" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Input v-model="unemploymentInsurancePercent" readonly/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>住房公积金:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="providentFund" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Input v-model="providentFundPercent" readonly/>
            </Col>
          </Row>
          <Divider/>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>扣除五险一金后工资:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="afterInsurance" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Input v-model="afterInsurancePercent" readonly/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>应税总额(新/旧):</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="forTaxStr" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Input v-model="forTaxPercentStr" readonly/>
            </Col>
          </Row>
          <Divider/>
          <Row type="flex" justify="center" align="middle" v-if="checkBox.showOldTax">
            <Col :xs="12" :sm="8"><label>旧版个人所得税:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="taxFee" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Tooltip placement="right">
                <Input v-model="taxFeePercent" readonly/>
                <div slot="content">
                  <p v-if="oldTaxCurrentLadder > oldTaxLadder.step1.percent">3% 45</p>
                  <p v-if="oldTaxCurrentLadder > oldTaxLadder.step2.percent">10% 300</p>
                  <p v-if="oldTaxCurrentLadder > oldTaxLadder.step3.percent">20% 900</p>
                  <p v-if="oldTaxCurrentLadder > oldTaxLadder.step4.percent">25% 6500</p>
                  <p v-if="oldTaxCurrentLadder > oldTaxLadder.step5.percent">30% 6000</p>
                  <p v-if="oldTaxCurrentLadder > oldTaxLadder.step5.percent">35% 8750</p>
                  <p>{{oldTaxLadderTips}}</p>
                </div>
              </Tooltip>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>新版个人所得税（5000起征）:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="newTaxFee" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Tooltip placement="right">
                <Input v-model="newTaxFeePercent" readonly/>
                <div slot="content">
                  <p v-if="newTaxCurrentLadder > newTaxLadder.step1.percent">3% 90</p>
                  <p v-if="newTaxCurrentLadder > newTaxLadder.step2.percent">10% 900</p>
                  <p v-if="newTaxCurrentLadder > newTaxLadder.step3.percent">20% 2600</p>
                  <p v-if="newTaxCurrentLadder > newTaxLadder.step4.percent">25% 2500</p>
                  <p v-if="newTaxCurrentLadder > newTaxLadder.step5.percent">30% 6000</p>
                  <p v-if="newTaxCurrentLadder > newTaxLadder.step5.percent">35% 8750</p>
                  <p>{{newTaxLadderTips}}</p>
                </div>
              </Tooltip>
            </Col>
          </Row>
          <Divider/>
          <Row type="flex" justify="center" align="middle">
            <Col :xs="12" :sm="8"><label>新个税到手工资:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="newInHandSalary" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Input v-model="newInHandSalaryPercent" readonly/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle" v-if="checkBox.showOldTax">
            <Col :xs="12" :sm="8"><label>旧个税到手工资:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="inHandSalary" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Input v-model="inHandSalaryPercent" readonly/>
            </Col>
          </Row>
          <Row type="flex" justify="center" align="middle" v-if="checkBox.showOldTax">
            <Col :xs="12" :sm="8"><label>差额:</label></Col>
            <Col :xs="6" :sm="4">
              <Input v-model="balanceBetweenNewOld" readonly/>
            </Col>
            <Col :xs="6" :sm="4">
              <Input v-model="balanceBetweenNewOldPercent" readonly/>
            </Col>
          </Row>
        </div>
      </Col>
      <Col :xs="0" :ms="3"></Col>
    </Row>
  </div>
</template>

<script>
/**
 * 旧个税阶梯百分比和速算扣除数配置
 */
let oldTaxLadder = {
  type: 'old',
  step1: {
    percent: 0.03,
    amount: 1500,
    discount: 0
  },
  step2: {
    percent: 0.1,
    amount: 4500,
    discount: 105
  },
  step3: {
    percent: 0.2,
    amount: 9000,
    discount: 555
  },
  step4: {
    percent: 0.25,
    amount: 35000,
    discount: 1005
  },
  step5: {
    percent: 0.30,
    amount: 55000,
    discount: 2755
  },
  step6: {
    percent: 0.35,
    amount: 80000,
    discount: 5505
  },
  step7: {
    percent: 0.45,
    amount: Infinity,
    discount: 13505
  }
}
/**
 * 新个税阶梯百分比和速算扣除数配置
 */
let newTaxLadder = {
  type: 'new',
  step1: {
    percent: 0.03,
    amount: 3000,
    discount: 0
  },
  step2: {
    percent: 0.1,
    amount: 12000,
    discount: 210
  },
  step3: {
    percent: 0.2,
    amount: 25000,
    discount: 1410
  },
  step4: {
    percent: 0.25,
    amount: 35000,
    discount: 2660
  },
  step5: {
    percent: 0.30,
    amount: 55000,
    discount: 4410
  },
  step6: {
    percent: 0.35,
    amount: 80000,
    discount: 7160
  },
  step7: {
    percent: 0.45,
    amount: Infinity,
    discount: 15160
  }
}

export default {
  name: 'TaxCal',
  data () {
    return {
      beforeTax: 0,
      socialInsurancePoint: 0,
      providentFundPoint: 0,
      taxPoint: 3500,
      endowmentInsurance: 0,
      medicalInsurance: 0,
      unemploymentInsurance: 0,
      providentFund: 0,
      afterInsurance: 0,
      forTax: 0,
      taxFee: 0,
      newTaxFee: 0,
      inHandSalary: 0,
      newInHandSalary: 0,
      balanceBetweenNewOld: 0,
      customProvidentPrecent: 12,
      newTaxLadderTips: '',
      newTaxCurrentLadder: '',
      oldTaxLadderTips: '',
      oldTaxCurrentLadder: '',
      newTaxLadder: newTaxLadder,
      oldTaxLadder: oldTaxLadder,
      config: {
        unemployScale: 0.005,
        endowmentScale: 0.08,
        medicalScale: 0.02,
        newTaxPoint: 5000,
        maxProvidnetFundPoint: 24311,
        maxSocialInsurancePoint: 15274.74
      },
      checkBox: {
        customSocialPoint: false,
        customProvidentPoint: false,
        customTaxPoint: false,
        customNewTaxPoint: false,
        showOldTax: false
      }
    }
  },
  methods: {
    calculate: function () {
      // this.checkMaxPoint()
      this.unemploymentInsurance = (this.socialInsurancePoint * this.config.unemployScale).toFixed(2)
      this.endowmentInsurance = (this.socialInsurancePoint * this.config.endowmentScale).toFixed(2)
      this.medicalInsurance = (this.socialInsurancePoint * this.config.medicalScale).toFixed(2)
      this.providentFund = (this.providentFundPoint * this.providentScale).toFixed(2)
      this.afterInsurance = this.forTax = (
        this.beforeTax - this.socialInsurancePoint * (
          this.config.unemployScale +
          this.config.endowmentScale +
          this.config.medicalScale
        ) - this.providentFundPoint * this.providentScale
      ).toFixed(2)
      this.calTaxFee()
      this.calNewTaxFee()

      this.inHandSalary = (this.afterInsurance - this.taxFee).toFixed(2)
      this.newInHandSalary = (this.afterInsurance - this.newTaxFee).toFixed(2)
      this.balanceBetweenNewOld = (this.newInHandSalary - this.inHandSalary).toFixed(2)
    },
    getPercent: function (subclass, total) {
      return (subclass !== 0 && total !== 0) ? (subclass / total * 100).toFixed(2) + '%' : null
    },
    calTaxFee: function () {
      let taxAmount = this.forTax - this.taxPoint
      this.taxFee = this.getTaxFeeByStep(taxAmount, oldTaxLadder)
    },
    getTaxFee: function (taxAmount, step, preStep, type) {
      if (preStep === null) {
        preStep = {
          amount: 0,
          percent: 0,
          discount: 0
        }
      }
      if (type === 'old') {
        this.oldTaxCurrentLadder = step.percent
        this.oldTaxLadderTips = '当前税率:' + (step.percent * 100) + '% ' +
        '税阶税费：' + ((taxAmount - preStep.amount) * step.percent).toFixed(2)
        this.debug(this.oldTaxLadderTips)
      } else {
        this.newTaxCurrentLadder = step.percent
        this.newTaxLadderTips = '当前税率:' + (step.percent * 100) + '% ' +
        '税阶税费：' + ((taxAmount - preStep.amount) * step.percent).toFixed(2)
        this.debug(this.newTaxLadderTips)
      }
      return taxAmount * step.percent - step.discount
    },
    calNewTaxFee: function () {
      let taxAmount = this.forTax - this.config.newTaxPoint
      this.newTaxFee = this.getTaxFeeByStep(taxAmount, newTaxLadder)
    },
    getTaxFeeByStep: function (taxAmount, taxLadder) {
      let taxFee = 0
      if (taxAmount < taxLadder.step1.amount) {
        taxFee = this.getTaxFee(taxAmount, taxLadder.step1, null, taxLadder.type)
      } else if (taxAmount < taxLadder.step2.amount) {
        taxFee = this.getTaxFee(taxAmount, taxLadder.step2, taxLadder.step1, taxLadder.type)
      } else if (taxAmount < taxLadder.step3.amount) {
        taxFee = this.getTaxFee(taxAmount, taxLadder.step3, taxLadder.step2, taxLadder.type)
      } else if (taxAmount < taxLadder.step4.amount) {
        taxFee = this.getTaxFee(taxAmount, taxLadder.step4, taxLadder.step3, taxLadder.type)
      } else if (taxAmount < taxLadder.step5.amount) {
        taxFee = this.getTaxFee(taxAmount, taxLadder.step5, taxLadder.step4, taxLadder.type)
      } else if (taxAmount < taxLadder.step6.amount) {
        taxFee = this.getTaxFee(taxAmount, taxLadder.step6, taxLadder.step5, taxLadder.type)
      } else {
        taxFee = this.getTaxFee(taxAmount, taxLadder.step7, taxLadder.step6, taxLadder.type)
      }
      return taxFee.toFixed(2)
    },
    checkMaxPoint: function () {
      if (this.socialInsurancePoint > this.config.maxSocialInsurancePoint) {
        this.socialInsurancePoint = this.config.maxSocialInsurancePoint
      }
      if (this.providentFundPoint > this.config.maxProvidnetFundPoint) {
        this.providentFundPoint = this.config.maxProvidnetFundPoint
      }
    }
  },
  computed: {
    providentScale: function () {
      return (this.customProvidentPrecent / 100.0).toFixed(2)
    },
    unemploymentInsurancePercent: function () {
      return this.getPercent(this.unemploymentInsurance, this.beforeTax)
    },
    endowmentInsurancePercent: function () {
      return this.getPercent(this.endowmentInsurance, this.beforeTax)
    },
    medicalInsurancePercent: function () {
      return this.getPercent(this.medicalInsurance, this.beforeTax)
    },
    providentFundPercent: function () {
      return this.getPercent(this.providentFund, this.beforeTax)
    },
    inHandSalaryPercent: function () {
      return this.getPercent(this.inHandSalary, this.beforeTax)
    },
    afterInsurancePercent: function () {
      return this.getPercent(this.afterInsurance, this.beforeTax)
    },
    newInHandSalaryPercent: function () {
      return this.getPercent(this.newInHandSalary, this.beforeTax)
    },
    balanceBetweenNewOldPercent: function () {
      return this.getPercent(this.balanceBetweenNewOld, this.beforeTax)
    },
    taxFeePercent: function () {
      return this.getPercent(this.taxFee, this.beforeTax)
    },
    newTaxFeePercent: function () {
      return this.getPercent(this.newTaxFee, this.beforeTax)
    },
    forTaxPercent: function () {
      return this.getPercent(this.forTax, this.beforeTax)
    },
    forTaxStr: function () {
      return this.forTax === 0 ? null : (this.forTax - this.config.newTaxPoint) + '/' + (this.forTax - this.taxPoint)
    },
    forTaxPercentStr: function () {
      return this.forTax === 0 ? null : this.getPercent((this.forTax - this.config.newTaxPoint), this.beforeTax) + '/' + this.getPercent((this.forTax - this.taxPoint), this.beforeTax)
    }
  },
  watch: {
    beforeTax: function () {
      if (!this.checkBox.customProvidentPoint) {
        this.providentFundPoint = this.beforeTax
      }
      if (!this.checkBox.customSocialPoint) {
        this.socialInsurancePoint = this.beforeTax
      }
      this.checkMaxPoint()
    }
  }
}
</script>

<style scoped>
.tax-container > div {
  margin: 0.5rem 0;
}

@media screen and (min-width: 300px) {
  .main-container {
    width: 90%;
    margin: 50px auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 5px;
  }
}

@media screen and (min-width: 768px) {
  .main-container {
    width: 80%;
    margin: 50px auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 45px;
  }
}
@media screen and (min-width: 900px) {
  .main-container {
    width: 60%;
    margin: 50px auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 45px;
  }
}
@media screen and (min-width: 1200px) {
  .main-container {
    width: 50%;
    margin: 50px auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 45px;
  }
}
</style>
