<template>
  <div id="voteInfo" class="container">
    <div class="bigCard">
      <!-- 返回 -->
      <div @click="clickBack" class="back">
        <div class="iconBox">
          <el-icon><ArrowLeftBold /></el-icon> <span> {{ $t('Back') }} </span>
        </div>

        <!-- 风险持续时间 -->
        <p>{{ $t('Notice_Votingdetails') }}：{{ contractNode.riskDuration }}</p>
      </div>

      <!-- 节点信息 -->
      <div class="info">
        <div class="leftBox col-12 col-sm-12 col-md-12 col-lg-3">
          <!-- 节点 -->
          <h3 style="font-weight: 400">
            {{ $t('Notice_node') }} {{ contractNode.minerId }}
          </h3>

          <!-- 节点总余额 -->
          <div class="bottom">
            <div>{{ contractNode.nodeBalance }}</div>
            <div>{{ $t('Notice_nodebalance') }}</div>
          </div>
        </div>

        <div class="rightBox col-12 col-sm-12 col-md-12 col-lg-9">
          <div class="infoRight col-12 col-sm-12 col-md-12 col-lg-9">
            <!-- 余额 -->
            <div>
              <!-- 第一行 -->
              <!-- 债务率超过清算阈值 -->
              <el-row :gutter="0">
                <el-col :span="24">
                  <div class="red">{{ contractNode.diffRate }}</div>
                  <div>{{ $t('Notice_nodeexceeds') }}</div>
                </el-col>
              </el-row>

              <!-- 第二行 -->
              <el-row :gutter="5">
                <!-- 债务价值 -->
                <div class="left col-12 col-sm-12 col-md-6 col-lg-6">
                  <el-col :span="12">
                    <div>{{ contractNode.nodeDebt }}</div>
                    <div>{{ $t('Notice_nodeDebt') }}</div>
                  </el-col>

                  <!-- 提现阈值 -->
                  <el-col :span="12">
                    <div>{{ contractNode.withdraw }}</div>
                    <div>{{ $t('Notice_nodeClearing') }}</div>
                  </el-col>
                </div>

                <!-- 节点所有权额度 -->
                <div class="right col-12 col-sm-12 col-md-6 col-lg-6">
                  <el-col :span="12">
                    <div>{{ contractNode.nodeAvailable }}</div>
                    <div>{{ $t('Notice_nodelimit') }}</div>
                  </el-col>

                  <!-- 最大负债率 -->
                  <el-col :span="12">
                    <div>{{ contractNode.debtRate }}%</div>
                    <div>{{ $t('Notice_nodeMax') }}</div>
                  </el-col>
                </div>
              </el-row>

              <!-- 第三行 -->
              <el-row :gutter="5">
                <div class="left col-12 col-sm-12 col-md-6 col-lg-6">
                  <!-- 债务比例 -->
                  <el-col :span="12">
                    <div class="red">{{ contractNode.nodeDebtRate }}</div>
                    <div>{{ $t('Notice_nodeCurrent') }}</div>
                  </el-col>

                  <!-- 清算阈值 -->
                  <el-col :span="12">
                    <div>{{ contractNode.liquidateRate }}</div>
                    <div>{{ $t('Notice_nodeClearing2') }}</div>
                  </el-col>
                </div>

                <div class="right col-12 col-sm-12 col-md-6 col-lg-6">
                  <el-col :span="24">
                    <div class="status">
                      <span
                        >{{ minerInfo.live }} {{ $t('Notice_nodeALL') }}，</span
                      >
                      <span class="pass"
                        >{{ minerInfo.active }}
                        {{ $t('Notice_nodeEffective') }}，</span
                      >
                      <span class="error"
                        >{{ minerInfo.faulty }}
                        {{ $t('Notice_nodeError') }}</span
                      >
                      <!-- <span class="cover"
                        >80 {{ $t('Notice_nodeRecovering') }}</span
                      > -->
                    </div>
                    <div>{{ $t('Notice_nodeSector') }}</div>
                  </el-col>
                </div>
              </el-row>
            </div>
          </div>
        </div>
      </div>

      <!-- 可用余额 -->
      <div class="usable">
        <div class="infoLeft col-12 col-sm-12 col-md-2 col-lg-2">
          <SvgIcon name="infoAvatar" />
        </div>

        <div class="infoRight col-12 col-sm-12 col-md-10 col-lg-10">
          <!-- 节点可用余额 -->
          <div class="item">
            <div>{{ minerInfo.available }}</div>
            <div>{{ $t('Notice_nodeBalance') }}</div>
          </div>

          <!-- 锁仓奖励 -->
          <div class="item">
            <div>{{ minerInfo.vesting }}</div>
            <div>{{ $t('Notice_nodeLocked') }}</div>
          </div>

          <!-- 扇区抵押 -->
          <div class="item">
            <div>{{ minerInfo.pledge }}</div>
            <div>{{ $t('Notice_nodePledge') }}</div>
          </div>

          <!-- 扇区终止试算，预计清算可获得的FIL -->
          <div class="item">
            <div>{{ minerInfo.terminateFile }}</div>
            <div>{{ $t('Notice_nodeTrial') }}</div>
          </div>
        </div>
      </div>

      <!-- 投票决策 -->
      <div class="decision">
        <div class="left col-12 col-sm-12 col-md-12 col-lg-4">
          <div class="top">
            <!--  节点f0109272 清算投票决策 -->
            <i></i>
            {{ $t('Notice_node') }} {{ contractNode.minerId }}
            {{ $t('Notice_nodeDecision') }}
          </div>
          <div class="bottom" ref="echartsBox"></div>
        </div>

        <div class="middle col-12 col-sm-12 col-md-12 col-lg-8">
          <div class="top">
            <!-- 投票开始时间 -->
            <div class="left col-12 col-sm-12 col-md-6 col-lg-5">
              <div>{{ contractNode.voteBeginTime }}</div>
              <p>{{ $t('Notice_nodeStarts') }}</p>
            </div>

            <!-- 投票结束时间 -->
            <div class="right col-12 col-sm-12 col-md-6 col-lg-5">
              <div>{{ contractNode.voteEndTime }}</div>
              <p>{{ $t('Notice_nodeEnds') }}</p>
            </div>
          </div>

          <!-- 投票率 -->
          <div class="vote">
            {{ $t('Notice_noderate') }} {{ contractNode.voteRate }}
          </div>

          <!-- 文字描述 -->
          <p class="desc">
            {{ $t('Notice_nodeUsers') }}
          </p>

          <div class="cardBox">
            <!-- 是 -->
            <div class="item col-12 col-sm-12 col-md-12 col-lg-4">
              <div class="yes">
                {{ $t('Notice_nodeYES') }} {{ contractNode.agreeRate }}
              </div>
              <div>{{ contractNode.agreeCount }}</div>
            </div>

            <!-- 否 -->
            <div class="item col-12 col-sm-12 col-md-12 col-lg-4">
              <div class="no">
                {{ $t('Notice_nodeNO') }} {{ contractNode.rejectRate }}
              </div>
              <div>{{ contractNode.rejectCount }}</div>
            </div>

            <!-- 弃权  -->
            <div class="item col-12 col-sm-12 col-md-12 col-lg-4">
              <div class="abandon">
                {{ $t('Notice_nodeAbstain') }} {{ contractNode.abstainRate }}
              </div>
              <div>{{ contractNode.abstainCount }}</div>
            </div>
          </div>

          <!-- 投票 -->

          <div class="svg" @click="clickVote">
            <SvgIcon name="voteIcon" />
            <h4>{{ $t('Notice_nodeVote') }}</h4>
          </div>
        </div>
      </div>

      <!-- 详细说明 -->
      <div class="descBox">
        <h5>{{ $t('Notice_nodemechanism1') }}</h5>
        <h6>
          {{ $t('Notice_nodemechanism2') }}
        </h6>

        <h6>{{ $t('Notice_nodemechanism3') }}</h6>

        <h6>{{ $t('Notice_nodemechanism4') }}</h6>

        <p class="first">{{ $t('Notice_nodemechanism5') }}</p>

        <p>
          {{ $t('Notice_nodemechanism6') }}
        </p>

        <p>
          {{ $t('Notice_nodemechanism7') }}
        </p>

        <p>
          <strong>{{ $t('Notice_nodemechanism8') }}</strong>
          {{ $t('Notice_nodemechanism9') }}
        </p>

        <p>
          <strong> {{ $t('Notice_nodemechanism10') }}</strong>
          {{ $t('Notice_nodemechanism11') }}
        </p>
      </div>

      <!-- 投票弹框 -->
      <Vote :showVote="showVote" @close="close" />
    </div>
  </div>
</template>

<script setup>
import { warnNodeDetail } from '@/api/liquidate.js'
import Vote from './components/vote.vue'
import * as echarts from 'echarts'
import { debounce } from '@/utils/index'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeUnmount, markRaw, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useVoteStore } from '@/store/module/vote.js' //投票仓
import { useAccountStore } from '@/store/module/accounts.js' //账号仓

const router = useRouter()
// 使用仓库
const accountStore = useAccountStore()
const { account, isConnected } = storeToRefs(accountStore)
const voteStore = useVoteStore()
const { voteItem } = storeToRefs(voteStore)

onMounted(async () => {
  fromAccountAddress.value = accountStore.account
  form.value.id = await voteStore.voteItem.id
  getData()

  //根据浏览器的大小来改变大小
  window.addEventListener('resize', resizeHandler)
})

// 监听连接状态和在职身份和小狐狸账号
watch(
  () => accountStore.account,
  old1 => {
    fromAccountAddress.value = accountStore.account
  }
)

// 获取数据
const form = ref({
  id: '' // int	节点ID
})
const fromAccountAddress = ref() //取当前小狐狸连接账号
const contractNode = ref({
  minerId: '', //节点号
  nodeBalance: '', //节点总余额
  nodeDebt: '', //债务价值
  nodeAvailable: '', //节点所有权额度
  debtRate: '', //最大负责率
  liquidateRate: '', //清算闽值
  nodeDebtRate: '', //债务比例
  voteBeginTime: '', //投票开始时间
  voteEndTime: '', //投票结束时间
  agreeCount: '', //同意票数
  rejectCount: '', //反对票数
  abstainCount: '', //弃权票数
  agreeRate: '', //同意比例
  rejectRate: '', //反对比例
  abstainRate: '', //弃权比例
  diffRate: '', //债务值超过清算闽值
  voteRate: '', //投票率
  voteResults: '', //投票结果 1同意,2反对,3弃权
  resultsRate: '', //投票结果比例
  withdraw: '' //提现闽值
})

const minerInfo = ref({
  available: '', //节点可用余额
  vesting: '', //锁仓奖励
  pledge: '', //扇区质押
  active: '', //活跃扇区
  faulty: '', //异常扇区
  live: '', //扇区数据(全部)
  terminateFile: '' //扇区终止试算
})
const echartsForm = ref() //echarts数据
const getData = async () => {
  const res = await warnNodeDetail(form.value)

  if (res.code == 0) {
    contractNode.value = res.data.contractNode
    minerInfo.value = res.data.minerInfo

    echartsForm.value = await [
      {
        value: +contractNode.value.agreeRate.substr(
          0,
          contractNode.value.agreeRate.length - 1
        ),
        name: `Yes ${contractNode.value.agreeCount}`
      },
      {
        value: +contractNode.value.rejectRate.substr(
          0,
          contractNode.value.rejectRate.length - 1
        ),
        name: `No ${contractNode.value.rejectCount}`
      },
      {
        value: +contractNode.value.abstainRate.substr(
          0,
          contractNode.value.abstainRate.length - 1
        ),
        name: `Abstain ${contractNode.value.abstainCount}`
      }
    ]

    // 等有数据再渲染
    pieEcharts()
  } else {
    ElMessage.error(res.msg)
  }
}

// 点击返回
const clickBack = () => {
  router.push({
    path: '/home/inform'
  })
}

const resizeHandler = debounce(() => {
  if (pieCharts) {
    pieCharts.value.resize()
  }
}, 10)

const echartsBox = ref()
const pieCharts = ref(null)

const pieEcharts = async () => {
  if (echartsBox.value) {
    echarts.init(echartsBox.value).dispose() //先销毁

    pieCharts.value = markRaw(echarts.init(echartsBox.value))

    var option = {
      tooltip: {
        trigger: 'item'
      },
      color: ['#7139cf', '#ff483d', '#5b5b5b'],
      series: [
        {
          name: 'Vote Result',
          type: 'pie',
          radius: ['60%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 15,
            borderColor: '#fff',
            borderWidth: 0
          },

          label: {
            show: true,
            position: 'center'
          },

          emphasis: {
            label: {
              show: false,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },

          labelLine: {
            show: false
          },

          data: echartsForm.value
        }
      ]
    }

    option && pieCharts.value.setOption(option)
  }
}

// 控制投票弹框
const showVote = ref(false)
const clickVote = () => {
  showVote.value = true
}

// 关闭投票弹框
const close = () => {
  showVote.value = false
}

// 销毁
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>

<script>
export default {
  name: 'VoteInfo'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss'; //引用此混合样式

.container {
  position: relative;
  padding: 20px 20px 50px;
  // background: url('@/assets/img/homeBg1.png');
  background-size: 100% 100%;
  .bigCard {
    background: $cardBgColor;
    border-radius: 20px;
    padding: 20px 20px;
  }
}

// 返回
::v-deep .back {
  font-size: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  .iconBox {
    display: flex;
    align-items: center;
  }

  span {
    font-weight: 700;
    margin-left: 5px;
  }

  p {
    color: #ccc;
    font-size: 14px;
  }
}

// 节点信息
::v-deep .info {
  display: flex;

  border-radius: 20px;
  background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
  padding: 15px 10px;

  .leftBox {
    .bottom {
      text-align: center;
      padding-top: 20px;
      word-break: break-all;
      div:nth-child(2) {
        font-size: 12px;
        color: #ccc;
      }
    }
  }

  .rightBox {
    .infoRight {
      width: 100%;

      .el-col {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        margin: 5px 0;

        .red {
          color: #ff483d;
          font-weight: 700;
        }

        .status {
          font-size: 15px;
          .pass {
            color: #008535;
          }
          .error {
            color: #bb2915;
          }
          .cover {
            color: #c89000;
          }
        }
      }

      .left,
      .right {
        display: flex;
        justify-content: space-evenly;
      }

      .el-col div:nth-child(1) {
        word-break: break-all;
      }

      .el-col div:nth-child(2) {
        color: #ccc;
        font-size: 12px;
      }
    }
  }
}

// 可用余额
.usable {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .infoLeft {
    width: 100px;
    height: 100px;
    background: #fff;
    border-radius: 50%;
    margin: 0 auto;
    margin-top: -20px;

    .svg-icon {
      width: 100%;
      height: 100%;
      scale: 0.85;
    }
  }

  .infoRight {
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    margin: 10px 0;

    .item {
      flex: 1;
      word-break: break-all; //纯英文、数字、中文
      padding: 0 5px;

      div:last-child {
        font-size: 12px;
        color: #ccc;
      }
    }

    .item:nth-child(2) {
      border-right: 1px solid #5b5b5b;
      border-left: 1px solid #5b5b5b;
    }

    .item:nth-child(4) {
      color: #ff483d;
      border-left: 1px solid #5b5b5b;

      div:last-child {
        color: #ff483d;
      }
    }
  }
}

// 决策
.decision {
  display: flex;
  min-height: 350px;
  background: #34363e;
  border-radius: 20px;
  margin: 20px 0;
  padding: 20px 15px;

  .left {
    .top {
      background: #7139cf;
      padding: 3px 8px;
      border-radius: 8px;
      margin-left: 5px;
      margin-top: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;

      i {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #ff483d;
        margin-right: 5px;
      }
    }

    .bottom {
      width: 100%;
      min-height: 200px;
      margin-top: 20px;
    }
  }

  .middle {
    position: relative;
    margin-left: 40px;
    .top {
      display: flex;
      .left,
      .right {
        padding-right: 30px;
        p {
          font-size: 12px;
          color: #ccc;
        }
      }
    }

    // 投票率
    .vote {
      width: 150px;
      text-align: center;
      border-radius: 5px;
      padding: 5px 10px;
      border: 1px solid #65efad;
      color: #65efad;
      margin-top: 30px;
    }

    // 描述
    .desc {
      width: 70%;
      margin: 30px 0;
    }

    .cardBox {
      width: 80%;
      display: flex;
      .item {
        flex: 1;
        background: #000;
        border-radius: 15px;
        text-align: center;
        padding: 20px 15px;
        margin-right: 20px;

        div:nth-child(1) {
          margin-bottom: 5px;
        }

        div:nth-child(2) {
          word-break: break-all;
        }

        .yes {
          color: #7139cf;
        }

        .no {
          color: #ff483d;
        }

        .abandon {
          color: #5b5b5b;
        }
      }
    }

    // 投票
    .svg {
      position: absolute;
      top: -10px;
      right: 0;
      .svg-icon {
        width: 150px;
        height: 150px;
        cursor: pointer;
      }

      h4 {
        position: absolute;
        bottom: 50px;
        right: 55px;
        cursor: pointer;
      }
    }
  }
}

// 描述
.descBox {
  h5,
  h6,
  p {
    font-size: 14px;
    line-height: 20px;
  }

  h5 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 10px;
  }
  .first {
    margin: 20px 0;
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  ::v-deep .info {
    display: block;
  }

  // 决策
  .decision {
    display: block;
    min-height: 350px;
    background: #34363e;
    border-radius: 20px;
    margin: 20px 0;
    padding: 20px 15px;

    .middle {
      position: relative;
      margin-left: 0;
      .top {
        .left,
        .right {
          padding-right: 0;
        }
        .left {
          margin-bottom: 15px;
        }
      }

      // 投票率
      .vote {
        width: 150px;
        text-align: center;
        border-radius: 5px;
        padding: 5px 10px;
        border: 1px solid #65efad;
        color: #65efad;
        margin-top: 30px;
      }

      // 描述
      .desc {
        width: 100%;
        margin: 20px 0;
      }

      .cardBox {
        width: 100%;
        display: block;
        .item {
          margin-bottom: 20px;
        }
      }

      // 投票
      .svg {
        .svg-icon {
          width: 90px;
          height: 90px;
        }

        h4 {
          font-size: 12px;
          position: absolute;
          bottom: 35px;
          right: 35px;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  // 节点信息
  ::v-deep .info {
    display: block;
    border-radius: 20px;
    background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
    padding: 5px 15px;

    .rightBox {
      .infoRight {
        width: 100%;

        .item {
          .top,
          .middle,
          .bottom {
            word-break: break-all;
            div:nth-child(2) {
              color: #ccc;
              font-size: 12px;
            }
          }
        }

        .el-col {
          font-size: 12px;

          .status {
            font-size: 12px;
          }
        }
      }
    }
  }

  // 可用余额
  .usable {
    display: block;

    .infoLeft {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin: 10px auto;

      .svg-icon {
        width: 100%;
        height: 100%;
        scale: 0.85;
      }
    }

    .infoRight {
      display: block;
      text-align: left;

      .item {
        padding: 5px;
      }

      .item:nth-child(2) {
        border-right: none;
        border-left: none;
      }

      .item:nth-child(4) {
        border-left: none;
      }
    }
  }

  // 决策
  .decision {
    display: block;
    min-height: 350px;
    background: #34363e;
    border-radius: 20px;
    margin: 20px 0;
    padding: 20px 15px;

    .middle {
      position: relative;
      margin-left: 0;
      .top {
        display: block;

        .left,
        .right {
          padding-right: 0;
        }
        .left {
          margin-bottom: 15px;
        }
      }

      // 投票率
      .vote {
        width: 150px;
        text-align: center;
        border-radius: 5px;
        padding: 5px 10px;
        border: 1px solid #65efad;
        color: #65efad;
        margin-top: 30px;
      }

      // 描述
      .desc {
        width: 100%;
        margin: 20px 0;
      }

      .cardBox {
        width: 100%;
        display: block;
        .item {
          margin-bottom: 20px;
        }
      }

      // 投票
      .svg {
        position: absolute;
        top: -20px;
        right: -30px;
        .svg-icon {
          width: 90px;
          height: 90px;
        }

        h4 {
          font-size: 12px;
          position: absolute;
          bottom: 35px;
          right: 35px;
        }
      }
    }
  }

  // 返回
  .back {
    p {
      color: #ccc;
      font-size: 12px;
    }
  }
}
</style>
