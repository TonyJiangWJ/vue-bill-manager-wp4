<!--
 * @Author: TonyJiangWJ
 * @Date: 2019-12-25 18:43:15
 * @Last Modified by: TonyJiangWJ
 * @Last Modified time: 2020-01-09 15:39:31
 * @Description: 
 -->
<template>
  <div>
    <Row>
      <i-col span="8">
        <h3>工具名称</h3>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8">时间转换</i-col>
      <i-col span="8">
        <h4>当前时间:</h4>
        <span @dblclick="copyNowDateTime">{{nowDateTime}}</span>
      </i-col>
      <i-col span="8"></i-col>
    </Row>
    <Row>
      <i-col span="8"></i-col>
      <i-col span="8" offset="8">
        <InputNumber v-model="timestamp13" placeholder="timestamp13" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="ttString">转换字符串</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8"></i-col>
      <i-col span="8" offset="8">
        <Input type="text" v-model="timeString" placeholder="时间字符串" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="ttStamp">转换时间戳</Button>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8">urlEncode转换</i-col>
      <i-col span="8">
        <Input v-model="simpleStr" placeholder="普通字符串" type="text" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="doEncode">转换字符串</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8"></i-col>
      <i-col span="8" offset="8">
        <Input type="text" v-model="encodeStr" placeholder="URLEncoded" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="doDecode">解码字符串</Button>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8">Unicode转换</i-col>
      <i-col span="8">
        <Input type="textarea" :rows="4" placeholder="unicode" v-model="unicodeStr" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="convert">解码</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="textarea" :rows="4" placeholder="converted" v-model="convertedStr" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="backUnicode">编码</Button>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8">时间间隔计算</i-col>
      <i-col span="8">
        <DatePicker type="date" placeholder="开始时间" v-model="startDate"></DatePicker>
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="calDayBtw">计算时间间隔</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <DatePicker type="date" placeholder="结束时间" v-model="endDate"></DatePicker>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <InputNumber v-model="daysBtw" placeholder="间隔天数" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="calTargetDate">计算目标日期</Button>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8">MD5加密</i-col>
      <i-col span="8">
        <Input type="text" v-model="md5source" placeholder="明文" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="encodeMd5">加密</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="text" v-model="md5_32" placeholder="md5 32位" @dblclick.native="toggleMd32Case" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="text" v-model="md5_16" placeholder="md5 16位" @dblclick.native="toggleMd16Case" />
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8">Base64加解密</i-col>
      <i-col span="8">
        <Input type="text" v-model="base64Source" placeholder="明文" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="encodeBase64">加密</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="text" v-model="encoded64" placeholder="密文" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="decodeBase64">解密</Button>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8">AES加密</i-col>
      <i-col span="8">
        <Input type="textarea" :rows="2" placeholder="请输入AES秘钥" v-model="aesKey" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="textarea" :rows="6" placeholder="明文" v-model="aesDecryptContent" />
      </i-col>
      <i-col span="8">
        <Button @click="doAesEncrypt" type="primary">加密</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="textarea" :rows="6" placeholder="密文" v-model="aesEncryptContent" />
      </i-col>
      <i-col span="8">
        <Button @click="doAesDecrypt" type="primary">解密</Button>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8">RSA加密</i-col>
      <i-col span="8">
        <Input type="textarea" :rows="4" placeholder="publicKey" v-model="publicKey" />
      </i-col>
      <i-col span="8">
        <Button type="primary" @click="generateRsaKeys">生成密钥</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="textarea" :rows="6" placeholder="privateKey" v-model="privateKey" />
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="textarea" :rows="6" placeholder="明文，最大长度117位" v-model="rsaDecryptContent" :maxlength="117" />
      </i-col>
      <i-col span="8">
        <Button @click="pubEncryptRsa" type="primary">公钥加密</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="textarea" :rows="6" placeholder="密文" v-model="rsaEncryptContent" />
      </i-col>
      <i-col span="8">
        <Button @click="priDecryptRsa" type="primary">私钥解密</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="textarea" :rows="3" placeholder="签名" v-model="rsaSignature" />
      </i-col>
      <i-col span="8">
        <Button @click="doRsaSign" type="primary" size="small" class="v-btn">生成签名</Button>
        <Button @click="doVerifyRsaSign" type="primary" size="small" class="v-btn">验证签名</Button>
      </i-col>
    </Row>
    <Divider />
    <Row>
      <i-col span="8">论文复制</i-col>
      <i-col span="8">
        <Input type="textarea" :rows="6" placeholder="原文" v-model="srcStr" />
      </i-col>
      <i-col span="8">
        <Button @click="escapeForCN" type="primary">中文去空格</Button>
      </i-col>
    </Row>
    <Row>
      <i-col span="8" offset="8">
        <Input type="textarea" :rows="6" placeholder="处理后" v-model="destStr" />
      </i-col>
      <i-col span="8">
        <Button @click="escapeForEN" type="primary">英文去回车</Button>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import { md5 } from 'md5js'
import JSEncrypt from 'jsencrypt'
import CryptoJS from 'crypto-js'

export default {
  name: 'CommonTools',
  data() {
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
      rsaSignature: '',
      srcStr: '',
      destStr: '',
      nowDateTime: this.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      aesKey: '',
      aesEncryptContent: '',
      aesDecryptContent: ''
    }
  },
  methods: {
    ttString: function() {
      let stamp = this.timestamp13
      stamp = parseFloat(stamp)
      this.timeString = this.dateFormat(new Date(stamp), 'yyyy-MM-dd HH:mm:ss')
    },
    ttStamp: function() {
      this.timestamp13 = new Date(this.timeString).getTime()
    },
    doEncode: function() {
      this.encodeStr = encodeURI(this.simpleStr)
    },
    doDecode: function() {
      this.simpleStr = decodeURI(this.encodeStr)
    },
    convert: function() {
      this.convertedStr = this.convertUtf8(this.unicodeStr)
    },
    convertUtf8: function(encodeStr) {
      let regex = /(\\u)([\dabcdefABCDEF]{4})/
      while (regex.test(encodeStr)) {
        let matchList = regex.exec(encodeStr)
        let c = matchList[2]
        let s = String.fromCharCode(parseInt(c, 16))
        encodeStr = encodeStr.replace(regex, s)
      }
      return encodeStr
    },
    backUnicode: function() {
      let simpleStr = escape(this.convertedStr)
      let regex = /%(u[\dabcdefABCDEF]{4})/
      while (regex.test(simpleStr)) {
        simpleStr = simpleStr.replace(regex, '\\$1')
      }
      simpleStr = unescape(simpleStr)
      this.unicodeStr = simpleStr
    },
    calDayBtw: function() {
      let startDateStr = this.startDate
      let endDateStr = this.endDate
      let timeBetween = (new Date(endDateStr) - new Date(startDateStr)) / (3600 * 24 * 1000)
      this.displayDays = '间隔时间：' + timeBetween
      this.daysBtw = timeBetween
    },
    calTargetDate: function() {
      let startDate = new Date(this.startDate)
      let days = this.daysBtw
      let targetDate = new Date(startDate.getTime() + 3600 * 24 * 1000 * parseInt(days))
      this.endDate = this.dateFormat(new Date(targetDate), 'yyyy-MM-dd')
      this.endDateDisplay = this.dateFormat(new Date(targetDate), 'yyyy-MM-dd')
      this.displayDays = this.dateFormat(new Date(targetDate), 'yyyy-MM-dd EE')
    },
    encodeBase64: function() {
      let encodeStr = Base64.encode(this.base64Source)
      this.encoded64 = encodeStr
    },
    decodeBase64: function() {
      let decodeStr = Base64.decode(this.encoded64)
      this.base64Source = decodeStr
    },
    encodeMd5: function() {
      let source = this.md5source
      this.md5_32 = md5(source, 32)
      this.md5_16 = md5(source)
    },
    doAesEncrypt: function() {
      let aesEncrypt = CryptoJS.AES.encrypt('this.decryptedStr', '123456')
      this.$debug('test encrypt:' + aesEncrypt)
      if (this.$isNotEmpty(this.aesKey)) {
        if (this.$isNotEmpty(this.aesDecryptContent)) {
          // debugger
          this.$debug('明文：' + this.aesDecryptContent + ' 秘钥：' + this.aesKey)
          this.aesEncryptContent = CryptoJS.AES.encrypt(this.aesDecryptContent, this.aesKey).toString()
        } else {
          this.$Message.error('请输入明文信息')
        }
      } else {
        this.$Message.error('请输入AES秘钥')
      }
    },
    doAesDecrypt: function() {
      if (this.$isNotEmpty(this.aesKey)) {
        if (this.$isNotEmpty(this.aesEncryptContent)) {
          try {
            this.aesDecryptContent = CryptoJS.AES.decrypt(this.aesEncryptContent, this.aesKey).toString(CryptoJS.enc.Utf8)
          } catch (e) {
            this.$Message.error('秘钥不正确')
          }
        } else {
          this.$Message.error('请输入密文信息')
        }
      } else {
        this.$Message.error('请输入AES秘钥')
      }
    },
    generateRsaKeys: function() {
      let encrypt = new JSEncrypt()
      this.publicKey = encrypt.getPublicKey()
      this.privateKey = encrypt.getPrivateKey()
    },
    pubEncryptRsa: function() {
      let encrypt = new JSEncrypt()
      if (!this.$isNotEmpty(this.publicKey)) {
        this.$Message.error('请先生成或输入公钥')
        return
      }
      encrypt.setPublicKey(this.publicKey)
      if (!this.$isNotEmpty(this.rsaDecryptContent)) {
        this.$Message.error('请先生输入明文')
        return
      }
      this.rsaEncryptContent = encrypt.encrypt(this.rsaDecryptContent)
    },
    priDecryptRsa: function() {
      let encrypt = new JSEncrypt()
      if (!this.$isNotEmpty(this.privateKey)) {
        this.$Message.error('请先生成或输入私钥')
        return
      }
      encrypt.setPrivateKey(this.privateKey)
      if (!this.$isNotEmpty(this.rsaEncryptContent)) {
        this.$Message.error('请先生输入密文')
        return
      }
      this.rsaDecryptContent = encrypt.decrypt(this.rsaEncryptContent)
    },
    doRsaSign: function () {
      if (!this.$isNotEmpty(this.rsaEncryptContent)) {
        this.$Message.error('请生成或输入密文')
        return
      }
      if (!this.$isNotEmpty(this.privateKey)) {
        this.$Message.error('请输入私钥或生成私钥')
        return
      }
      this.rsaSignature = this.signature(this.rsaEncryptContent)
    },
    doVerifyRsaSign: function () {
      if (!this.$isNotEmpty(this.rsaEncryptContent)) {
        this.$Message.error('请输入密文')
        return
      }
      if (!this.$isNotEmpty(this.rsaSignature)) {
        this.$Message.error('请输入签名')
        return
      }
      if (!this.$isNotEmpty(this.publicKey)) {
        this.$Message.error('请输入公钥或生成公钥')
        return
      }
      if(this.verify(this.rsaEncryptContent, this.rsaSignature)) {
        this.$Message.success('验证成功')
      } else {
        this.$Message.error('验证失败')
      }
    },
    signature: function(content) {
      let sign = new JSEncrypt()
      sign.setPrivateKey(this.privateKey)
      return sign.sign(content, CryptoJS.SHA256, 'sha256')
    },
    verify: function(content, signature) {
      let verify = new JSEncrypt()
      verify.setPublicKey(this.publicKey)
      return verify.verify(content, signature, CryptoJS.SHA256)
    },
    escapeForCN: function() {
      let src = this.srcStr
      this.destStr = src.replace(/\s/g, '')
    },
    escapeForEN: function() {
      let src = this.srcStr
      this.destStr = src.replace(/(\n)|(\r\n)/g, '')
    },
    toggleMd32Case: function() {
      let str = this.md5_32
      if (/[a-z]/.test(str)) {
        this.md5_32 = str.toUpperCase()
      } else {
        this.md5_32 = str.toLowerCase()
      }
    },
    toggleMd16Case: function() {
      let str = this.md5_16
      if (/[a-z]/.test(str)) {
        this.md5_16 = str.toUpperCase()
      } else {
        this.md5_16 = str.toLowerCase()
      }
    },
    copyNowDateTime: function() {
      let timeStr = this.nowDateTime
      let time = new Date().getTime()
      this.timeString = timeStr
      this.timestamp13 = time
    },
    intervalRefresh: function() {
      let self = this
      setInterval(function() {
        self.nowDateTime = self.dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }, 1000)
    }
  },
  mounted() {
    this.intervalRefresh()
  }
}
</script>
