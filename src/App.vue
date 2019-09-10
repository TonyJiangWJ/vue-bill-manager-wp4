<template>
  <div>
    <top-bar></top-bar>
    <div id="app">
      <router-view/>
    </div>
  </div>
</template>

<script>
import TopBar from './components/TopBar'
export default {
  name: 'App',
  components: {
    TopBar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 15px;
}

.none {
  display: none;
}

.ivu-modal-content {
  border-radius: 2px;
}

.ivu-row-flex {
  margin: 0.15rem 0;
}

@media screen and (min-width: 300px) {
  .common-container {
    width: 90%;
    margin: 50px auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
}

@media screen and (min-width: 600px) {
  .common-container {
    width: 85%;
    margin: 50px auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 35px;
  }
}

@media screen and (min-width: 900px) {
  .common-container {
    width: 80%;
    margin: 50px auto;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    padding: 45px;
  }
}

.gap-5 {
  margin: 5px;
}
</style>
