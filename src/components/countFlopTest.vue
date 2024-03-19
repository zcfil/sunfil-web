<template>
  <div class="count-flop" :key="compKey">
    <div v-if="props.prefix" class="count-flop-unit">{{ props.prefix }}</div>
    <div
      :class="
        item != '.' && item != ',' ? 'count-flop-box' : 'count-flop-point'
      "
      v-for="(item, index) in valueArr"
      :key="index"
    >
      <div
        v-if="item != '.' && item != ','"
        class="count-flop-content"
        :class="['rolling_' + item]"
      >
        <div
          v-for="(item2, index2) in numberList"
          :key="index2"
          class="count-flop-num"
        >
          {{ item2 }}
        </div>
      </div>
      <div v-else-if="item == ','" class="count-flop-content">,</div>
      <div v-else class="count-flop-content">.</div>
    </div>
    <div v-if="props.suffix" class="count-flop-unit">{{ props.suffix }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// 父传子
const props = defineProps({
  val: {
    type: String,
    default: '0.00'
  },
  // 前缀
  prefix: {
    type: String,
    default: ''
  },
  // 后缀
  suffix: {
    type: String,
    default: ''
  }
})

watch(
  () => props.val,
  new1 => {
    if (new1) {
      getValueArr(new1)
      compKey.value += 1
    }
  }
)

onMounted(() => {
  getValueArr(props.val)
})

const compKey = ref(0)
const valueArr = ref([])
const numberList = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

// 封装数字切割法
const getValueArr = val => {
  const strArr = val.toString().split('.')

  const str = strArr[0].toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')

  if (strArr.length > 1) {
    valueArr.value = (str + '.' + strArr[1]).split('')
  } else {
    valueArr.value = str.toString().split('')
  }
}
</script>
<style lang="scss" scoped>
.count-flop {
  display: inline-block;

  /* 可更改 */
  height: 25px;
  line-height: 25px;
  font-size: 28px;
  color: #fff;
}

.count-flop > div {
  position: relative;
  display: inline-block;
  overflow: hidden;
  height: 100%;
}

.count-flop-box {
  /* 可更改 */
  /* margin-right: 5px; */
  width: 17px;
  /* border: 1px solid rgba(72, 152, 241, 0.3); */
  line-height: 21px;
  border-radius: 3px;
  /*  不允许复制 */
  user-select: none;
}

.count-flop-point {
  /* 可更改 */
  /* margin-right: 5px; */
  width: 8px;
  /*  不允许复制 */
  user-select: none;
}

.count-flop-unit {
  /* 可更改 */
  padding-left: 1px;
  /*  不允许复制 */
  user-select: none;
  font-weight: 800;
}

.count-flop-content {
  font-family: 'Montserrat';
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  animation-fill-mode: forwards !important;
  /*  不允许复制 */
  user-select: none;
  font-weight: 800;
}

.count-flop-num {
  font-family: 'Montserrat';
  font-weight: 800;
  text-transform: capitalize;
}

.rolling_0 {
  animation: rolling_0 3s ease-in-out;
}

@keyframes rolling_0 {
  from {
    /* transform: translateY(-90%); */
    transform: translateY(-0%);
  }
  to {
    transform: translateY(0);
  }
}

.rolling_1 {
  animation: rolling_1 3s ease-in-out;
}

@keyframes rolling_1 {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10%);
  }
}

.rolling_2 {
  animation: rolling_2 3s ease-in-out;
}

@keyframes rolling_2 {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20%);
  }
}

.rolling_3 {
  animation: rolling_3 3s ease-in-out;
}

@keyframes rolling_3 {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-30%);
  }
}

.rolling_4 {
  animation: rolling_4 3s ease-in-out;
}

@keyframes rolling_4 {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-40%);
  }
}

.rolling_5 {
  animation: rolling_5 3s ease-in-out;
}

@keyframes rolling_5 {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}

.rolling_6 {
  animation: rolling_6 3s ease-in-out;
}

@keyframes rolling_6 {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-60%);
  }
}

.rolling_7 {
  animation: rolling_7 3s ease-in-out;
}

@keyframes rolling_7 {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-70%);
  }
}

.rolling_8 {
  animation: rolling_8 3s ease-in-out;
}

@keyframes rolling_8 {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-80%);
  }
}

.rolling_9 {
  animation: rolling_9 3s ease-in-out;
}

@keyframes rolling_9 {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-90%);
  }
}
</style>
