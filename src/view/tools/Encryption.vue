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
    <Row justify="center" type="flex">
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
      privateKeyStatus: false
    }
  },
  methods: {
    generateKeys: function() {
      var flag = true
      if (this.myPrivateKey) {
        if (!confirm('确定生成新的密钥对吗？此操作之后原先的加密内容将无法解密')) {
          flag = false
        }
      }
      if (flag) {
        this.$debug('生成密钥对')
        var encrypt = new JSEncrypt()
        this.myPubKey = encrypt.getPublicKey()
        this.myPrivateKey = encrypt.getPrivateKey()
      }
    },
    encrypt: function() {
      this.$debug('加密')
      var encrypt = new JSEncrypt()
      if (this.targetPubKey) {
        encrypt.setPublicKey(this.targetPubKey)

        var contents = this.decryptedStr
        var contentArray = []
        while (contents.length > 117) {
          contentArray.push(contents.substring(0, 117))
          contents = contents.substring(117)
        }
        if (contents.length > 0) {
          contentArray.push(contents)
        }
        var result = ''
        for (var i = 0; i < contentArray.length; i++) {
          result += encrypt.encrypt(contentArray[i])
          if (i < contentArray.length - 1) {
            result += ';'
          }
        }

        this.encryptedStr = result
        this.$debug('明文：' + this.decryptedStr + '结果：' + this.encryptedStr)
      } else {
        alert('请输入对方的公钥')
      }
    },
    decrypt: function() {
      this.$debug('解密')
      if (this.myPrivateKey) {
        var encrypt = new JSEncrypt()
        encrypt.setPrivateKey(this.myPrivateKey)

        var encryptContents = this.encryptedStr
        var contentArray = encryptContents.split(';')
        var result = ''
        for (var i = 0; i < contentArray.length; i++) {
          result += encrypt.decrypt(contentArray[i])
          if (result === 'false') {
            alert('请检查传递给对方的公钥是否正确')
            return
          }
        }
        this.decryptedStr = result
        if (this.decryptedStr === false) {
          alert('请检查传递给对方的公钥是否正确')
        }
      } else {
        alert('请先生成本地密钥对')
      }
    },
    togglePrivateKey: function() {
      this.privateKeyStatus = !this.privateKeyStatus
    }
  },
  mounted() {
    var clipboard = new ClipboardJS('.clip-btn')
    let self = this
    clipboard.on('success', function(e) {
      self.$debug('复制成功')
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
