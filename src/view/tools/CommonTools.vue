<template>
  <div>
    <Row type="flex" justify="center" align="top">
      <Col :xs="0" :sm="3"></Col>
      <Col :xs="24" :sm="18">
        <Row>
          <Col span="8"><h3>工具名称</h3></Col>
        </Row>
        <Divider/>
        <Row>
          <Col span="8">时间转换</Col>
          <Col span="8"><h4>当前时间:</h4><span @dblclick="copyNowDateTime">{{nowDateTime}}</span></Col>
          <Col span="8"></Col>
        </Row>
        <Row>
          <Col span="8"></Col>
          <Col span="8" offset="8"><InputNumber v-model="timestamp13" placeholder="timestamp13"/></Col>
          <Col span="8"><Button type="primary" @click="ttString">转换字符串</Button></Col>
        </Row>
        <Row>
          <Col span="8"></Col>
          <Col span="8" offset="8"><Input type="text" v-model="timeString" placeholder="时间字符串"/></Col>
          <Col span="8"><Button type="primary" @click="ttStamp">转换时间戳</Button></Col>
        </Row>
        <Divider/>
        <Row>
          <Col span="8">urlEncode转换</Col>
          <Col span="8"><Input v-model="simpleStr" placeholder="普通字符串" type="text"/></Col>
          <Col span="8"><Button type="primary" @click="doEncode">转换字符串</Button></Col>
        </Row>
        <Row>
          <Col span="8"></Col>
          <Col span="8" offset="8"><Input type="text" v-model="encodeStr" placeholder="URLEncoded"/></Col>
          <Col span="8"><Button type="primary" @click="doDecode">解码字符串</Button></Col>
        </Row>
        <Divider/>
        <Row>
          <Col span="8">Unicode转换</Col>
          <Col span="8"><Input type="textarea" :rows="4" placeholder="unicode" v-model="unicodeStr"/></Col>
          <Col span="8">
            <Button type="primary" @click="convert">解码</Button>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><Input type="textarea" :rows="4" placeholder="converted" v-model="convertedStr"/></Col>
          <Col span="8">
            <Button type="primary" @click="backUnicode">编码</Button>
          </Col>
        </Row>
        <Divider/>
        <Row>
          <Col span="8">时间间隔计算</Col>
          <Col span="8"><DatePicker type="date" placeholder="开始时间" v-model="startDate"></DatePicker></Col>
          <Col span="8"><Button type="primary" @click="calDayBtw">计算时间间隔</Button></Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><DatePicker type="date" placeholder="结束时间" v-model="endDate"></DatePicker></Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><InputNumber v-model="daysBtw" placeholder="间隔天数"/></Col>
          <Col span="8"><Button type="primary" @click="calTargetDate">计算目标日期</Button></Col>
        </Row>
        <Divider/>
        <Row>
          <Col span="8">MD5加密</Col>
          <Col span="8"><Input type="text" v-model="md5source" placeholder="明文"/></Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><Input type="text" v-model="md5_32" placeholder="md5 32位" @dblclick.native="toggleMd32Case"/></Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><Input type="text" v-model="md5_16" placeholder="md5 16位" @dblclick.native="toggleMd16Case"/></Col>
        </Row>
        <Divider/>
        <Row>
          <Col span="8">Base64加解密</Col>
          <Col span="8"><Input type="text" v-model="base64Source" placeholder="明文"/></Col>
          <Col span="8">
            <Button type="primary" @click="encodeBase64">加密</Button>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><Input type="text" v-model="encoded64" placeholder="密文"/></Col>
          <Col span="8">
            <Button type="primary" @click="decodeBase64">解密</Button>
          </Col>
        </Row>
        <Divider/>
        <Row>
          <Col span="8">RSA加密</Col>
          <Col span="8"><Input type="textarea" :rows="4" placeholder="publicKey" v-model="publicKey"/></Col>
          <Col span="8"><Button type="primary" @click="generateRsaKeys">生成密钥</Button></Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><Input type="textarea" :rows="6" placeholder="privateKey" v-model="privateKey"/></Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><Input type="textarea" :rows="6" placeholder="明文" v-model="rsaDecryptContent"/></Col>
          <Col span="8">
            <Button @click="pubEncryptRsa" type="primary">公钥加密</Button>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><Input type="textarea" :rows="6" placeholder="密文" v-model="rsaEncryptContent"/></Col>
          <Col span="8">
            <Button @click="priDecryptRsa" type="primary">私钥解密</Button>
          </Col>
        </Row>
        <Divider/>
        <Row>
          <Col span="8">论文复制</Col>
          <Col span="8"><Input type="textarea" :rows="6" placeholder="原文" v-model="srcStr"/></Col>
          <Col span="8">
            <Button @click="escapeForCN" type="primary">中文去空格</Button>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="8"><Input type="textarea" :rows="6" placeholder="处理后" v-model="destStr"/></Col>
          <Col span="8">
            <Button @click="escapeForEN" type="primary">英文去回车</Button>
          </Col>
        </Row>
      </Col>
      <Col :xs="0" :sm="3"/>
    </Row>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import { md5 } from 'md5js'
import JSEncrypt from 'jsencrypt'

export default {
  name: 'CommonTools',
  data () {
    return {
      timestamp13: null,
      timeString: '',
      displayDays: '',
      simpleStr: '',
      encodeStr: '',
      unicodeStr: '',
      convertedStr: '',
      startDate: '',
      endDate: '',
      daysBtw: null,
      md5source: '',
      md5_32: '',
      md5_16: '',
      base64Source: '',
      encoded64: '',
      publicKey: '',
      privateKey: '',
      rsaEncryptContent: '',
      rsaDecryptContent: '',
      srcStr: '',
      destStr: '',
      nowDateTime: this.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }
  },
  methods: {
    ttString: function () {
      var stamp = this.timestamp13
      stamp = parseFloat(stamp)
      this.timeString = this.dateFormat(new Date(stamp), 'yyyy-MM-dd HH:mm:ss')
    },
    ttStamp: function () {
      this.timestamp13 = new Date(this.timeString).getTime()
    },
    doEncode: function () {
      this.encodeStr = encodeURI(this.simpleStr)
    },
    doDecode: function () {
      this.simpleStr = decodeURI(this.encodeStr)
    },
    convert: function () {
      this.convertedStr = this.convertUtf8(this.unicodeStr)
    },
    convertUtf8: function (encodeStr) {
      var regex = /(\\u)([\dabcdefABCDEF]{4})/
      while (regex.test(encodeStr)) {
        var matchList = regex.exec(encodeStr)
        var c = matchList[2]
        var s = String.fromCharCode(parseInt(c, 16))
        encodeStr = encodeStr.replace(regex, s)
      }
      return encodeStr
    },
    backUnicode: function () {
      var simpleStr = escape(this.convertedStr)
      var regex = /%(u[\dabcdefABCDEF]{4})/
      while (regex.test(simpleStr)) {
        simpleStr = simpleStr.replace(regex, '\\$1')
      }
      simpleStr = unescape(simpleStr)
      this.unicodeStr = simpleStr
    },
    calDayBtw: function () {
      var startDateStr = this.startDate
      var endDateStr = this.endDate
      var timeBetween = (new Date(endDateStr) - new Date(startDateStr)) / (3600 * 24 * 1000)
      this.displayDays = '间隔时间：' + timeBetween
      this.daysBtw = timeBetween
    },
    calTargetDate: function () {
      var startDate = new Date(this.startDate)
      var days = this.daysBtw
      var targetDate = new Date(startDate.getTime() + 3600 * 24 * 1000 * parseInt(days))
      this.endDate = this.dateFormat(new Date(targetDate), 'yyyy-MM-dd')
      this.endDateDisplay = this.dateFormat(new Date(targetDate), 'yyyy-MM-dd')
      this.displayDays = this.dateFormat(new Date(targetDate), 'yyyy-MM-dd EE')
    },
    encodeBase64: function () {
      var encodeStr = Base64.encode(this.base64Source)
      this.encoded64 = encodeStr
    },
    decodeBase64: function () {
      var decodeStr = Base64.decode(this.encoded64)
      this.base64Source = decodeStr
    },
    encodeMd5: function () {
      var source = this.md5source
      this.md5_32 = md5(source, 32)
      this.md5_16 = md5(source)
    },
    generateRsaKeys: function () {
      var encrypt = new JSEncrypt()
      this.publicKey = encrypt.getPublicKey()
      this.privateKey = encrypt.getPrivateKey()
    },
    pubEncryptRsa: function () {
      var encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.publicKey)
      this.rsaEncryptContent = encrypt.encrypt(this.rsaDecryptContent)
    },
    priDecryptRsa: function () {
      var encrypt = new JSEncrypt()
      encrypt.setPrivateKey(this.privateKey)
      this.rsaDecryptContent = encrypt.decrypt(this.rsaEncryptContent)
    },
    escapeForCN: function () {
      var src = this.srcStr
      this.destStr = src.replace(/\s/g, '')
    },
    escapeForEN: function () {
      var src = this.srcStr
      this.destStr = src.replace(/(\n)|(\r\n)/g, '')
    },
    toggleMd32Case: function () {
      var str = this.md5_32
      if (/[a-z]/.test(str)) {
        this.md5_32 = str.toUpperCase()
      } else {
        this.md5_32 = str.toLowerCase()
      }
    },
    toggleMd16Case: function () {
      var str = this.md5_16
      if (/[a-z]/.test(str)) {
        this.md5_16 = str.toUpperCase()
      } else {
        this.md5_16 = str.toLowerCase()
      }
    },
    copyNowDateTime: function () {
      var timeStr = this.nowDateTime
      var time = new Date().getTime()
      this.timeString = timeStr
      this.timestamp13 = time
    },
    intervalRefresh: function () {
      var self = this
      setInterval(function () {
        self.nowDateTime = self.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }, 1000)
    }
  },
  mounted () {
    this.intervalRefresh()
  }
}
</script>
