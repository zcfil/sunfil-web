<template>
  <div id="Buff">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<script>
export default {
  name: 'Buff'
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  padding: 20px 20px 50px;
  // background: url('@/assets/img/homeBg1.png');
  background-size: 100% 100%;
}
</style>
