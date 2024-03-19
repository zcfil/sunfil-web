<script setup>
import Header from './components/Header.vue' //头部组件
import FooterCom from './components/FooterCom.vue' //底部
import { ref } from 'vue'

const imgUrl = ref(`url('@/assets/img/home.png')`)
</script>

<script>
export default {
  name: 'App'
}
</script>
<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <FooterCom></FooterCom>
  </div>
</template>

<style lang="scss" scoped>
#app {
  width: 100%;
  min-height: 100vh;
  color: #fff;
  background: url('@/assets/img/home.png');
  background-size: 100% 100%;
}
.home {
  background: url('@/assets/img/home.png');
  background-size: 100% 100%;
}
.stake {
  background: url('@/assets/img/stake.png');
  background-size: 100% 100%;
}
.buff {
  background: url('@/assets/img/buff.png');
  background-size: 100% 100%;
}
</style>
