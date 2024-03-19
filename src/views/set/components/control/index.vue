<template>
  <div id="control" class="container">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<script>
export default {
  name: 'Control'
}
</script>
<style lang="scss" scoped></style>
