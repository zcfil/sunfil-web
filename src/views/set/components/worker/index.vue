<template>
  <div id="worker" class="container">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<script>
export default {
  name: 'Worker'
}
</script>
<style lang="scss" scoped></style>
