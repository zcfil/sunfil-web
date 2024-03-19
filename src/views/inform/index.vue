<template>
  <div id="Inform" class="container">
    <div class="cardBox">
      <div @click="clickBack" class="back">
        <el-icon><ArrowLeftBold /></el-icon>
        <span> {{ $t('Back') }} </span>
      </div>

      <!-- 公告通知 -->
      <div class="proclamation">
        <div class="left col-12 col-sm-12 col-md-12 col-lg-4">
          <div class="title">
            <SvgIcon name="proclamation" />
            {{ $t('Notice_NOTICE') }}
          </div>

          <div class="btnBox">
            <!-- 节点清算风险公告 -->
            <el-button @click="clickBtn(1)" :class="{ active: btnIndex == 1 }">
              {{ $t('Notice_Riskbutton') }}
            </el-button>
            <!-- 节点清算投票 -->
            <el-button @click="clickBtn(2)" :class="{ active: btnIndex == 2 }">
              {{ $t('Notice_Votebutton') }}
            </el-button>
          </div>
        </div>

        <div class="right col-12 col-sm-12 col-md-12 col-lg-8">
          <h6>
            {{
              { 1: $t('Notice_Riskbutton'), 2: $t('Notice_Voting') }[btnIndex]
            }}
          </h6>
          <p>
            {{
              {
                1: $t('Notice_content'),
                2: $t('Notice_Votingcontent')
              }[btnIndex]
            }}
          </p>
        </div>
      </div>

      <!-- 节点清算风险公告卡片内容 -->
      <div v-if="btnIndex == 1" class="contentBox">
        <swiper
          ref="mySwiper"
          class="swiper"
          :effect="'coverflow'"
          :grabCursor="true"
          :slides-per-view="view"
          :space-between="50"
          :navigation="navigation"
          :modules="modules"
          :coverflowEffect="{
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false
          }"
        >
          <swiper-slide v-for="(item, index) in infoArr" :key="index">
            <div class="infoBox">
              <!-- 节点 -->
              <div class="info">
                <h6>{{ $t('Notice_Node') }} {{ item.minerId }}</h6>

                <div class="icon">
                  <div>
                    <SvgIcon name="informIcon" />
                  </div>
                </div>

                <div class="percent">
                  <div class="red">{{ item.diffRate }}</div>
                  <!-- 债务率超过清算阈值 -->
                  <div>/{{ $t('Notice_Debtliq') }}</div>
                </div>

                <!-- 风险持续时间 -->
                <p>{{ $t('Notice_durationing') }}：{{ item.riskDuration }}</p>

                <ul>
                  <li>
                    <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                      <div>
                        <SvgIcon name="informIcon2" />
                      </div>
                      <!-- 节点余额 -->
                      <div>{{ $t('Notice_balance') }}</div>
                    </div>

                    <div class="right col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ item.nodeBalance }}
                    </div>
                  </li>

                  <li>
                    <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                      <div>
                        <SvgIcon name="informIcon2" />
                      </div>

                      <!-- 债务 -->
                      <div>{{ $t('Notice_Debt') }}</div>
                    </div>
                    <div class="rightcol-6 col-sm-6 col-md-6 col-lg-6">
                      {{ item.nodeDebt }}
                    </div>
                  </li>

                  <li>
                    <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                      <div>
                        <SvgIcon name="informIcon2" />
                      </div>
                      <!-- 节点权益额度 -->
                      <div>{{ $t('Notice_limit') }}</div>
                    </div>
                    <div class="rightcol-6 col-sm-6 col-md-6 col-lg-6">
                      {{ item.nodeAvailable }}
                    </div>
                  </li>

                  <li>
                    <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                      <div>
                        <SvgIcon name="informIcon2" />
                      </div>
                      <!-- 最大债务比 -->
                      <div>{{ $t('Notice_Max') }}</div>
                    </div>
                    <div class="right col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ item.debtRate }}
                    </div>
                  </li>

                  <li>
                    <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                      <div>
                        <SvgIcon name="informIcon2" />
                      </div>
                      <!-- 清算阈值 -->
                      <div>{{ $t('Notice_Clearing') }}</div>
                    </div>
                    <div class="right col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ item.liquidateRate }}
                    </div>
                  </li>

                  <li>
                    <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                      <div>
                        <SvgIcon name="informIcon2" />
                      </div>
                      <!-- 当前债务比率 -->
                      <div>{{ $t('Notice_Current') }}</div>
                    </div>
                    <div class="red right col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ item.nodeDebtRate }}
                    </div>
                  </li>
                </ul>
                <div class="progressBox">
                  <el-progress
                    striped
                    striped-flow
                    :duration="10"
                    :text-inside="true"
                    :stroke-width="24"
                    :percentage="
                      +item.nodeDebtRate.slice(0, -1) > 100
                        ? 100
                        : +item.nodeDebtRate.slice(0, -1)
                    "
                    :format="_format(+item.nodeDebtRate.slice(0, -1))"
                    status="success"
                  />

                  <el-tooltip
                    class="box-item"
                    effect="light"
                    :content="$t('thresholds')"
                    placement="top"
                  >
                    <span class="line"></span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </swiper-slide>
          <!-- 添加Navigation按钮 -->
          <div class="swiper-button-prev" @click.stop="prevEl"></div>
          <div class="swiper-button-next" @click.stop="nextEl"></div>
        </swiper>

        <div v-if="total <= 0" class="noData">暂无数据</div>
      </div>

      <!-- 投票内容 -->
      <div v-if="btnIndex == 2" class="voteContent">
        <!-- 筛选按钮 -->
        <div class="filtrationBox">
          <div class="filtration" @click="clickFilter">
            <span>
              <SvgIcon
                name="filtration"
                style="
                  width: 20px;
                  height: 20px;
                  margin-top: -3px;
                  margin-right: 5px;
                "
            /></span>

            <span>{{
              {
                true: $t('Notice_VotingVoting'),
                false: $t('Notice_VotingEnded')
              }[show]
            }}</span>

            <i v-if="show" class="vote">{{ total }}</i>
            <i v-else class="close">{{ total }}</i>
          </div>
        </div>

        <div class="bottomCard">
          <div
            v-for="(item, index) in liquidateArr"
            :key="index"
            class="infoBox col-12 col-sm-12 col-md-12 col-lg-6"
            @click="clickVoteCard(item)"
          >
            <div class="info">
              <!-- 节点 -->
              <div class="title">
                <h6>{{ $t('Notice_Node') }} {{ item.minerId }}</h6>

                <div class="iconBox">
                  <div class="icon">
                    <div>
                      <SvgIcon name="informIcon" />
                    </div>
                  </div>

                  <!-- 过期时间 -->
                  <div v-if="show" class="txt">
                    <i></i>
                    {{ $t('Notice_Votingexpires') }} {{ item.voteExpired }}
                  </div>

                  <!-- 通过状态 -->
                  <div v-else class="txt2">
                    <!-- 通过 -->
                    <span v-if="item.voteResults == 1" class="pass">
                      <SvgIcon name="pass" />
                      {{ $t('Notice_VotingPass') }}
                    </span>

                    <!-- 拒绝 -->
                    <span v-if="item.voteResults == 2" class="reject">
                      <SvgIcon name="error" />
                      {{ $t('Notice_VotingRefuse') }}
                    </span>

                    <!-- 关闭 -->
                    <span v-if="item.voteResults == 3" class="close">
                      <SvgIcon name="close" />
                      {{ $t('Notice_VotingNo') }}
                    </span>

                    <!-- 已过期 -->
                    <span v-if="item.voteResults == 4" class="close">
                      <SvgIcon name="close" />
                      {{ $t('Notice_VotingExpired') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 阈值清算 -->
              <div class="percentBox">
                <div class="percent">
                  <div class="red">{{ item.diffRate }}</div>
                  <div>/{{ $t('Notice_VotingDebt1') }}</div>
                </div>

                <!-- 风险持续时间 -->
                <p>{{ $t('Notice_VotingRisk') }}：{{ item.riskDuration }}</p>
              </div>

              <!-- 余额 -->
              <ul>
                <li>
                  <!--   节点总余额 -->
                  <div class="left col-12 col-sm-12 col-md-12 col-lg-6">
                    <div class="col-6 col-sm-6 col-md-6 col-lg-7">
                      <SvgIcon name="informIcon2" />
                      {{ $t('Notice_Votingbalance') }}
                    </div>

                    <div class="col-6 col-sm-6 col-md-6 col-lg-5">
                      {{ item.nodeBalance }}
                    </div>
                  </div>

                  <!-- 债务 -->
                  <div class="right col-12 col-sm-12 col-md-12 col-lg-6">
                    <div class="col-6 col-sm-6 col-md-6 col-lg-7">
                      <SvgIcon name="informIcon2" />
                      {{ $t('Notice_VotingDebt') }}
                    </div>

                    <div class="col-6 col-sm-6 col-md-6 col-lg-5">
                      {{ item.nodeDebt }}
                    </div>
                  </div>
                </li>

                <!-- 清算阈值 -->
                <li>
                  <div class="left col-12 col-sm-12 col-md-12 col-lg-6">
                    <div class="col-6 col-sm-6 col-md-6 col-lg-7">
                      <SvgIcon name="informIcon2" />
                      {{ $t('Notice_Votingthreshold') }}
                    </div>

                    <div class="col-6 col-sm-6 col-md-6 col-lg-5">
                      {{ item.liquidateRate }}
                    </div>
                  </div>

                  <!-- 当前债务比率 -->
                  <div class="right col-12 col-sm-12 col-md-12 col-lg-6">
                    <div class="col-6 col-sm-6 col-md-6 col-lg-7">
                      <SvgIcon name="informIcon2" />
                      {{ $t('Notice_VotingCurrent') }}
                    </div>

                    <div class="red col-6 col-sm-6 col-md-6 col-lg-5">
                      {{ item.nodeDebtRate }}
                    </div>
                  </div>
                </li>
              </ul>

              <!-- 进度条 -->
              <div class="progressBox">
                <el-progress
                  :class="{
                    stopStriped: item.voteResults == 3 || item.voteResults == 4
                  }"
                  striped
                  :striped-flow="
                    item.voteResults !== 3 && item.voteResults !== 4
                  "
                  :duration="10"
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="100"
                  :format="_format2(+item.nodeDebtRate.slice(0, -1))"
                  status="success"
                />
                <!-- :format="_format(+item.nodeDebtRate.slice(0, -1))" -->
                <!-- :percentage="
                    +item.nodeDebtRate.slice(0, -1) > 100
                      ? 100
                      : +item.nodeDebtRate.slice(0, -1)
                  " -->
                <el-tooltip
                  class="box-item"
                  effect="light"
                  :content="$t('thresholds')"
                  placement="top"
                >
                  <!-- <span  class="line"></span> -->
                  <span></span>
                </el-tooltip>
              </div>
            </div>
          </div>

          <div v-if="total <= 0" class="noData">
            <div>暂无数据</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { warnNodeList } from '@/api/liquidate.js'
import { _format, _format2 } from '@/utils/num.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import {
  Navigation,
  EffectCoverflow,
  Pagination,
  Scrollbar,
  FreeMode
} from 'swiper/modules' // import required modules
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'
import 'swiper/css/free-mode'
import 'swiper/css/scrollbar'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useVoteStore } from '@/store/module/vote.js' //投票仓
import { storeToRefs } from 'pinia'

// swiper参数
const modules = ref([
  Navigation,
  EffectCoverflow,
  Pagination,
  FreeMode,
  Scrollbar
])

// 导航按钮
const navigation = ref({
  nextEl: '.swiper-button-next',
  prevEl: '.swiper-button-prev'
})

const router = useRouter()
const voteStore = useVoteStore()
const { voteItem } = storeToRefs(voteStore)

onMounted(() => {
  window.onresize = () => {
    return (() => {
      screenWidth.value =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
    })()
  }

  if (screenWidth.value < 992) {
    view.value = 1
  } else {
    view.value = 3
  }

  getWarnNodeList()
})

const form = ref({
  page: 1, //	是	int	页码
  pageSize: 10, //	是	int	每页大小
  nodeStatus: 1 //	是	int	1告警公告,2节点清算投票 ,3 已关闭
})

const infoArr = ref() // 公告数组
const liquidateArr = ref([]) //投票数组
const total = ref(0) //总数
const getWarnNodeList = async () => {
  const res = await warnNodeList(form.value)
  total.value = res.data.total
  if (btnIndex.value == 1) {
    // 公告
    infoArr.value = res.data.list
  } else if (btnIndex.value == 2) {
    liquidateArr.value = res.data.list
  }
}

// 上一页
const currentIndex = ref(3) //一排三个下标
const prevEl = () => {
  if (currentIndex.value > 3) {
    currentIndex.value--
  }
}
// 下一页
const nextEl = async () => {
  await currentIndex.value++
  if (currentIndex.value >= infoArr.value.length) {
    form.value.page++

    const res = await warnNodeList(form.value)
    if (rse.code == 0) {
      infoArr.value.push(rse.data.list)
    } else {
      // 提示
      ElMessage.error(res.msg)
    }
  }
}

// 控制页面显示个数
const view = ref(1)
// 浏览器宽度
const screenWidth = ref(
  window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
)

// 实时侦听浏览器宽度
watch(
  () => screenWidth.value,
  val => {
    screenWidth.value = val

    if (screenWidth.value < 992) {
      view.value = 1
    } else {
      view.value = 3
    }
  }
)

// 点击返回
const clickBack = () => {
  router.push({
    path: '/home'
  })
}

// 公告通知按钮
const btnIndex = ref(1)
const clickBtn = index => {
  btnIndex.value = index
  form.value.nodeStatus = +index
  form.value.page = 1 //重置第一页
  show.value = true //每次切换都变成投票中

  total.value = 0
  infoArr.value = []
  liquidateArr.value = []

  getWarnNodeList()
}

// 点击筛选按钮
const show = ref(true)
const clickFilter = async () => {
  show.value = show.value ? false : true

  total.value = 0
  infoArr.value = []
  liquidateArr.value = []

  if (!show.value) {
    form.value.nodeStatus = await 3
    getWarnNodeList()
  } else {
    form.value.nodeStatus = await 2
    getWarnNodeList()
  }
}

// 点击投票卡片
const clickVoteCard = async item => {
  voteStore.voteItem = await item
  router.push({
    path: '/home/voteInfo'
  })
}
</script>

<script>
export default {
  name: 'Inform'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss'; //引用此混合样式

// 暂无数据
.noData {
  width: 100%;
  line-height: 380px;
  text-align: center;
  font-size: 25px;
  color: #ccc;
  div {
    margin-top: -10px;
  }
}

.container {
  position: relative;
  padding: 20px 20px 50px;
  // background: url('@/assets/img/homeBg1.png');
  // background-size: 100% 100%;
  .cardBox {
    background: $cardBgColor;
    border-radius: 20px;
    padding: 20px 20px;
  }
}

::v-deep .back {
  font-size: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    font-weight: 700;
    margin-left: 5px;
  }
}

// 公告通知
::v-deep .proclamation {
  display: flex;
  background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
  border-radius: 20px;
  padding: 5px 10px;

  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .btnBox {
    display: flex;

    .el-button {
      // width: 200px;
      min-height: 52px;
      flex: 1;
      border: 1px solid #a8a8a8;
      border-radius: 10px;
      background-color: transparent;
      color: #fff;
      padding: 8px;
      span {
        word-break: break-all;
        white-space: pre-wrap;
      }

      &:focus {
        border: 1px solid #fcaa13;
        color: #fcaa13;
      }
      &.active {
        border: 1px solid #fcaa13;
        color: #fcaa13;
      }
    }
  }

  .title {
    font-size: 20px;
    .svg-icon {
      width: 35px;
      height: 35px;
    }
  }

  .right {
    flex: 1;
    margin-left: 30px;
    font-size: 15px;
    h6 {
      padding: 10px 0;
    }
    p {
      padding: 0 0 10px;
    }
  }
}

// 清算卡片节点信息
::v-deep .contentBox {
  min-height: 400px;
  width: 100%;

  .swiper {
    padding: 0 50px;

    // 导航器
    .swiper-button-next,
    .swiper-button-prev {
      color: #ccc;
    }

    .swiper-slide-next {
      .info {
        scale: 1.1;
        background: linear-gradient(180deg, #7940cf 0%, #5921cb 100%);
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.03);
      }
    }
  }

  // 清算阈值
  .percent {
    div:first-child {
      font-size: 20px;
      font-weight: 700;
      color: #ff483d;
    }

    div:last-child {
      font-size: 12px;
      margin-left: 70px;
    }
  }

  .infoBox {
    margin: 50px 0;

    .info {
      position: relative;
      flex: 1;
      width: 100%;
      height: 100%;
      padding: 10px 15px;
      background: #34363e;
      border-radius: 20px;
      box-sizing: border-box;

      &:hover {
        cursor: pointer;
      }

      h6 {
        margin: 20px 0 15px;
      }

      /* 汇率兑换 */
      ul {
        margin: 10px 0 20px 0;
        li {
          display: flex;
          justify-content: space-between;
          // align-items: center;
          padding: 8px 0 0 0;
          font-family: Montserrat;
          color: #ccc;
          font-size: 12px;

          div:nth-child(2) {
            display: flex;
            justify-content: flex-end;
            flex-wrap: wrap;
            word-break: break-all; //纯英文、数字、中文
          }

          .left {
            display: flex;
          }
        }
      }
    }
  }

  // 持续时间
  p {
    font-size: 14px;
    margin: 5px 0 0 0;
  }

  // 进度条
  .progressBox {
    // display: flex;
    width: 100%;
    position: relative;
    margin: 10px 0;
    .line {
      display: block;
      width: 3px;
      height: 24px;
      background: #ff483d99;
      position: absolute;
      top: 0;
      right: 35%;
      cursor: pointer;
    }

    .el-progress-bar {
      border-radius: 20px;
      .el-progress-bar__outer {
        border-radius: 20px;
        background: #ffffff99;
      }
      .el-progress-bar__inner {
        background: #ff990099;
        border-radius: 20px;
      }
    }
  }

  .red {
    color: #ff483d;
    font-weight: 700;
  }

  //卡片右上角图标
  .icon {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    div {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      scale: 0.8;
      background: rgba(255, 255, 255, 0.1);
    }
    .svg-icon {
      width: 100%;
      height: 100%;
      scale: 0.7;
    }
  }
}

.infoBox {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
  cursor: pointer;
  .leftBox {
    flex: 1;
    margin-right: 80px;
  }

  .rightBox {
    flex: 1;
  }
}

// 投票
::v-deep .voteContent {
  // 筛选按钮
  .filtrationBox {
    // width: 100%;
    display: flex;
    justify-content: flex-end;
    .filtration {
      width: 150px;
      margin: 20px 0 10px 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: #fff;
      border: 1px solid #fff;
      padding: 10px 10px;
      border-radius: 10px;
      cursor: pointer;

      // &:hover {
      //   border: 1px solid #8c67f7;
      //   color: #8c67f7;
      //   .svg-icon {
      //     color: #8c67f7;
      //   }
      // }

      .svg-icon {
        color: #fff;
      }

      i {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        text-align: center;
        line-height: 25px;
        font-style: normal;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .vote {
        background: #fcaa13;
      }

      .close {
        background: #ccc;
      }
    }
  }

  .bottomCard {
    min-height: 330px;
    display: flex;
    flex-wrap: wrap;

    .infoBox {
      display: flex;
      justify-content: center;
    }
  }
  .info {
    width: 90%;
    background: #34363e;
    border-radius: 20px;
    padding: 15px;
    margin-bottom: 30px;

    // 标题
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .iconBox {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .txt {
          background: #7139cf;
          padding: 3px 8px;
          border-radius: 8px;
          margin-left: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          color: #ff483d;

          i {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #ff483d;
            margin-right: 5px;
          }
        }

        .txt2 {
          .pass,
          .reject,
          .close {
            margin-left: 5px;
            padding: 3px 10px;
            border-radius: 8px;
          }

          .pass {
            background: #2a4e32;
            border: 1px solid #03ad00;
            color: #03ad00;
          }

          .reject {
            background: #5d3a3e;
            border: 1px solid #ff483d;
            color: #ff483d;
          }

          .close {
            background: #404248;
            border: 1px solid #707070;
            color: #707070;
          }

          .svg-icon {
            width: 20px;
            height: 20px;
            margin-top: -2px;
          }
        }

        .icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          div {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            scale: 0.8;
            background: rgba(255, 255, 255, 0.1);
          }
          .svg-icon {
            width: 100%;
            height: 100%;
            scale: 0.7;
          }
        }
      }
    }

    // 清算阈值
    .percentBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;

      .percent {
        div:first-child {
          font-size: 25px;
          font-weight: 700;
          color: #ff483d;
        }

        div:last-child {
          font-size: 12px;
          margin-left: 40px;
        }
      }
    }

    ul {
      li {
        display: flex;
        justify-content: space-between;

        .left,
        .right {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          font-size: 12px;
          color: #ccc;

          div:nth-child(2) {
            display: flex;
            justify-content: flex-end;
            flex-wrap: wrap;
            word-break: break-all;
            color: #fff;
          }

          div.red {
            color: #ff483d;
            font-weight: 700;
          }
        }

        .left {
          padding-right: 10px;
        }
      }
    }

    // 进度条
    .progressBox {
      width: 100%;
      position: relative;
      margin: 20px 0;
      .line {
        display: block;
        width: 3px;
        height: 15px;
        background: #ff483d99;
        position: absolute;
        top: 0;
        right: 35%;
        cursor: pointer;
      }

      .el-progress-bar {
        border-radius: 20px;
        .el-progress-bar__outer {
          height: 15px !important;
          border-radius: 20px;
          background: #ffffff99;
        }

        .el-progress-bar__inner {
          // background: #ff990099;
          border-radius: 20px;
          .el-progress-bar__innerText {
            padding-bottom: 3px;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  // 公告通知
  ::v-deep .proclamation {
    display: block;

    .right {
      flex: 1;
      margin: 10px 0;
    }

    .btnBox {
      margin: 10px 0 0 0;
    }
  }

  .infoBox {
    display: block;

    .leftBox {
      flex: 1;
      margin-bottom: 20px;
    }
  }

  // 清算卡片节点信息
  ::v-deep .contentBox {
    min-height: 400px;
    width: 100%;

    .swiper {
      padding: 0px;

      // 导航器
      .swiper-button-next,
      .swiper-button-prev {
        color: transparent;
      }

      &:hover {
        // 导航器
        .swiper-button-next,
        .swiper-button-prev {
          color: #ccc;
        }
      }

      .swiper-slide-next {
        .info {
          scale: 1.1;
          background: linear-gradient(180deg, #7940cf 0%, #5921cb 100%);
          box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.03);
        }
      }
    }
  }

  // 投票
  ::v-deep .voteContent {
    .info {
      width: 100%;
      .percentBox {
        display: block;

        p {
          margin-top: 10px;
          font-size: 16px;
        }
      }

      ul {
        li {
          display: block;

          .left,
          .right {
            padding-bottom: 10px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  // 公告通知
  ::v-deep .proclamation {
    display: block;

    .right {
      flex: 1;
      margin: 10px 0;
    }

    .btnBox {
      margin: 10px 0 0 0;
    }
  }

  // 清算卡片节点信息
  ::v-deep .contentBox {
    min-height: 400px;
    width: 100%;

    .swiper {
      padding: 0px;

      // 导航器
      .swiper-button-next,
      .swiper-button-prev {
        color: transparent;
      }

      // 导航器
      &:hover {
        .swiper-button-next,
        .swiper-button-prev {
          color: #ccc;
        }
      }

      .swiper-slide-next {
        .info {
          scale: 1.1;
          background: linear-gradient(180deg, #7940cf 0%, #5921cb 100%);
          box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.03);
        }
      }
    }
  }

  .infoBox {
    display: block;

    .leftBox {
      flex: 1;
      margin-bottom: 20px;
    }
  }

  // 投票
  ::v-deep .voteContent {
    .info {
      width: 100%;
      .percentBox {
        display: block;
        p {
          margin-top: 10px;
          font-size: 16px;
        }
      }

      ul {
        li {
          display: block;

          .left,
          .right {
            padding-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>
