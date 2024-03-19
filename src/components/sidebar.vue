<template>
  <div id="sidebar">
    <div class="btTop">
      <ul>
        <!-- 锁定的总价值（TVL） -->
        <li>
          <div style="text-align: left; font-size: 12px">
            <span> {{ $t('TVL') }}</span>
            <i :class="greenCircle"></i>
          </div>

          <div class="countStyle countColor">
            <countFlopTest
              prefix="$"
              :val="rateObj.totalLockValue.toFixed(2)"
            />
          </div>
        </li>

        <!-- 池子FIL总量 -->
        <li>
          <div style="text-align: left; font-size: 12px">
            <span> {{ $t('total_fil') }} </span>
            <i :class="greenCircle"></i>
          </div>

          <div class="countStyle">
            <countFlopTest
              :val="rateObj.totalBalance.toFixed(2)"
              suffix="FIL"
            />
          </div>
        </li>

        <li>
          <!-- 池子总价值 -->
          <div class="title">
            <span>{{ $t('total_value') }} </span>
            <span>{{ rateObj.filValue }} $ <i :class="greenCircle"></i> </span>
          </div>

          <div class="countStyle">
            <countFlopTest
              :val="rateObj.totalBalanceValue.toFixed(2)"
              suffix="$"
            />
          </div>
        </li>
      </ul>
    </div>

    <div class="btBottom">
      <ul>
        <!-- 剩余可用流动资产 -->
        <li>
          <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
            <i :class="greenCircle"></i>
            <span>{{ $t('Remaining') }}</span>
          </div>

          <span class="right col-6 col-sm-6 col-md-6 col-lg-6">
            {{ rateObj.lastAvailableBalance }} FIL
          </span>
        </li>

        <!-- 质押人数 -->
        <li>
          <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
            <i :class="greenCircle"></i>
            <span>{{ $t('Stakers') }}</span>
          </div>
          <span class="right col-6 col-sm-6 col-md-6 col-lg-6">
            {{ rateObj.stakeNum }}</span
          >
        </li>

        <!-- 节点数 -->
        <li>
          <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
            <i :class="greenCircle"></i>
            <span>{{ $t('Nodes') }}</span>
          </div>
          <span class="right col-6 col-sm-6 col-md-6 col-lg-6">
            {{ rateObj.nodeNum }}</span
          >
        </li>

        <!-- 风险储备系数 -->
        <li>
          <span class="coefficient left col-6 col-sm-6 col-md-6 col-lg-6">
            {{ $t('Risk') }}
          </span>
          <span class="right col-6 col-sm-6 col-md-6 col-lg-6"
            >{{ rateObj.businessCoefficient * 100 }} %
          </span>
        </li>

        <!-- 运营储备系数 -->
        <li>
          <span class="coefficient left col-6 col-sm-6 col-md-6 col-lg-6">
            {{ $t('OPEX') }}
          </span>
          <span class="right col-6 col-sm-6 col-md-6 col-lg-6">
            {{ rateObj.riskCoefficient * 100 }} %
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import countFlopTest from '@/components/countFlopTest.vue'
import { getTotalFilSide } from '@/api/home.js'
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSidebarStore } from '@/store/module/sidebar.js' //侧边栏数据仓

onMounted(() => {
  changeColor() //呼吸灯
  getTotalFilSideData()
})

const sidebarStore = useSidebarStore()
const { rateData } = storeToRefs(sidebarStore)

// 侦听刷新
watch(
  () => sidebarStore.rateData,
  async val => {
    if (val) {
      rateObj.value = sidebarStore.rateData
    }
  }
)
const countFlopRef = ref() //滚动标签
const countFlopRef2 = ref() //滚动标签

// 侧边数据
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
  const res = await getTotalFilSide()
  rateObj.value = res.data
}

// 呼吸灯
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
</script>

<script>
export default {
  name: 'sidebar'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss'; //引用此混合样式

/* 资金利用率 */
.topRight {
  min-height: 310px;
  margin-bottom: 20px;
  padding: 10px 20px;
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

  h2 {
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-style: normal;
    font-weight: 800;
    font-size: 60px;
    text-transform: capitalize;
    background: $txtColor;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    margin: 50px 0;
  }

  div {
    font-weight: 800;
    padding-right: 20px;
  }

  h5 {
    font-weight: 700;
  }
}

// 绿色小点
.greenCircle {
  display: inline-block;
  min-width: 5px;
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
// 侧边栏样式
.btTop li,
.btBottom {
  background-color: $cardBgColor;
  border-radius: 10px;
  padding: 20px 15px;
}

::v-deep .btTop li {
  margin-bottom: 10px;
}

.btTop li:nth-child(1) {
  div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.btTop li:nth-child(2) {
  div:first-child {
    display: flex;
    justify-content: space-between;
  }
}

.btTop li:nth-child(3) {
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    span:nth-child(2) {
      display: flex;
      align-items: center;
      i {
        margin-left: 5px;
      }
    }
  }
}

.btBottom {
  font-size: 14px;
  padding: 30px 15px;

  li {
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
    div {
      display: flex;
      align-items: center;
      i {
        margin-right: 8px;
      }
    }

    .right {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      word-break: break-all; //纯英文、数字、中文
    }
  }
}

::v-deep .countStyle {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0 5px;
  .count-flop {
    height: 20px;
    line-height: 20px;
    font-size: 22px;
    color: #fff;
  }

  .count-flop-box {
    line-height: 20px;
  }
  .count-flop-point {
    margin-right: 0;
  }
  .count-flop-unit {
    font-size: 20px;
    line-height: 20px;
    font-weight: 600;
    padding: 1px 5px 0;
  }
}

::v-deep .countColor {
  .count-flop {
    height: 25px;
    line-height: 25px;
    font-size: 28px;
    color: #fff;
  }

  .count-flop-box {
    line-height: 25px;
  }
  .count-flop-point {
    margin-right: 0;
  }
  .count-flop-unit {
    font-size: 25px;
    line-height: 25px;
    font-weight: 600;
    padding: 1px 5px 0;
  }

  .count-flop-content,
  .count-flop-num,
  .count-flop-unit {
    background: $txtColor;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}

// 骨架屏
::v-deep .el-skeleton.is-animated {
  .el-skeleton__item {
    background: $elSkeletonColor;
    background-size: 400% 100%;
    -webkit-animation: el-skeleton-loading 1.4s ease infinite;
    animation: el-skeleton-loading 1.4s ease infinite;
  }

  .el-skeleton__p.is-first {
    width: 100%;
    height: 100%;
  }
}
</style>
