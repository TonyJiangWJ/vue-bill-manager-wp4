<template>
  <div>
    <Row>
      <i-col>
        <h2>基础RSA加密通信</h2>
      </i-col>
    </Row>
    <Divider orientation="left">
      <Row style="width:80px;">
        <i-col span="12">密文</i-col>
        <i-col span="12">
          <Button size="small" class="clip-btn" :data-clipboard-text="encryptedStr">copy</Button>
        </i-col>
      </Row>
    </Divider>
    <Row>
      <i-col span="22" offset="1">
        <Input type="textarea" :rows="4" v-model="encryptedStr" placeholder="密文" />
      </i-col>
    </Row>
    <Divider orientation="left">
      <Row style="width:80px;">
        <i-col span="12">明文</i-col>
        <i-col span="12">
          <Button size="small" class="clip-btn" :data-clipboard-text="decryptedStr">copy</Button>
        </i-col>
      </Row>
    </Divider>
    <Row>
      <i-col span="22" offset="1">
        <Input type="textarea" :rows="4" v-model="decryptedStr" placeholder="明文" />
      </i-col>
    </Row>
    <Row justify="center" type="flex" align="middle">
      <i-col span="8">
        <Row justify="center" type="flex" align="middle">
          <i-col>
            <span>是否验证签名:</span>
          </i-col>
          <i-col>
            <i-switch v-model="verifySignature">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </i-col>
        </Row>
      </i-col>
      <i-col span="4">
        <Button @click="encrypt" type="primary">加密</Button>
      </i-col>
      <i-col span="4">
        <Button @click="decrypt" type="primary">解密</Button>
      </i-col>
    </Row>
    <Divider orientation="left">对方的公钥</Divider>
    <Row>
      <i-col span="22" offset="1">
        <Input type="textarea" :rows="4" placeholder="对方的公钥" v-model="targetPubKey" />
      </i-col>
    </Row>
    <Row type="flex" justify="center" align="top">
      <i-col>
        <Button @click="generateKeys" type="warning">生成密钥对</Button>
      </i-col>
    </Row>
    <Divider orientation="left">
      <Row style="width:120px">
        <i-col span="12">我的公钥</i-col>
        <i-col span="12">
          <Button class="clip-btn" size="small" :data-clipboard-text="myPubKey">copy</Button>
        </i-col>
      </Row>
    </Divider>
    <Row>
      <i-col span="22" offset="1">
        <Input type="textarea" placeholder="我的公钥" :rows="4" readonly v-model="myPubKey" />
      </i-col>
    </Row>
    <Divider orientation="left">
      <Row style="width:120px">
        <i-col span="12">我的私钥</i-col>
        <i-col span="12">
          <Button size="small" @click="togglePrivateKey">{{privateKeyStatus?'隐藏':'显示'}}</Button>
        </i-col>
      </Row>
    </Divider>
    <Row>
      <i-col span="22" offset="1">
        <Input type="textarea" placeholder="我的私钥" :rows="6" :style="(privateKeyStatus?'':'display:none')" readonly v-model="myPrivateKey" />
      </i-col>
    </Row>
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt'
import CryptoJS from 'crypto-js'
import ClipboardJS from 'clipboard'

export default {
  name: 'Encryption',
  data() {
    return {
      encryptedStr: '',
      decryptedStr: '',
      targetPubKey: '',
      myPubKey: '',
      myPrivateKey: '',
      privateKeyStatus: false,
      verifySignature: false
    }
  },
  methods: {
    generateKeys: function() {
      if (this.myPrivateKey) {
        let that = this
        this.$Modal.confirm({
          title: '确定生成新的密钥对吗？',
          content: '此操作之后原先的加密内容将无法解密',
          onOk: function() {
            that.doGenerateKeys()
          }
        })
      } else {
        this.doGenerateKeys()
      }
    },
    doGenerateKeys: function () {
        this.$debug('生成密钥对')
        let encrypt = new JSEncrypt()
        this.myPubKey = encrypt.getPublicKey()
        this.myPrivateKey = encrypt.getPrivateKey()
    },
    messageError: function(content) {
      this.$Message.error({
        background: true,
        content: content
      })
    },
    generateRandomAesKey: function() {
      return parseInt(Math.random(new Date().getTime()) * Math.pow(10, 16)).toString(16)
    },
    signature: function(content) {
      let sign = new JSEncrypt()
      sign.setPrivateKey(this.myPrivateKey)
      return sign.sign(content, CryptoJS.SHA256, 'sha256')
    },
    verify: function(content, signature) {
      let verify = new JSEncrypt()
      verify.setPublicKey(this.targetPubKey)
      return verify.verify(content, signature, CryptoJS.SHA256)
    },
    encrypt: function() {
      this.$debug('加密')
      let encrypt = new JSEncrypt()
      if (typeof this.decryptedStr === 'undefined' || this.decryptedStr === '') {
        this.messageError('请输入明文再加密')
        return
      }
      if (this.targetPubKey) {
        encrypt.setPublicKey(this.targetPubKey)

        let aesKey = this.generateRandomAesKey()
        let aesEncrypt = CryptoJS.AES.encrypt(this.decryptedStr, aesKey)

        let encryptedAesKey = encrypt.encrypt(aesKey)
        this.$debug('encrypt aes key length:' + encryptedAesKey.length)

        let result = encryptedAesKey + aesEncrypt
        if (this.verifySignature) {
          let signature = this.signature(result)
          this.$debug('sign for result: ' + signature)
          this.$debug('signature length: ' + signature.length)
          result = signature + result
        }
        this.encryptedStr = result
        this.$debug('明文：' + this.decryptedStr + '结果：' + this.encryptedStr)
      } else {
        this.messageError('请输入对方的公钥')
      }
    },
    decrypt: function() {
      this.$debug('解密')
      if (this.myPrivateKey) {
        let encrypt = new JSEncrypt()
        encrypt.setPrivateKey(this.myPrivateKey)
        let encryptedContent = this.encryptedStr
        if (encryptedContent.length < 172) {
          this.messageError('密文不正确')
          return
        }
        if (this.verifySignature) {
          if (encryptedContent.length < 172 * 2) {
            this.messageError('密文不正确')
            return
          }
          let signature = encryptedContent.substring(0, 172)
          encryptedContent = encryptedContent.substring(172)
          if (!this.verify(encryptedContent, signature)) {
            this.messageError('签名不正确')
            return
          }
        }

        let encryptedAesKey = encryptedContent.substring(0, 172)
        let aesKey = encrypt.decrypt(encryptedAesKey)
        if (aesKey === 'false') {
          this.messageError('请检查传递给对方的公钥是否正确')
          return
        }
        encryptedContent = encryptedContent.substring(172)
        try {
          let result = CryptoJS.AES.decrypt(encryptedContent, aesKey).toString(CryptoJS.enc.Utf8)
          this.decryptedStr = result
        } catch (e) {
          this.messageError('密文解密失败，请检查对方公钥是否正确以及双方是否开启签名')
          return
        }
        if (!this.decryptedStr) {
          this.messageError('请检查传递给对方的公钥是否正确')
        }
      } else {
        this.messageError('请先生成本地密钥对')
      }
    },
    togglePrivateKey: function() {
      this.privateKeyStatus = !this.privateKeyStatus
    }
  },
  mounted() {
    let clipboard = new ClipboardJS('.clip-btn')
    let self = this
    clipboard.on('success', function() {
      self.$Message.success('复制成功')
    })
  }
}
</script>

<style scoped>
.contain {
  text-align: center;
}

.contain > div {
  margin: 5px 5px;
}

.contain > div > label {
  display: block;
  float: left;
}

.contain > div > textarea {
  resize: none;
  width: 100%;
}
</style>
