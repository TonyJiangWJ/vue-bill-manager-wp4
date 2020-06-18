<template>
  <div>
    <Row :gutter="16">
      <i-col span="4">服务地址</i-col>
      <i-col span="6">
        <Input type="text" placeholder="host" v-model="host" />
      </i-col>
      <i-col span="6">
        <Input type="text" placeholder="port" v-model="port" />
      </i-col>
    </Row>
    <Row type="flex" justify="start">
      <i-col offset="4">
        <Button size="small" type="primary" @click="getAllConnect">查看所有连接</Button>
        <Button size="small" type="primary" @click="getAllService">查看所有服务</Button>
        <Button size="small" type="primary" @click="checkAll">测试服务列表</Button>
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="4">接口</i-col>
      <i-col span="6">
        <Input type="text" v-model="functionId" />
      </i-col>
      <i-col span="4">
        <Button size="small" @click="checkFunc" type="primary">测试接口</Button>
        <Button size="small" @click="refresh">刷新</Button>
      </i-col>
    </Row>
    <template v-if="hostsHistoryList.length>0">
      <Divider orientation="left">hosts</Divider>
      <Row type="flex" justify="start">
        <i-col>
          <Tag
            v-for="host in hostsHistoryList"
            :key="host"
            type="border"
            color="blue"
            @dblclick.native="replaceHost(host)"
            closable
            @on-close="removeHost(host)"
          >{{host}}</Tag>
        </i-col>
      </Row>
    </template>
    <template v-if="portHistoryList.length>0">
      <Divider orientation="left">port</Divider>
      <Row type="flex" justify="start">
        <i-col>
          <Tag
            v-for="port in portHistoryList"
            :key="port"
            type="border"
            color="green"
            @dblclick.native="replacePort(port)"
            closable
            @on-close="removePort(port)"
          >{{port}}</Tag>
        </i-col>
      </Row>
    </template>
    <Row>
      <i-col>
        <iframe :src="testServerUrl" width="100%" height="800px"></iframe>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'T2Test',
  data() {
    return {
      host: '',
      port: '',
      functionId: '',
      testServerUrl: '',
      defaultHost: '127.0.0.1',
      checkFunction: '/unittest/cep?cmdId=get&functionId=',
      showService: '/manager/cep?pluginId=jres.cepcore&commandName=queryProcServices',
      showConnection: '/manager/cep?pluginId=jres.t2channel&commandName=queryAllConnections',
      hostsHistoryList: [],
      portHistoryList: []
    }
  },
  methods: {
    persistentHistory() {
      localStorage.setItem(
        't2_history',
        JSON.stringify({ hosts: this.hostsHistoryList, ports: this.portHistoryList })
      )
    },
    pushHistory() {
      if (this.hostsHistoryList.indexOf(this.host) === -1) {
        this.hostsHistoryList.push(this.host)
      }
      if (this.portHistoryList.indexOf(this.port) === -1) {
        this.portHistoryList.push(this.port)
      }
      this.persistentHistory()
    },
    getAllConnect: function() {
      this.pushHistory()
      this.testServerUrl = this.getHost() + this.port + this.showConnection
    },
    getAllService: function() {
      this.pushHistory()
      this.testServerUrl = this.getHost() + this.port + this.showService
    },
    checkAll: function() {
      this.pushHistory()
      this.testServerUrl = this.getHost() + this.port + '/unittest/cep?cmdId=all'
    },
    checkFunc: function() {
      this.pushHistory()
      this.testServerUrl = this.getHost() + this.port + this.checkFunction + this.functionId
    },
    refresh: function() {
      var target = this.testServerUrl
      this.testServerUrl = ''
      setTimeout(function() {
        this.testServerUrl = target
      }, 120)
    },
    getHost() {
      if (this.host) {
        return 'http://' + this.host + ':'
      } else {
        return 'http://' + this.defaultHost + ':'
      }
    },
    replaceHost: function(newHost) {
      this.host = newHost
    },
    replacePort: function(newPort) {
      this.port = newPort
    },
    removeHost: function(host) {
      let index = this.hostsHistoryList.indexOf(host)
      if (index !== -1) {
        this.hostsHistoryList.splice(index, 1)
      }
      this.persistentHistory()
    },
    removePort: function(port) {
      let index = this.portHistoryList.indexOf(port)
      if (index !== -1) {
        this.portHistoryList.splice(index, 1)
      }
      this.persistentHistory()
    }
  },
  created () {
    let storedHistoryInfo = localStorage.getItem('t2_history')
    if (storedHistoryInfo) {
      storedHistoryInfo = JSON.parse(storedHistoryInfo)
      this.hostsHistoryList = storedHistoryInfo.hosts
      this.portHistoryList = storedHistoryInfo.ports
    }
  }
}
</script>

<style>
.t2-table {
  padding: 20px;
}
</style>
