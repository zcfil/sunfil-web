<template>
  <div id="rate" class="topRight col-12 col-sm-12 col-md-12 col-lg-4">
    <p>
      <span>
        <span style="font-size: 12px"> {{ $t('stake') }}&nbsp;</span>
        <span style="font-size: 18px; font-weight: 800">
          {{ $t('S_APY') }}</span
        >
      </span>
      <i :class="greenCircle"></i>
    </p>

    <h2 class="countStyle countColor">
      <countFlopTest :val="(rateObj.stakeAPY * 100).toFixed(2)" suffix="%" />
    </h2>

    <!-- 资金利用率 -->
    <div class="useRate">
      <h5 style="font-weight: 700">{{ $t('U_rate') }}</h5>
      <h5 class="countStyle2">
        <countFlopTest
          :val="(rateObj.financeUseRate * 100).toFixed(2)"
          suffix="%"
        />
      </h5>
    </div>
  </div>
</template>

<script setup>
import countFlopTest from './countFlopTest.vue'
import { ref, onMounted, watch } from 'vue'
import { useSidebarStore } from '@/store/module/sidebar.js' //侧边栏数据
import { storeToRefs } from 'pinia'

// 使用仓库
const sidebarStore = useSidebarStore()
const { rateData, getTotalFilSideInfo } = storeToRefs(sidebarStore)

onMounted(async () => {
  changeColor() //呼吸灯
  await getTotalFilSideData()
})

// 侧边栏
const rateObj = ref({
  stakeAPY: 0, // 质押利率
  loanAPY: 0, //借贷利率
  financeUseRate: 0, // 资金利用率
  totalBalance: 0, // 池子Fil总量
  filValue: 0, // fil币价值
  totalBalanceValue: 0, // 池子Fil总价值
  totalLockValue: 0, // 池子锁定的总价值
  lastAvailableBalance: 0, // 剩余可用流动资产
  stakeNum: 0, // 质押人数
  nodeNum: 0, // 节点数
  businessCoefficient: 0, // 运营储备系数
  riskCoefficient: 0 // 风险储备系数
})

// 获取数据
const getTotalFilSideData = async () => {
  rateObj.value = await sidebarStore.getTotalFilSideInfo()
}

const greenCircle = ref('greenCircle') //呼吸灯类名
const time = ref() //定时器
const changeColor = () => {
  time.value = setInterval(async () => {
    if (greenCircle.value == 'greenCircle') {
      greenCircle.value = 'grayColor'
    } else if (greenCircle.value == 'grayColor') {
      greenCircle.value = 'greenCircle'
    }
  }, 1000)
}

// (new1, old1)
// 侦听是否需要刷新
watch(
  () => sidebarStore.rateData,
  async (new1, old1) => {
    if (new1 !== old1) {
      rateObj.value = await sidebarStore.rateData
    }
  }
)
</script>

<script>
export default {
  name: 'rate'
}
</script>
<style lang="scss" scoped>
/* 顶部右边 */
.topRight {
  min-height: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 10px 20px 15px;
  border-radius: 10px;
  background-color: $cardBgColor;
  font-family: 'Montserrat';
  // margin-left: 20px;

  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .greenCircle {
    // display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 3px;
    background: #65efad;
  }

  .grayColor {
    display: inline-block;
    min-width: 5px;
    height: 5px;
    border-radius: 3px;
    background: transparent;
  }

  div {
    font-weight: 800;
  }

  h5 {
    font-weight: 700;
  }
}

//
::v-deep .countStyle {
  display: flex;
  justify-content: center;
  align-content: center;
  .count-flop {
    /* 可更改 */
    height: 50px;
    line-height: 50px;
  }
  .count-flop-content {
    font-size: 50px;
  }

  .count-flop-box {
    margin-right: 0;
    width: 30px;
    border: 0;
    border-radius: 0;
    line-height: 50px;
  }
  .count-flop-point {
    margin-right: 0;
    width: 14px;
  }

  .count-flop-unit {
    font-size: 50px;
    line-height: 50px;
    font-weight: 600;
    padding-left: 1px;
  }
}

::v-deep .countColor {
  .count-flop-content,
  .count-flop-num,
  .count-flop-point,
  .count-flop-unit {
    background: $txtColor;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}

::v-deep .countStyle2 {
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
  .count-flop {
    /* 可更改 */
    height: 20px;
    line-height: 20px;
    font-size: 24px;
    color: #fff;
  }
}
</style>
