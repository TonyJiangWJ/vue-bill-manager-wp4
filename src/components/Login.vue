<template>
    <div class="login-container">
      <template v-if="!logined">
      <Row type="flex" justify="center" align="middle">
        <Col span="8">用户名:</Col>
        <Col span="12">
          <Tooltip content="请输入用户名" placement="right" :disabled="!showUserNameError" :always="showUserNameError">
            <Input type="text" placeholder="请输入用户名" v-model="userName"/>
          </Tooltip>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle">
        <Col span="8">密&nbsp;&nbsp;&nbsp;码:</Col>
        <Col span="12">
          <Tooltip :content="loginError?'用户名或密码错误':'密码最短6位'" placement="right" :disabled="!(showUserNameError||loginError)" :always="showPwdError||loginError">
            <Input type="password" placeholder="请输入密码" v-model="password"/>
          </Tooltip>
        </Col>
      </Row>
      <Row type="flex" justify="center" align="middle">
        <Col span="8"><Button type="success" @click="doLogin">登录</Button></Col>
        <Col span="8"><Button type="primary" @click="goRegister">注册</Button></Col>
      </Row>
      </template>
      <template v-else>
        <Row type="flex" justify="center" align="middle">
          <Col span="8"><Button type="warning"  @click="logout">退出登录</Button></Col>
        </Row>
      </template>
  </div>
</template>

<script>
import API from '@/js/api'
export default {
  name: 'Login',
  data () {
    return {
      showUserNameError: false,
      showPwdError: false,
      loginError: false,
      userName: '',
      password: '',
      // logined: false,
      redirect: ''
    }
  },
  computed: {
    logined: function () {
      return this.$store.getters['loginStatus/isLogin']
    }
  },
  methods: {
    doLogin: function () {
      if (!this.password || this.password.length < 6) {
        this.showPwdError = true
      } else {
        this.showPwdError = false
      }
      if (!this.userName) {
        this.showUserNameError = true
      } else {
        this.showUserNameError = false
      }
      if (this.showUserNameError || this.showPwdError) {
        return
      }
      let data = {}
      data.userName = this.userName
      data.password = this.password
      API.login(data).then((resp) => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.debug('登录成功')
          this.loginError = false
          this.$store.commit('loginStatus/setLogin')
          if (this.redirect !== '') {
            this.$router.push(this.redirect)
          } else {
            this.$router.push('/')
          }
        } else {
          this.debug('登录失败')
          this.loginError = true
          this.showPwdError = true
        }
      })
    },
    logout: function () {
      API.logout().then((resp) => {
        if (resp.code === API.CODE_CONST.SUCCESS) {
          this.debug('退出成功')
          this.$store.commit('loginStatus/setLogout')
          // this.logined = false
        }
      })
    },
    goRegister: function () {
      this.$router.push('/register')
    }
  },
  watch: {
    password: function () {
      if (!this.password || this.password.length < 6) {
        this.showPwdError = true
      } else {
        this.showPwdError = false
      }
    },
    userName: function () {
      if (!this.userName) {
        this.showUserNameError = true
      } else {
        this.showUserNameError = false
      }
    }
  },
  created () {
    this.$store.dispatch('loginStatus/checkLoginStatus')
    // API.checkLoginStatus().then((resp) => {
    //   if (resp.code === API.CODE_CONST.SUCCESS) {
    //     this.logined = true
    //   } else {
    //     window.localStorage.removeItem('logined')
    //     this.logined = false
    //   }
    // })
  },
  mounted () {
    let redirect
    if (this.$route.params) {
      this.debug('有参数')
      redirect = this.$route.params.redirect
    } else {
      this.debug('无参数')
    }
    if (typeof redirect !== 'undefined' && redirect !== '') {
      this.redirect = redirect.substring(1)
    }
    this.debug('转发路径：' + this.redirect)
  }
}
</script>
<style scoped>
.error {
  color: red;
  font-size: 0.25rem;
  display: block;
  width: 100%;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
}

.login-container > div {
  margin: 0.5rem 0;
}

@media screen and (min-width: 300px) {
  .login-container {
    width: 90%;
    margin: 60px auto 0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 50px 50px 30px;
  }
}

@media screen and (min-width: 450px) {
  .login-container {
    margin: 60px auto 0;
    max-width: 400px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 50px 50px 30px;
  }
}

.button_container {
  margin: 5px;
}
.ivu-tooltip-popper[x-placement^=right] .ivu-tooltip-arrow  {
  border-right-color: rgba(133, 134, 133, 0.82);
}

.ivu-tooltip-inner {
  background-color: rgba(133, 134, 133, 0.82);
}
</style>
