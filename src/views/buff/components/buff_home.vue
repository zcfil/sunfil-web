<template>
  <div id="BuffHome" class="container">
    <div class="top">
      <div class="topLeft col-12 col-sm-12 col-md-12 col-lg-8">
        <!-- 搜索节点 -->
        <div class="leftBox col-12 col-sm-12 col-md-12 col-lg-8">
          <el-input
            v-model="input1"
            size="large"
            :placeholder="$t('Search')"
            :prefix-icon="Search"
            @input="inputSearch"
          />
          <!-- <div v-if="searchError" class="error">{{ $t('SearchError') }}</div> -->

          <div class="filtrationBox">
            <h4>{{ $t('Search_List') }}</h4>

            <span @click="clickBtn">
              <SvgIcon
                name="filtration"
                style="
                  width: 20px;
                  height: 20px;
                  margin-top: -3px;
                  margin-right: 5px;
                "
              />
              <i v-if="!show" style="font-style: normal">
                {{ $t('Search_in') }}</i
              >

              <i v-else style="font-style: normal">{{ $t('Search_exited') }}</i>
            </span>
          </div>
        </div>

        <!-- 节点入驻 -->
        <div
          @click="checkInClick"
          class="rightBox col-12 col-sm-12 col-md-12 col-lg-4"
        >
          <h1>{{ $t('Search_Check') }}</h1>
          <span>{{ $t('Search_Enter') }}</span>
        </div>
      </div>

      <div class="topRight col-12 col-sm-12 col-md-12 col-lg-4">
        <p>
          <span>
            <span style="font-size: 12px">{{ $t('loan') }}&nbsp;</span>
            <span style="font-size: 17px; font-weight: 800">APY</span>
          </span>
          <i :class="greenCircle"></i>
        </p>
        <!-- 借贷 APY -->

        <h2 class="countStyleLoan countColorLoan">
          <countFlopTest
            :val="(totalObj.loanAPY * 100).toFixed(2)"
            suffix="%"
          />
        </h2>
        <!-- 资金利用率 -->
        <div class="useRate">
          <h5 style="font-weight: 700">{{ $t('U_rate') }}</h5>

          <h5 class="countStyle2">
            <countFlopTest
              :val="(totalObj.financeUseRate * 100).toFixed(2)"
              suffix="%"
            />
          </h5>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="bottomLeft col-12 col-sm-12 col-md-12 col-lg-8">
        <div
          class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-4 g-10 g-lg-4"
        >
          <div
            @click="clickMiner(item)"
            v-for="(item, index) in nodeArr"
            :key="index"
            class="col"
          >
            <div class="p-3 itemBox">
              <div class="svgBox">
                <SvgIcon :name="(item.id % 26).toString()" />
              </div>
              <h5 style="font-weight: 800">
                {{ item.nodeId }}
              </h5>

              <div class="itemCard">
                <!-- 节点总余额 -->
                <div class="item">
                  <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ $t('Search_Total') }}
                  </div>
                  <div class="right col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ item.nodeTotalBalance }} FIL
                  </div>
                </div>

                <!-- 债务 -->
                <div class="item">
                  <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ $t('Search_Debt') }}
                  </div>
                  <div class="right col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ item.debtValue }} FIL
                  </div>
                </div>
                <!-- 节点权益额度 -->
                <div class="item">
                  <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ $t('Search_limit') }}
                  </div>
                  <div class="right col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ item.nodeOwnershipBalance }} FIL
                  </div>
                </div>
                <!-- 最大债务比 -->
                <div class="item">
                  <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ $t('Search_Max') }}
                  </div>
                  <div class="right col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ item.maxDebtRatio * 100 }}%
                  </div>
                </div>
                <!-- 清算阈值 -->
                <div class="item">
                  <div class="left col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ $t('Search_Clearing') }}
                  </div>
                  <div class="right col-6 col-sm-6 col-md-6 col-lg-6">
                    {{ item.settlementThreshold * 100 }}%
                  </div>
                </div>

                <!-- 当前债务比率 -->
                <div>{{ $t('Search_Current') }}</div>
                <el-progress
                  :text-inside="true"
                  :stroke-width="24"
                  :percentage="
                    item.debtRatio * 100 > 100 ? 100 : item.debtRatio * 100
                  "
                  :format="_format(item.debtRatio * 100)"
                  status="success"
                />
              </div>

              <!-- 闪电icon -->
              <div
                v-if="accountStore.isConnected && item.isOperator"
                class="lightningBox"
              >
                <div class="lightning">
                  <SvgIcon name="lightning" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottomRight col-12 col-sm-12 col-md-12 col-lg-3">
        <Sidebar />
      </div>
    </div>
  </div>
</template>

<script setup>
import countFlopTest from '@/components/countFlopTest.vue'
import { getNodeInfoList } from '@/api/node.js'
import { useAccountStore } from '@/store/module/accounts.js'
import { useBuffStore } from '@/store/module/buff.js' //buff仓
import { useMinerStore } from '@/store/module/miner.js' //节点仓
import { useSidebarStore } from '@/store/module/sidebar.js' //侧边栏数据
import { useRateContractStore } from '@/store/module/rateContract'
import { _format } from '@/utils/num.js' //处理数据方法
import { storeToRefs } from 'pinia'
import Sidebar from '@/components/sidebar.vue' //侧边栏组件
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router' //路由

const router = useRouter() //路由

// 使用仓库

const accountStore = useAccountStore()
const { isConnected, account } = storeToRefs(accountStore)
const buffStore = useBuffStore()
const { actorInfo } = storeToRefs(buffStore)
const minerStore = useMinerStore()
const { checkInBool, minerObj } = storeToRefs(minerStore)
const sidebarStore = useSidebarStore()
const { rateData, getTotalFilSideInfo } = storeToRefs(sidebarStore)
const rateContractStore = useRateContractStore()
const { getNodeInfoListData } = storeToRefs(rateContractStore)

onMounted(() => {
  if (accountStore.isConnected) {
    form.value.operator = accountStore.account
  }
  minerStore.minerObj = '' //清空节点查询信息
  minerStore.checkInBool = false
  changeColor()
  getList()
  getTotalFilSideData()
})

// 侦听账号改变
watch(
  () => [accountStore.account, sidebarStore.rateData],
  async ([val, val2], [old, old2]) => {
    if (val !== old) {
      form.value.operator = await val
      getList()
    }

    if (val2 !== old2) {
      totalObj.value = val2
    }
  }
)

const form = ref({
  nodeId: '', //	否	string	节点id, 如节点为t032219, 传值t032219即可
  status: 1, //	否	int64	节点状态:1 入职,2 离职
  operator: '', //	否	string	当前小狐狸地址, 未连接则传空,用以确定有哪个节点是和小狐狸绑定的
  page: 1, //	否	int64	页码
  pageSize: 999999 //	否	int64	每页条数
})

// 获取数据
const totalObj = ref({
  loanAPY: '', // 质押利率
  financeUseRate: '' // 资金利用率
})

const getTotalFilSideData = async () => {
  totalObj.value = await sidebarStore.getTotalFilSideInfo()
}

// 获取节点列表
const nodeArr = ref([])
const getList = async () => {
  const res = await getNodeInfoList(form.value)

  if (
    res.data.list == null ||
    res.data.list == 'undefined' ||
    res.data.list.length <= 0
  ) {
    nodeArr.value = []
  } else {
    nodeArr.value = res.data.list
  }
}

const greenCircle = ref('greenCircle') //呼吸灯类名
const time = ref()
const changeColor = () => {
  time.value = setInterval(async () => {
    if (greenCircle.value == 'greenCircle') {
      greenCircle.value = 'grayColor'
    } else if (greenCircle.value == 'grayColor') {
      greenCircle.value = 'greenCircle'
    }
  }, 1000)
}

// 搜索
const input1 = ref()
const searchError = ref(false)
const inputSearch = async () => {
  form.value.nodeId = await input1.value
  getList()
}

// 点击筛选
const show = ref(false)
const clickBtn = () => {
  show.value = show.value ? false : true
  if (show.value) {
    form.value.status = 2 //退出
    getList()
  } else {
    form.value.status = 1 //入驻
    getList()
  }
}

//节点入驻
const checkInClick = () => {
  minerStore.checkInBool = true
  router.push({
    path: '/buff/minerSearch'
  })
}

// 点击节点
const clickMiner = item => {
  // 拿到被点节点
  buffStore.actorInfo = item
  // 在职
  if (form.value.status == 1) {
    router.push({
      path: `/buff/minerInfo/${buffStore.actorInfo.nodeId}`
    })
  } else {
    // 离职
    router.push({
      path: `/buff/minerInfoExit/${buffStore.actorInfo.nodeId}`
    })
  }
}
</script>

<script>
export default {
  name: 'BuffHome'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss'; //引用此混合样式

.top,
.bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
}

.topLeft {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-right: 20px;
  .leftBox {
    flex: 1;
    margin-right: 20px;
    height: 60%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .error {
    font-size: 12px;
    color: #bb2915;
    margin-top: -10px;
    margin-left: 10px;
  }

  .rightBox {
    height: 65%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: 20px 15px;
    background: linear-gradient(180deg, #7940cf 0%, #5921cb 100%);
    border-radius: 20px;
    cursor: pointer;
    text-align: center;

    &:hover {
      color: #6be585;
    }

    span {
      font-size: 14px;
      word-break: break-all;
    }
  }
}

/* 搜索框 */
::v-deep .el-input {
  .el-input__wrapper {
    background: #272932;
    border-radius: 10px;
    box-shadow: none;
    padding: 20px;
    .el-input__inner {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 28px;
      color: #8f8f8f;
    }
    .el-input__prefix {
      font-size: 20px;
    }
  }
}

/* 已入驻 */
::v-deep .filtrationBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    color: #ccc;
    border: 1px solid #ccc;
    padding: 5px 25px;
    border-radius: 10px;
    cursor: pointer;

    .svg-icon {
      color: #ccc;
    }

    &:hover {
      border: 1px solid #8c67f7;
      color: #8c67f7;
      .svg-icon {
        color: #8c67f7;
      }
    }
  }
}

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

  h2 {
    text-align: center;
    font-style: normal;
    font-weight: 800;
    font-size: 50px;
    text-transform: capitalize;
    background: $txtColor;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    padding: 10px 0;
  }

  div {
    font-weight: 800;
  }

  h5 {
    font-weight: 700;
  }
}

/* 底部左边 */
.bottomLeft {
  margin-right: 20px;
  margin-top: -60px;
  .itemBox {
    position: relative;
    min-width: 180px;
    padding: 15px 5px !important;
    border-radius: 10px;
    background: $cardBgColor;
    // margin-left: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    .svgBox {
      transform: scale(0.9);
      width: 50px;
      height: 50px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      .svg-icon {
        width: 75%;
        height: 75%;
      }
    }

    h5 {
      margin: 15px 0;
      transform: scale(0.9);
    }

    .itemCard {
      color: #ccc;
      font-size: 12px;
      transform: scale(0.9);
      .item {
        display: flex;
        justify-content: space-between;
        padding-bottom: 5px;
        .right {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          word-break: break-all; //纯英文、数字、中文
        }
      }

      ::v-deep .el-progress-bar {
        margin-top: 5px;
        .el-progress-bar__outer {
          height: 18px !important;
          border-radius: 100px;
          background-color: #493a65;
        }
        .el-progress-bar__inner {
          background: linear-gradient(90deg, #773fcf 0%, #5b23cb 100%);
        }
      }
    }

    .lightningBox {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      // background: rgba(255, 255, 255, 0.1);

      position: absolute;
      top: -20px;
      right: 0;

      .lightning {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        // background: rgba(255, 255, 255, 0.2);
        z-indent: 333;
        display: flex;
        align-items: center;
        justify-content: center;
        .svg-icon {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

/* 底部右边 */
.bottomRight {
  flex: 1;
  margin-bottom: 20px;
}

@media screen and (min-width: 768px) and (max-width: 990px) {
  .topLeft {
    .leftBox {
      height: auto;
      margin-right: 0;
      margin-bottom: 20px;
    }
    .rightBox {
      height: 40%;
    }
  }

  .topRight {
    margin-top: 20px;
  }
  .bottomLeft {
    margin-right: 0px;
    margin-top: 0;
    .itemBox {
      margin-bottom: 30px;
    }
  }
}

@media screen and (max-width: 768px) {
  .bottomLeft {
    margin-right: 0px;
    margin-top: 0;

    .itemBox {
      margin-bottom: 30px;
    }
  }
  .topLeft {
    .leftBox {
      height: auto;
      margin-right: 0;
      margin-bottom: 20px;
    }
    .rightBox {
      height: 40%;
      padding: 20px 20px;
    }
  }

  .topRight {
    margin-top: 20px;
  }
}

::v-deep .countStyleLoan {
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

// 设置字体颜色
::v-deep .countColorLoan {
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
    font-size: 25px;
    color: #fff;
  }
}
</style>
