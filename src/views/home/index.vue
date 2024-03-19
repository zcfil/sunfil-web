<template>
  <div id="Home" class="container-fuild">
    <div class="container">
      <!-- 图片 -->
      <div class="imgBox"></div>

      <div class="top">
        <div class="topLeft col-12 col-sm-12 col-md-12 col-lg-8">
          <h2>{{ $t('title1') }}</h2>
          <!-- 简介 -->
          <p>
            {{ $t('content1') }}
          </p>
          <p>
            {{ $t('content2') }}
          </p>

          <div style="text-align: right">
            <div class="joinBox">
              <el-button class="joinBtn" @click="joinClick">{{
                $t('join')
              }}</el-button>
            </div>
          </div>
        </div>

        <!-- 资金利用率 -->
        <CapitalRate />
      </div>

      <!-- 资金利用率图表 -->
      <div class="bottom">
        <div class="bottomLeft col-12 col-sm-12 col-md-12 col-lg-8">
          <div>
            <h5>{{ $t('U_rate1') }}</h5>
            <el-tooltip class="box-item" effect="light" placement="top-end">
              <template #content>
                <div>{{ $t('U_rate1') }} {{ useRateObj.rate }}%</div>
                <div>
                  {{ $t('U_optimalRate1') }} {{ useRateObj.optimalRate }}%
                </div>
              </template>
              <div class="progressBox">
                <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="useRateObj.rate"
                  status="success"
                />
                <!-- 阈值线 -->
                <span></span>
              </div>
            </el-tooltip>

            <div class="echartsBtnBox">
              <h2>Total Pool Fil</h2>
              <div ref="TotalPool" class="echartsBox" id="TotalPool"></div>
              <ul class="echartsBtn">
                <li
                  :class="{ active: timeIndex == index }"
                  v-for="(item, index) in btnList"
                  :key="index"
                  @click="timeClick(index, 'totalPool', item.label)"
                >
                  {{ item.label }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="bottomRight col-12 col-sm-12 col-md-12 col-lg-4">
          <Sidebar />
        </div>
      </div>

      <!-- 公告通知 -->
      <div class="inform">
        <div>
          {{ $t('Notice') }}
          <i v-if="warnTotal > 0" class="informIcon">{{ warnTotal }}</i>
        </div>
        <span @click="clickView">{{ $t('view') }}</span>
      </div>

      <!-- 动态图表 -->
      <div class="moveChartBox">
        <div class="swipeBtnBox">
          <ul>
            <li
              @mouseover="mouseOver"
              @mouseleave="mouseLeave"
              @click="moveClick(index)"
              :class="{
                active: index == moveIndex
              }"
              v-for="(item, index) in btnArr"
              :key="index"
            >
              {{ item.label }}
            </li>
          </ul>
        </div>

        <!-- 利率总图 -->
        <div v-if="moveIndex == 0" class="cardBox">
          <div class="leftCard col-12 col-sm-12 col-md-3 col-lg-3">
            <ul>
              <!-- 资金利用率 -->
              <li>
                <div>{{ $t('chart_T_U_rate') }}</div>
                <h3>{{ (rateObj.financeUseRate * 100).toFixed(2) }}%</h3>
                <p>{{ $t('chart_T_DoD') }}</p>
                <span>{{ (rateObj.financeUseQOQ * 100).toFixed(2) }}%</span>
              </li>

              <!-- 借款利率 -->
              <li>
                <div>{{ $t('chart_T_L_APY') }}</div>
                <h3>{{ (rateObj.loanAPY * 100).toFixed(2) }}%</h3>
                <p>{{ $t('chart_T_DoD') }}</p>
                <span>{{ (rateObj.loanQOQ * 100).toFixed(2) }}%</span>
              </li>

              <!-- 质押利率 -->
              <li>
                <div>{{ $t('chart_T_S_APY') }}</div>
                <h3>{{ (rateObj.stakeAPY * 100).toFixed(2) }}%</h3>
                <p>{{ $t('chart_T_DoD') }}</p>
                <span>{{ (rateObj.stakeQOQ * 100).toFixed(2) }}%</span>
              </li>
            </ul>
          </div>

          <div
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
            class="rightCard col-12 col-sm-12 col-md-9 col-lg-9"
          >
            <h2>Totality Change</h2>

            <div
              ref="total"
              class="totalEcharts"
              id="total"
              style="width: 100%; height: 400px; display: inline-block"
            ></div>

            <ul class="echartsBtn">
              <li
                :class="{ active: timeIndex2 == index }"
                v-for="(item, index) in btnList"
                :key="index"
                @click="timeClick(index, 'Totality', item.label)"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 借贷图 -->
        <div v-if="moveIndex == 1" class="cardBox2">
          <div class="leftCard col-12 col-sm-12 col-md-3 col-lg-3">
            <ul>
              <!-- 借款利率 -->
              <li>
                <div>{{ $t('chart_L_L_APY1') }}</div>
                <h3>{{ (loanObj.loanAPY * 100).toFixed(2) }}%</h3>
                <p>{{ $t('chart_L_DoD') }}</p>
                <span>{{ (loanObj.loanQOQ * 100).toFixed(2) }}%</span>
              </li>

              <!-- 总借出 -->
              <li>
                <div>{{ $t('chart_L_totalloan') }}</div>
                <h3>{{ loanObj.totalLoan.toFixed(2) }}FIL</h3>
                <p>{{ $t('chart_L_DoD') }}</p>
                <span>{{ (loanObj.totalLoanQOQ * 100).toFixed(2) }}%</span>
              </li>

              <!-- 剩余可流动 -->
              <li>
                <div>{{ $t('chart_L_Remaining') }}</div>
                <h3>{{ loanObj.remainFil.toFixed(2) }}FIL</h3>
                <p>{{ $t('chart_L_DoD') }}</p>
                <span>{{ (loanObj.remainFilQOQ * 100).toFixed(2) }}%</span>
              </li>
            </ul>
          </div>

          <div
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
            class="rightCard col-12 col-sm-12 col-md-9 col-lg-9"
          >
            <h2>Loan</h2>

            <div ref="loan" class="loanEcharts" id="loan"></div>

            <ul class="echartsBtn">
              <li
                :class="{ active: timeIndex3 == index }"
                v-for="(item, index) in btnList"
                :key="index"
                @click="timeClick(index, 'Loan', item.label)"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 质押图 -->
        <div v-if="moveIndex == 2" class="cardBox3">
          <div class="leftCard col-12 col-sm-12 col-md-3 col-lg-3">
            <ul>
              <!-- 质押APY -->
              <li>
                <div>{{ $t('chart_S_S_APY') }}</div>
                <h3>{{ (stakeObj.stakeAPY * 100).toFixed(2) }}%</h3>
                <p>{{ $t('chart_S_DoD') }}</p>
                <span>{{ (stakeObj.stakeQOQ * 100).toFixed(2) }}%</span>
              </li>

              <!-- 总质押量 -->
              <li>
                <div>{{ $t('chart_S_STAKE') }}</div>
                <h3>{{ stakeObj.totalStake.toFixed(2) }}FIL</h3>
                <p>{{ $t('chart_S_DoD') }}</p>
                <span>{{ (stakeObj.totalStakeQOQ * 100).toFixed(2) }}%</span>
              </li>
            </ul>
          </div>

          <div
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
            class="rightCard col-12 col-sm-12 col-md-9 col-lg-9"
          >
            <h2>STAKE</h2>

            <div ref="stake" class="stakeEcharts" id="stake"></div>

            <ul class="echartsBtn">
              <li
                :class="{ active: timeIndex4 == index }"
                v-for="(item, index) in btnList"
                :key="index"
                @click="timeClick(index, 'STAKE', item.label)"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getFinanceUseRate } from '@/api/home.js'
import { warnNodeCount } from '@/api/liquidate.js'
import { FormatDate } from '@/utils/formatDate.js' //时间格式化
import CapitalRate from '@/components/capitalRate.vue' //资金利用率组件
import Sidebar from '@/components/sidebar.vue' //右侧边栏
import * as echarts from 'echarts'
import { debounce } from '@/utils/index'
import { useRouter } from 'vue-router' //路由
import { ref, onMounted, onBeforeUnmount, markRaw } from 'vue'
import { toFixedNum } from '@/utils/num.js'
import { useRateContractStore } from '@/store/module/rateContract.js'
import { storeToRefs } from 'pinia'

// 使用仓库
const rateContractStore = useRateContractStore()
const {
  getTotalRateData,
  getLoanRateData,
  getStackRateData,
  getTotalFilData,
  getStakeInfoData,
  getTotalityData,
  getDebtInfoData,
  getFinanceUseRateData
} = storeToRefs(rateContractStore)

const router = useRouter()

onMounted(() => {
  getWarnNodeCount() //公告通知

  //根据浏览器的大小来改变大小
  window.addEventListener('resize', resizeHandler)
  getUtilizationRate() //资金利用率

  getTotalFilListData() //总池子
  getTotalityChangeData() //三大利率
  getStakeInfoListData() //质押
  getDebtInfoListData() //借贷

  getTotalRateSideData()
  getLoanRateSideData()
  getStackRateSideData()
})

const resizeHandler = debounce(() => {
  if (totalPoolChart.value) {
    totalPoolChart.value.resize()
  }

  if (totalChart.value) {
    totalChart.value.resize()
  }

  if (loanChart.value) {
    loanChart.value.resize()
  }

  if (stakeChart.value) {
    stakeChart.value.resize()
  }
}, 10)

// 获取公告通知
const warnTotal = ref(null)
const getWarnNodeCount = async () => {
  const res = await warnNodeCount()
  warnTotal.value = res.data.total
}

// 总利率
const rateObj = ref({
  stakeAPY: 0, // 质押利率
  stakeQOQ: 0, // 质押利率昨日环比
  loanAPY: 0, // 借贷利率
  loanQOQ: 0, // 借贷利率昨日环比
  financeUseRate: 0, // 资金利用率
  financeUseQOQ: 0 // 资金利用率昨日环比
})

// 获取总利率数据
const getTotalRateSideData = async () => {
  rateObj.value = await rateContractStore.getTotalRateData()
}

// 借贷
const loanObj = ref({
  loanAPY: 0, // 借贷利率
  loanQOQ: 0, // 借贷利率昨日环比
  totalLoan: 0, // 借贷总额
  totalLoanQOQ: 0, // 借贷总额昨日环比
  remainFil: 0, // 剩余资金
  remainFilQOQ: 0 // 剩余资金昨日环比
})
// 获取借贷数据
const getLoanRateSideData = async () => {
  loanObj.value = await rateContractStore.getLoanRateData()
}

// 质押
const stakeObj = ref({
  stakeAPY: 0, // 质押利率
  stakeQOQ: 0, // 质押利率昨日环比
  totalStake: 0, // 质押总额
  totalStakeQOQ: 0 // 质押总额昨日环比
})

// 获取质押数据
const getStackRateSideData = async () => {
  stakeObj.value = await rateContractStore.getStackRateData()
}

//资金利用率
const useRateObj = ref({
  rate: 0, //资金利用率
  optimalRate: '' //最佳资金利用率
})
const TotalPoolDate = ref([]) //时间x轴
const TotalPoolData = ref([]) //数据

// 获取资金利用率进度条
const getUtilizationRate = async () => {
  const res = await rateContractStore.getFinanceUseRateData()
  useRateObj.value.rate = Number((res.data.useRate * 100).toFixed(2)) // 资金利用率
  useRateObj.value.optimalRate = 90 // 最佳资金利用率
}

// 获取资金利用率数据
const getTotalFilListData = async (time = '1d') => {
  const res = await rateContractStore.getTotalFilData(time)

  if (res.list) {
    // 每次请求清空上次数据
    TotalPoolDate.value = []

    // 时间格式化-拿到echarts时间坐标X轴
    for (let i = 0; i < res.list.length; i++) {
      // TotalPoolDate.value.unshift(
      //   FormatDate(res.list[i].recordTime).slice(5, 10).replace('-', '/')
      // )
      TotalPoolDate.value.unshift(FormatDate(res.list[i].recordTime))
      TotalPoolData.value.unshift(res.list[i].totalBalance)
    }
  }

  await TotalPoolEcharts() //等上面数据获取完成再渲染图表
}

// 资金利用率折线图
const TotalPool = ref()
const totalPoolChart = ref(null)

function TotalPoolEcharts () {
  //先获取Dom上的实例
  let charts = echarts.getInstanceByDom(document.getElementById('TotalPool'))
  const option = {}
  const timeArr = TotalPoolDate.value.map(v => v.slice(0, -3))

  //然后判断实例是否存在，如果不存在，就创建新实例
  if (charts == null) {
    totalPoolChart.value = markRaw(echarts.init(TotalPool.value))
  }

  if (TotalPoolDate.value.length > 0) {
    option.value = {
      title: {
        text: '',
        x: 'center',
        y: 'center',
        textStyle: {
          fontSize: 25,
          fontWeight: '800'
        }
      },

      tooltip: {
        trigger: 'axis',
        // 根据自己的需求返回数据
        formatter: params => {
          const showData = params
          showData.map(v => (v.data = toFixedNum(v.data, 2)))

          return `
          <div class='tooltipBox'>
              <div>${timeArr[showData[0].dataIndex]} UTC+8:00</div>
              <div>
                <span
        style="
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right:3px;
          background: #703cc5;
        "
      ></span>
                ${showData[0].value}
                </div>
          </div>

          `
        }
      },
      xAxis: {
        type: 'category',
        splitLine: {
          show: false
        },

        axisTick: {
          show: false // 是否显示坐标轴刻度
        },
        data: TotalPoolDate.value.map(v => v.slice(5, 10).replace('-', '/'))
      },

      yAxis: {
        // 纵轴标尺固定
        show: true, // 是否显示 y 轴
        type: 'value',
        min: 0, //  最小值
        boundaryGap: [0, '30%'],
        splitNumber: 7,
        splitLine: {
          lineStyle: {
            color: ['#6e7079'], // 分隔线颜色
            type: 'dashed' //虚线
          },
          show: true //隐藏
        },

        axisLine: {
          show: true // 是否显示坐标轴轴线
        }
      },

      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },

      series: [
        {
          data: TotalPoolData.value,
          // data: valueList,
          type: 'line',

          smooth: true, // 平滑折线
          showSymbol: false,

          itemStyle: {
            // 折线颜色
            // color: '#642b73',

            // 自定义渐变折线颜色
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#753dcf' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#53348d' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }

            // lineStyle: {
            //   color: '#642b73' //设置折线线条颜色
            // }
          }
        }
      ]
    }
  } else {
    option.value = {
      title: {
        text: '暂无数据',
        x: 'center',
        y: 'center',
        textStyle: {
          fontSize: 25,
          fontWeight: '800'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        splitLine: {
          show: false
        },

        axisTick: {
          show: false // 是否显示坐标轴刻度
        },
        data: TotalPoolDate.value ? TotalPoolDate.value : []
      },

      yAxis: {
        // 纵轴标尺固定
        show: true, // 是否显示 y 轴
        type: 'value',
        min: 0, //  最小值
        splitNumber: 7,

        splitLine: {
          lineStyle: {
            color: ['#6e7079'], // 分隔线颜色
            type: 'dashed' //虚线
          },
          show: true //隐藏
        },

        axisLine: {
          show: true // 是否显示坐标轴轴线
        }
      },

      grid: {
        left: '5%',
        right: '5%',
        bottom: '5%',
        containLabel: true
      },

      series: [
        {
          data: [],
          type: 'line',
          // 平滑折线
          smooth: true,
          showSymbol: false,

          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#753dcf' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#53348d' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ]
    }
  }

  totalPoolChart.value.setOption(option.value)
}

// Totality
const totalityDate = ref([]) //x轴
const financeUseRateArr = ref([]) //资金利用率
const totalityDebtRateArr = ref([]) // 借款利率
const totalityStakeRateArr = ref([]) // 质押利率
// 获取Totality数据
const getTotalityChangeData = async (time = '1d') => {
  const res = await rateContractStore.getTotalityData(time)

  if (res.list) {
    // 每次请求清空上次数据
    totalityDate.value = []
    financeUseRateArr.value = []
    totalityDebtRateArr.value = []
    totalityStakeRateArr.value = []
    for (let i = 0; i < res.list.length; i++) {
      // totalityDate.value.unshift(
      //   FormatDate(res.list[i].recordTime).slice(5, 10).replace('-', '/')
      // )
      totalityDate.value.unshift(FormatDate(res.list[i].recordTime))
      financeUseRateArr.value.unshift(res.list[i].financeUseRate * 100)
      totalityDebtRateArr.value.unshift(res.list[i].debtRate * 100)
      totalityStakeRateArr.value.unshift(res.list[i].stakeRate * 100)
    }
  }

  totalEcharts(
    totalityDate.value,
    financeUseRateArr.value,
    totalityDebtRateArr.value,
    totalityStakeRateArr.value
  )
}

// Totality折线图
const total = ref()
const totalChart = ref(null)

const totalEcharts = async (totalityDate, useRate, debtRate, stakeRate) => {
  const option = {}
  const timeArr = totalityDate.map(v => v.slice(0, -3))

  if (totalityDate.length > 0) {
    totalChart.value = markRaw(echarts.init(total.value)) //先获取Dom上的实例
    option.value = {
      title: {
        text: '',
        x: 'center',
        y: 'center',
        textStyle: {
          fontSize: 25,
          fontWeight: '800'
        }
      },
      // 悬浮框根据自己的需求返回数据
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#7139cf', //设置背景颜色
        borderColor: '#fff', //设置边框颜色
        textStyle: {
          color: 'white' //设置文字颜色
        },

        // 根据自己的需求返回数据
        formatter: params => {
          const showData = params
          showData.map(v => (v.data = toFixedNum(v.data, 2)))

          return `
        <div class='tooltipBox'>
            <div>${timeArr[showData[0].dataIndex]} UTC+8:00</div>

         <div class='tooltipCard'>
             <div class='left' style="color:#fff">
               Utilization Rate：
              </div>

           <div class='right' style="color:#fff">
            ${showData[0].data}%
          </div>
         </div>

         <div class='tooltipCard'>
             <div class='left' style="color:#91cc75">
              LOAN APY
              </div>
           <div class='right' style="color:#91cc75">
            ${showData[1].data}%
          </div>
         </div>

         <div class='tooltipCard'>
             <div class='left' style="color:#fac858">
              STAKE APY
              </div>
           <div class='right' style="color:#fac858">
            ${showData[2].data}%
          </div>
         </div>

        </div>

        `
        }
      },

      // 指示标
      // legend: {
      //   data: ['Utilization Rate', 'LOAN APY', 'STAKE APY'],
      //   left: '0%',
      //   textStyle: {
      //     color: '#fff'
      //   },
      //   selectedMode: false // 是否允许点击
      // },

      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },

      // x轴
      xAxis: {
        type: 'category',
        boundaryGap: ['10%', '30%'],
        data: totalityDate.map(v => v.slice(5, 10).replace('-', '/')),
        splitLine: {
          // show: true,
          lineStyle: {
            color: '#3c3c3c',
            width: 2
          }
        },
        // 刻度间隔
        // axisLabel: {
        //   interval: 0
        // },
        axisTick: {
          show: false // 是否显示坐标轴刻度
        }
      },
      yAxis: {
        boundaryGap: [0, '30%'],
        // 纵轴标尺固定
        show: true, // 是否显示 y 轴
        type: 'value',
        min: 0, //  最小值
        splitNumber: 7,
        splitLine: {
          lineStyle: {
            color: ['#6e7079'], // 分隔线颜色
            type: 'dashed' //虚线
          },
          show: true //隐藏
        },

        axisLine: {
          show: true // 是否显示坐标轴轴线
        },
        // Y轴单位
        axisLabel: {
          formatter: '{value} %'
        }
      },
      // 渲染数据
      series: [
        {
          smooth: true, // 平滑折线
          showSymbol: false,
          name: 'Utilization Rate',
          type: 'line',
          data: useRate,
          itemStyle: {
            // 折线颜色
            color: '#fff'
          }
        },
        {
          smooth: true, // 平滑折线
          showSymbol: false,
          name: 'LOAN APY',
          type: 'line',
          data: debtRate,
          itemStyle: {
            // 折线颜色
            color: '#91cc75'
          }
        },
        {
          smooth: true, // 平滑折线
          showSymbol: false,
          name: 'STAKE APY',
          type: 'line',
          data: stakeRate,
          itemStyle: {
            // 折线颜色
            color: '#fac858'
          }
        }
      ]
    }

    document.getElementById('total').removeAttribute('_echarts_instance_')
    totalChart.value.setOption(option.value)
  }
}

// 质押
const stakeDate = ref([]) //时间x轴
const stakeBalanceArr = ref([]) //质押金额
const stakeRateArr = ref([]) // 质押利率
// 获取质押数据
const getStakeInfoListData = async (time = '1d') => {
  const res = await rateContractStore.getStakeInfoData(time)

  if (res.list) {
    // 每次请求清空上次数据
    stakeDate.value = []
    stakeBalanceArr.value = []
    stakeRateArr.value = []
    for (let i = 0; i < res.list.length; i++) {
      // stakeDate.value.unshift(
      //   FormatDate(res.list[i].recordTime).slice(5, 10).replace('-', '/')
      // )
      stakeDate.value.unshift(FormatDate(res.list[i].recordTime))
      stakeBalanceArr.value.unshift(res.list[i].stakeBalance)
      stakeRateArr.value.unshift(res.list[i].stakeRate * 100)
    }
  }

  await stakeEcharts() //等上面数据获取完成再渲染图表
}

// 质押折线图
const stake = ref()
const stakeChart = ref(null)
const stakeEcharts = async () => {
  if (stake.value) {
    //先获取Dom上的实例
    let charts = echarts.getInstanceByDom(document.getElementById('stake'))
    const option = {}
    const timeArr = stakeDate.value.map(v => v.slice(0, -3))

    //然后判断实例是否存在，如果不存在，就创建新实例
    if (charts == null) {
      stakeChart.value = markRaw(echarts.init(stake.value))
    }

    if (stakeDate.value.length > 0) {
      option.value = {
        title: {
          text: '',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 25,
            fontWeight: '800'
          }
        },

        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.6)', //设置背景颜色
          borderColor: '#fff', //设置边框颜色
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)' //设置文字颜色
          },

          formatter: params => {
            const showData = params
            showData.map(v => (v.data = toFixedNum(v.data, 2)))

            // 根据自己的需求返回数据
            return `
        <div class='tooltipBox'>
            <div>${timeArr[showData[0].dataIndex]} UTC+8:00</div>

         <div class='tooltipCard'>
             <div class='left' style="color:#d9ffbb">
              TOTAL SATKE
              </div>
           <div class='right' style="color:#d9ffbb">
            ${showData[1].data}FIL
          </div>
         </div>
         <div class='tooltipCard'>
             <div class='left'  style="color:#efffff">
              STAKE APY
              </div>
           <div class='right' style="color:#efffff">
            ${showData[0].data}%
          </div>
         </div>
        </div>

        `
          }
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          data: stakeDate.value.map(v => v.slice(5, 10).replace('-', '/')),

          // // 坐标轴内容
          // axisLabel: {
          //   interval: 0, //间隔
          //   formatter: function (date) {
          //     let timeArr = stakeDate.value.map(v =>
          //       v.slice(5, 10).replace('-', '/')
          //     )
          //     for (let index = 0; index < timeArr.length; index++) {
          //       return timeArr[index]
          //     }
          //   }
          // },

          // 切割线
          splitLine: {
            show: false,
            lineStyle: {
              color: '#3c3c3c',
              width: 2
            }
          },

          axisTick: {
            show: false // 是否显示坐标轴刻度
          }
        },
        yAxis: [
          {
            yAxisIndex: 0,
            min: 0, //  最小值
            splitNumber: 7,
            interval: Math.ceil(Math.ceil(Math.max(...stakeRateArr.value)) / 7),
            max: Math.ceil(Math.ceil(Math.max(...stakeRateArr.value)) / 7) * 7,

            type: 'value',
            name: 'STAKE APY',

            // Y轴单位
            axisLabel: {
              show: true,
              interval: 'auto', //居中显示
              formatter: '{value} %'
            },

            splitLine: {
              lineStyle: {
                color: ['#3c3c3c'], // 分隔线颜色
                type: 'dashed' //虚线
              }
            }
          },

          {
            yAxisIndex: 1,
            min: 0, //  最小值
            splitNumber: 7,
            interval: Math.ceil(
              Math.ceil(Math.max(...stakeBalanceArr.value)) / 7
            ),

            max:
              Math.ceil(Math.ceil(Math.max(...stakeBalanceArr.value)) / 7) * 7,

            type: 'value',
            name: 'TOTAL STAKE',

            axisLabel: {
              show: true,
              interval: 'auto' //居中显示
            },

            splitLine: {
              lineStyle: {
                color: ['#3c3c3c'], // 分隔线颜色
                type: 'dashed' //虚线
              }
            }
          }
        ],
        series: [
          {
            yAxisIndex: 0, // 左坐标轴，很关键的1，右边才可以显示
            name: 'STAKE APY',
            type: 'line',
            data: stakeRateArr.value,
            // 去除圆点
            symbol: 'none',
            smooth: 'true', // 平滑折线
            // 区域背景色
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(212, 222, 236, 0.2)' // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(212, 222, 236, 0)' // 渐变线的结束颜色
                  }
                ],
                false
              ),

              //控制阴影的显示。如果需要的话可以写
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },

            // 折线颜色
            itemStyle: {
              color: 'rgba(218, 244, 255, 1)'
            }
          },

          {
            yAxisIndex: 1, // 右坐标轴，很关键的1，右边才可以显示
            name: 'TOTAL STAKE',
            type: 'line',
            data: stakeBalanceArr.value,
            // 去除圆点
            symbol: 'none',
            smooth: 'true', // 平滑折线
            // 区域背景色
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(131, 228, 197, 0.2)' // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(131, 228, 196, 0)' // 渐变线的结束颜色
                  }
                ],
                false
              ),
              //控制阴影的显示。如果需要的话可以写
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },

            // 折线颜色
            itemStyle: {
              color: 'rgba(198, 255, 170, 1)'
            }
          }
        ]
      }
    } else {
      option.value = {
        title: {
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 25,
            fontWeight: '800'
          }
        },
        xAxis: {
          type: 'category',
          data: [],
          splitLine: {
            show: true,
            lineStyle: {
              color: '#3c3c3c',
              width: 2
            }
          }
          // 刻度间隔
          // axisLabel: {
          //   interval: 0
          // }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          // Y轴单位
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: [
          {
            name: 'TOTAL STAKE',
            type: 'line',
            data: [],
            // 去除圆点
            symbol: 'none',

            // 区域背景色
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(131, 228, 197, 0.2)' // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(131, 228, 196, 0)' // 渐变线的结束颜色
                  }
                ],
                false
              ),
              //控制阴影的显示。如果需要的话可以写
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },

            // 折线颜色
            itemStyle: {
              color: 'rgba(198, 255, 170, 1)'
            }
          },
          {
            name: 'STAKE APY',
            type: 'line',
            data: [],
            // 去除圆点
            symbol: 'none',

            // 区域背景色
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(212, 222, 236, 0.2)' // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(212, 222, 236, 0)' // 渐变线的结束颜色
                  }
                ],
                false
              ),
              //控制阴影的显示。如果需要的话可以写
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },

            // 折线颜色
            itemStyle: {
              color: 'rgba(218, 244, 255, 1)'
            }
          }
        ]
      }
    }
    document.getElementById('stake').removeAttribute('_echarts_instance_')
    stakeChart.value.setOption(option.value)
  }
}

// 借贷
const loanDate = ref([])
const debtBalanceArr = ref([])
const debtRateArr = ref([])
// 获取借贷数据
const getDebtInfoListData = async (time = '1d') => {
  const res = await rateContractStore.getDebtInfoData(time)

  if (res.list) {
    // 每次请求清空上次数据
    loanDate.value = []
    debtBalanceArr.value = []
    debtRateArr.value = []

    for (let i = 0; i < res.list.length; i++) {
      // loanDate.value.unshift(
      //   FormatDate(res.list[i].recordTime).slice(5, 10).replace('-', '/')
      // )
      loanDate.value.unshift(FormatDate(res.list[i].recordTime))
      debtBalanceArr.value.unshift(res.list[i].debtBalance)
      debtRateArr.value.unshift((res.list[i].debtRate * 100).toFixed(2))
    }
  }

  await loanEcharts() //等上面数据获取完成再渲染图表
}

// 借贷折线图
const loan = ref()
const loanChart = ref(null)
const loanEcharts = async () => {
  if (loan.value) {
    loanChart.value = markRaw(echarts.init(loan.value))

    const timeArr = loanDate.value.map(v => v.slice(0, -3))

    var option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#7139cf', //设置背景颜色
        borderColor: '#fff', //设置边框颜色
        textStyle: {
          color: 'white' //设置文字颜色
        },
        // 根据自己的需求返回数据
        formatter: params => {
          const showData = params

          showData.map(v => (v.data = toFixedNum(v.data, 2)))

          return `
        <div class='tooltipBox'>
            <div>${timeArr[showData[0].dataIndex]} UTC+8:00</div>

         <div class='tooltipCard'>
             <div class='left'>
              TOTAL LOAN
              </div>
           <div class='right'>
            ${showData[1].data}FIL
          </div>
         </div>
         <div class='tooltipCard'>
             <div class='left'>
              LOAN APY
              </div>
           <div class='right'>
            ${showData[0].data}%
          </div>
         </div>
        </div>

        `
        }
      },

      // 每个宫格间距
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },

      xAxis: [
        {
          type: 'category',
          barWidth: '60%',
          boundaryGap: [0, '30%'],
          data: loanDate.value.map(v => v.slice(5, 10).replace('-', '/')),
          scale: true,

          // 数线切割
          // splitLine: {
          //   show: true,
          //   lineStyle: {
          //     color: '#3c3c3c',
          //     width: 2
          //   }
          // },
          // 刻度间隔
          // axisLabel: {
          //   interval: 0
          // },
          axisTick: {
            show: false // 是否显示坐标轴刻度
          }
        }
      ],

      yAxis: [
        {
          show: true, // 是否显示 y 轴
          min: 0, //  最小值
          splitNumber: 7,
          interval: Math.ceil(Math.ceil(Math.max(...debtRateArr.value)) / 7),
          max: Math.ceil(Math.ceil(Math.max(...debtRateArr.value)) / 7) * 7,

          type: 'value',
          name: 'LOAN APY',

          splitLine: {
            lineStyle: {
              color: ['#3c3c3c'], // 分隔线颜色
              type: 'dashed' //虚线
            }
          },
          // Y轴单位
          axisLabel: {
            formatter: '{value} %'
          }
        },
        {
          show: true, // 是否显示 y 轴
          min: 0, //  最小值
          splitNumber: 7,
          interval:
            Math.ceil(Math.ceil(Math.max(...debtBalanceArr.value)) / 7) * 5,
          max:
            Math.ceil(Math.ceil(Math.max(...debtBalanceArr.value)) / 7) * 7 * 5,
          type: 'value',
          name: 'TOTAL LOAN',

          splitLine: {
            lineStyle: {
              color: ['#3c3c3c'], // 分隔线颜色
              type: 'dashed' //虚线
            }
          }
        }
      ],

      series: [
        {
          // 去除圆点
          symbol: 'none',
          smooth: 'true',
          yAxisIndex: 0,
          name: 'LOAN APY',
          type: 'line',
          data: debtRateArr.value ? debtRateArr.value : [],
          itemStyle: {
            // 折线颜色
            // color: 'rgba(198, 255, 170, 1)'

            // 渐变折线颜色
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#753dcf' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#53348d' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        },
        {
          yAxisIndex: 1,
          name: 'TOTAL LOAN',
          type: 'bar',
          barWidth: '60%',
          data: debtBalanceArr.value ? debtBalanceArr.value : [],
          itemStyle: {
            // 折线颜色
            // color: 'rgba(198, 255, 170, 1)'
            // 渐变折线颜色
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(132, 225, 255, 1)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(81, 125, 238, 1)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ]
    }

    document.getElementById('loan').removeAttribute('_echarts_instance_')
    loanChart.value.setOption(option)
  }
}

// 时间按钮数组
const btnList = ref([
  {
    value: '1d',
    label: '1d'
  },
  {
    value: '7d',
    label: '7d'
  },
  {
    value: '1m',
    label: '1m'
  },
  {
    value: '3m',
    label: '3m'
  }
])
const timeIndex = ref(0)
const timeIndex2 = ref(0)
const timeIndex3 = ref(0)
const timeIndex4 = ref(0)
const timeClick = (index, type, label) => {
  switch (type) {
    case 'totalPool':
      timeIndex.value = index
      getTotalFilListData(label)
      break
    case 'Totality':
      timeIndex2.value = index
      getTotalityChangeData(label)
      break
    case 'Loan':
      timeIndex3.value = index
      getDebtInfoListData(label)
      break
    case 'STAKE':
      timeIndex4.value = index
      getStakeInfoListData(label)
      break
  }
  timeIndex.value = index
}

// 点击查看公告
const clickView = () => {
  router.push({
    path: '/home/inform'
  })
}

// 动态图表
const btnArr = ref([
  {
    label: 'TOTAL'
  },
  {
    label: 'LOAN'
  },
  {
    label: 'STAKE'
  }
])
const moveIndex = ref(0)
const moveClick = async index => {
  moveIndex.value = index
  switch (index) {
    case 0:
      await total.value //等dom加载再渲染数据
      totalEcharts(
        totalityDate.value,
        financeUseRateArr.value,
        totalityDebtRateArr.value,
        totalityStakeRateArr.value
      )
      break
    case 1:
      await loan.value
      loanEcharts()
      break
    case 2:
      await stake.value
      stakeEcharts()
      break
  }
}

// 轮播
const time = ref()
time.value = setInterval(async () => {
  if (moveIndex.value >= 2) {
    moveIndex.value = 0
  } else {
    moveIndex.value++
  }
  await moveClick(moveIndex.value)
}, 10000)

// 点击加入跳转节点入职页面
const joinClick = () => {
  router.push({
    path: '/buff/minerSearch'
  })
}

// 清除定时器
const mouseOver = () => {
  clearInterval(time.value)
}

// 重启定时器
const mouseLeave = () => {
  time.value = setInterval(async () => {
    if (moveIndex.value >= 2) {
      moveIndex.value = 0
    } else {
      moveIndex.value++
    }
    await moveClick(moveIndex.value)
  }, 10000)
}

// 页面关闭销毁定时器
onBeforeUnmount(() => {
  clearInterval(time.value)

  window.removeEventListener('resize', resizeHandler)
})
</script>

<script>
export default {
  name: 'Home'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss'; //引用此混合样式

.swiper {
  width: 600px;
  height: 300px;
}

#Home {
  .container {
    // border-radius: 25px 25px 0 0;
    position: relative;
    padding: 20px 20px;
    // background: url('@/assets/img/home.png');
    background-size: 100% 100%;

    /* 公共样式 */

    .top,
    .bottom {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 20px;
    }

    .imgBox {
      width: 100%;
      height: 100px;
      border-radius: 10px;
      background: url('@/assets/img/homeBg.png');
      background-size: 100% 100%;
    }

    //绿色圆点
    .greenCircle {
      // display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 3px;
      background: #65efad;
    }

    /* 顶部左边 */
    .topLeft {
      padding: 10px 20px;
      border-radius: 10px;
      background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
      margin-right: 20px;
    }
    .topLeft p {
      margin-top: 10px;
      text-indent: 2em;
    }

    .joinBox {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 10px;
      background: rgba(13, 15, 22, 0.25);
      .joinBtn {
        height: 30px;
        background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
        color: #fff;
        border-radius: 6px;
      }
    }

    /* 底部左边 */
    .bottomLeft {
      padding: 20px 20px;
      border-radius: 10px;
      background-color: $cardBgColor;
      margin-right: 20px;
      margin-bottom: 20px;

      // 进度条
      .progressBox {
        position: relative;
        margin: 15px 0;

        span {
          display: block;
          width: 5px;
          height: 24px;
          background: $progressColor;
          position: absolute;
          top: 0;
          right: 10%;
        }
      }

      ::v-deep .el-progress-bar {
        .el-progress-bar__outer {
          border-radius: 100px;
          background-color: #493a65;
        }
        .el-progress-bar__inner {
          background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
        }
      }

      /* echarts折线图 */
      ::v-deep .echartsBtnBox {
        position: relative;
        border-radius: 10px;
        background-color: #191919;
        padding: 15px 0 0;

        h2 {
          margin-left: 15px;
          font-weight: 800;
        }
        .echartsBox {
          width: 100%;
          height: 370px;
          background-color: #191919;
          border-radius: 10px;
          div {
            top: -20px;
            left: -3px;
          }
        }

        .echartsBtn {
          display: flex;
          position: absolute;
          top: 15px;
          right: 20px;
          padding: 5px 10px;
          border-radius: 5px;
          background-color: #2b2b2b;
          &:hover {
            cursor: pointer;
          }

          li {
            margin: 0 8px;
            color: #777;
          }
          li:hover,
          li.active {
            color: #fff;
          }
        }
      }
    }

    // 图表按钮
    ::v-deep .echartsBtn {
      display: flex;
      position: absolute;
      top: 10px;
      right: 20px;
      padding: 5px 10px;
      border-radius: 5px;
      background-color: #2b2b2b;
      &:hover {
        cursor: pointer;
      }

      li {
        margin: 0 8px;
        color: #777;
      }
      li:hover,
      li.active {
        color: #fff;
      }
    }

    /* 底部右边 */
    .bottomRight {
      flex: 1;
      margin-bottom: 20px;
      .btTop li {
        padding: 25px 15px !important;
      }
    }
  }
}

// 公告通知
.inform {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  border-radius: 20px;
  border: 1px solid #fff;
  background: linear-gradient(
    180deg,
    #7940cf 0%,
    rgba(121, 64, 207, 0.17) 100%
  );

  // 通知图标
  .informIcon {
    min-width: 30px;
    min-height: 30px;
    font-size: 15px;
    text-align: center;
    line-height: 30px;
    background: #f90;
    border-radius: 50%;
    margin-top: -30px;
    margin-left: 5px;
    font-style: normal;
  }

  div {
    flex: 1;
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: -90px;
  }

  span {
    padding: 10px 20px;
    border-radius: 6px;
    background: #6129cc;
    margin-right: 20px;

    &:hover {
      color: #65efad;
      cursor: pointer;
    }
  }
}

// 动态图表
::v-deep .moveChartBox {
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(39, 41, 50, 0.95);
  .swipeBtnBox {
    width: 300px;
    background: #222;
    text-align: center;
    border-radius: 8px;
    margin: 0 auto;
    ul {
      width: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      &:hover {
        cursor: pointer;
      }
      li {
        width: 33.33%;
        padding: 10px 20px;

        &.active {
          background: #c4c4c4;
          border-radius: 8px;
          color: #000;
        }
      }
    }
  }

  .cardBox,
  .cardBox2,
  .cardBox3 {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .leftCard {
    margin-right: 20px;
    li {
      padding: 10px 20px;
      border-radius: 16px;
      background: #222;
      box-shadow: 0px 30px 50px 0px rgba(0, 0, 0, 0.25);
      color: #ffffff99;
      &:nth-child(2) {
        margin: 15px 0;
      }

      h3 {
        margin: 5px 0;
        color: #e6e6e6;
      }
      p {
        font-size: 12px;
        margin-bottom: 8px;
      }
      span {
        padding: 3px 8px;
        border-radius: 8px;
        background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
        color: #e6e6e6;
      }
    }
  }

  .rightCard {
    flex: 1;
    border-radius: 16px;
    background-color: #222;
    position: relative;

    .totalEcharts,
    .loanEcharts,
    .stakeEcharts {
      width: 100%;
      height: 400px;
      background-color: #222;
      border-radius: 10px;
      padding: 0 0 0 10px;
    }
    h2 {
      font-weight: 700;
      padding: 10px 0 0 20px;
    }
  }

  .loanEcharts,
  .stakeEcharts {
    div {
      top: -15px;
    }
  }

  // 环比百分比背景色
  // .cardBox2,
  // .cardBox3 {
  //   .leftCard {
  //     span {
  //       background: #9a5cbc;
  //     }
  //   }
  // }

  .cardBox3 {
    ul:first-child {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
}

// echarts悬浮文本框
::v-deep .tooltipBox {
  width: 100%;
  height: 100%;
  border-radius: 10px;

  .tooltipCard {
    display: flex;
    justify-content: space-between;

    padding: 5px 0;
    .right {
      margin-left: 30px;
    }
  }
}

::v-deep .echartsBtn {
  display: flex;
  position: absolute;
  top: 10px;
  right: 20px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #2b2b2b;
  &:hover {
    cursor: pointer;
  }

  li {
    margin: 0 8px;
    color: #777;
  }
  li:hover,
  li.active {
    color: #fff;
  }
}

@media screen and (min-width: 768px) and (max-width: 991px) {
  .topRight {
    margin-top: 20px;
  }

  .bottom {
    margin-bottom: 50px;
  }

  // 动态图表
  .moveChartBox {
    .leftCard {
      margin-bottom: 20px;
    }
  }
}

@media screen and (max-width: 768px) {
  #Home .container {
    ::v-deep .bottomLeft {
      .echartsBtnBox {
        position: relative;
        border-radius: 10px;
        background-color: #191919;
        padding: 15px 0 0;

        h2 {
          font-size: 18px;
          margin-left: 15px;
          font-weight: 800;
        }
        .echartsBox {
          width: 100%;
          height: 400px;
          background-color: #191919;
          border-radius: 10px;
        }

        .echartsBtn {
          padding: 2px 5px;
          border-radius: 5px;
          background-color: #2b2b2b;

          &:hover {
            cursor: pointer;
          }

          li {
            margin: 0 2px;
            color: #777;
          }

          li:hover,
          li.active {
            color: #fff;
          }
        }
      }
    }

    .inform {
      div {
        margin-right: -30px;
        font-size: 20px;
      }
    }

    // 图表按钮
    ::v-deep .echartsBtn {
      padding: 2px 5px;
      border-radius: 5px;
      background-color: #2b2b2b;

      &:hover {
        cursor: pointer;
      }

      li {
        margin: 0 2px;
        color: #777;
      }

      li:hover,
      li.active {
        color: #fff;
      }
    }

    .topRight {
      margin-top: 20px;
    }

    // 动态图表
    .moveChartBox {
      .leftCard {
        margin-bottom: 20px;
      }
    }

    .rightCard {
      .totalEcharts,
      .loanEcharts,
      .stakeEcharts {
        min-height: 400px;
        border-radius: 10px;
        padding: 20px 0 0 10px;
      }
      h2 {
        font-size: 16px;
        font-weight: 700;
        padding: 5px 0 0 10px;
      }
    }
  }
}
</style>
