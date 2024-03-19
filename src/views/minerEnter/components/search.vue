<template>
  <div id="MinerSearch" class="container">
    <!-- 节点入驻介绍 -->
    <div class="topProd">
      <h4>{{ $t('Check') }}</h4>
      <p>
        {{ $t('Check_txt') }}
      </p>
    </div>

    <!-- 卡片 -->
    <div class="bottomCard">
      <!-- 上一步 -->
      <div
        class="start d-none d-sm-none d-md-none d-lg-block col-2 col-sm-2 col-md-2 col-lg-2"
        style="display: inline-block"
      >
        <div>Start</div>
      </div>

      <!-- 内容 -->
      <div class="cardInfo col-8 col-sm-8 col-md-8 col-lg-8">
        <div class="contentBox" id="minerEnterOne">
          <!-- 搜索栏 -->
          <div class="searchBox">
            <div class="search col-9 col-sm-9 col-md-9 col-lg-10">
              <el-input
                @input="inputFn"
                v-model.trim="input"
                size="large"
                :placeholder="$t('Check_address')"
                :prefix-icon="Search"
              />
              <span class="inputError">{{ errorTxt }} </span>
            </div>

            <!-- 搜索 -->
            <div class="searchBtn col-3 col-sm-3 col-md-3 col-lg-2">
              <el-button @click="clickSearch">{{
                $t('Check_Search')
              }}</el-button>
            </div>
          </div>

          <!-- 信息栏 -->
          <div class="info">
            <!-- 节点余额 -->
            <div class="rowItem">
              <div class="leftBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>{{ $t('Check_Total') }}</div>
                <div v-if="minerData.balance2">
                  {{ minerData.balance2 }} FIL
                </div>
                <div v-else>一 一</div>
              </div>
            </div>

            <!-- 节点可用余额 -->
            <div class="rowItem">
              <div class="leftBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>
                  {{ $t('Check_Available') }}
                </div>
                <div v-if="minerData.available2">
                  {{ minerData.available2 }} FIL
                </div>
                <div v-else>一 一</div>
              </div>

              <!-- 锁仓奖励 -->
              <div class="rightBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>
                  {{ $t('Check_Locked') }}
                </div>
                <div>{{ minerData.vesting }}</div>
              </div>
            </div>

            <!-- 扇区质押 -->
            <div class="rowItem">
              <div class="leftBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>
                  {{ $t('Check_Initial') }}
                </div>
                <div>{{ minerData.pledge }}</div>
              </div>

              <!-- 有效算力 -->
              <div class="rightBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>
                  {{ $t('Check_Power') }}
                </div>
                <div>{{ minerData.power }}</div>
              </div>
            </div>

            <!-- 扇区大小 -->
            <div class="rowItem">
              <div class="leftBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>
                  {{ $t('Check_Size') }}
                </div>
                <div>{{ minerData.sectorSize }}</div>
              </div>
            </div>

            <!-- 扇区状态 -->
            <div class="rowItem">
              <div class="leftBox col-12 col-sm-12 col-md-12 col-lg-12">
                <div class="col-6 col-sm-6 col-md-12 col-lg-12">
                  {{ $t('Check_Status') }}
                </div>
                <div>
                  <span>{{ minerData.live }} {{ $t('Check_ALL') }}，</span>

                  <span style="color: #008535">
                    {{ minerData.active }} {{ $t('Check_Effective') }}，
                  </span>

                  <span style="color: #bb2915">
                    {{ minerData.faulty }} {{ $t('Check_Error') }}
                  </span>

                  <!-- <span style="color: #c89000">
                    {{ $t('Check_Recovering') }}
                  </span> -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="prevNextBtn d-block d-sm-block d-md-block d-lg-none">
          <el-button class="prevPage">Start</el-button>
          <el-button @click="nextClick" class="nextPage">Next</el-button>
        </div>
      </div>

      <!-- 下一步 -->
      <div
        @click="nextClick"
        style="display: inline-block"
        class="next d-none d-sm-none d-md-none d-lg-block col-2 col-sm-2 col-md-2 col-lg-2"
        :class="showNext ? 'okColor' : ''"
      >
        <div
          v-loading="loading"
          :element-loading-spinner="svg"
          element-loading-svg-view-box="-10, -10, 50, 50"
          element-loading-text="Loading..."
          element-loading-background="#5f4982"
        >
          {{ loading ? '' : 'Next' }}
        </div>
      </div>

      <el-dialog
        :align-center="true"
        :model-value="showSign"
        :show-close="false"
        :close-on-press-escape="false"
        width="260px
      "
      >
        <div style="text-align: center">
          <div>
            <el-button link>数据正在请求中...</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { minerMinerInfo } from '@/api/checkIn.js'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useAccountStore } from '@/store/module/accounts.js'
import { useMinerStore } from '@/store/module/miner.js' //miner仓
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router' //路由

// 初始化
onMounted(() => {
  accountStore.navIndex = 2
  if (!minerStore.checkInBool) {
    if (minerStore.minerObj) {
      input.value = minerStore.minerObj.node
      minerData.value = minerStore.minerObj
      isEnterRole.value = minerStore.role

      if (minerStore.minerObj.available2 < 0) {
        // 节点负债不允许点击下一步
        showNext.value = false
      } else {
        showNext.value = true
      }
    }
  } else if (!minerStore.checkInBool && !minerStore.minerObj) {
    router.push({
      path: '/buff/buff_home'
    })
  }
})

const router = useRouter() // 路由

// 使用pinia仓
const accountStore = useAccountStore()
const { isConnected, navIndex } = storeToRefs(accountStore)
const minerStore = useMinerStore()
const {
  minerObj,
  transformWei,
  minerEnterContractId,
  contractObj,
  contractId2Address,
  judgeIsEnter,
  judgeRole,
  checkInBool,
  role,
  nodeDebt
} = storeToRefs(minerStore)

// 加载logo
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `

const input = ref() //搜索输入框
const showNext = ref(false) //允许点击下一步
const errorTxt = ref() //搜索错误提示
const loading = ref(false) //加载下一页
const showSign = ref(false) //控制数据加载弹框
const isEnterRole = ref()

// 节点信息
const minerData = ref({
  balance: '一 一', //节点余额
  balance2: '', //节点余额
  available: '一 一', //可用余额
  available2: '', //可用余额
  borrowableAmount: '一 一', //最大可借
  vesting: '一 一', //锁仓
  pledge: '一 一', //质押
  power: '一 一', //有效算力
  sectorSize: '一 一', //扇区大小
  active: '一 一', //有效扇区
  faulty: '一 一', //失败扇区
  live: '一 一', //总扇区
  owner: '一 一', //owner钱包
  beneficiary: '一 一', //收益人
  node: '', //节点
  mortgageType: '', //入职身份  0不在职 1owner 2受益人
  role: 0 //委托角色 0 owner 1 受益人
})

// 获取节点信息
const getSearchData = async () => {
  const res = await minerMinerInfo({
    actor: input.value
  })

  if (res.code == 0) {
    minerData.value = res.data
    minerStore.minerObj = await res.data

    minerStore.transformWei() //把金额转以太,千分位展示
    minerData.value.node = input.value //存储查询节点
    minerStore.contractObj.To = input.value

    // 判断节点是否负债，负债不允许点击下一步
    if (minerStore.minerObj.available2 < 0) {
      showNext.value = false
      minerStore.nodeDebt = true //表示负债
    } else {
      showNext.value = true
      minerStore.nodeDebt = false //表示没有负债
    }

    errorTxt.value = '' //重置错误提示

    // 判断是否已经入职
    isEnterRole.value = minerStore.judgeRole(res.data)
    // console.log('isEnterRole.value:', isEnterRole.value)

    // 使用定时器关闭页面
    setTimeout(() => {
      showSign.value = false //关闭弹框加载
    }, 300)
  } else {
    // 使用定时器关闭页面
    setTimeout(() => {
      showSign.value = false //关闭弹框加载
    }, 300)

    showNext.value = false // 查询报错则,不允许进入下一步
    errorTxt.value = res.msg //显示接口错误信息

    // 重置表单
    minerData.value = {
      balance: '一 一', //节点余额
      balance2: '', //节点余额
      available: '一 一', //可用余额
      available2: '', //可用余额
      vesting: '一 一', //锁仓
      pledge: '一 一', //质押
      power: '一 一', //有效算力
      sectorSize: '一 一', //扇区大小
      active: '一 一', //有效扇区
      faulty: '一 一', //失败扇区
      live: '一 一', //总扇区
      owner: '一 一', //owner钱包
      beneficiary: '一 一', //收益人
      node: '', //节点
      role: 0 //委托角色 0 owner 1 受益人
    }
  }
}

// 输入框方法
const inputFn = val => {
  //清空报错
  if (!val) {
    errorTxt.value = ''
  }
}

// 点击搜索
const clickSearch = async () => {
  if (input.value !== null && input.value !== undefined && input.value !== '') {
    showSign.value = true //打开数据加载
    getSearchData() //获取节点信息
  }
}

//点击下一步
const nextClick = async () => {
  if (showNext.value) {
    loading.value = true
    minerStore.checkInBool = true

    if (isEnterRole.value == 3) {
      //跳到入职角色
      setTimeout(() => {
        router.push({
          path: '/buff/minerRoleInfo'
        })
        loading.value = false
        // 清空数据
        minerData.value = {
          balance: '一 一', //节点余额
          available: '一 一', //可用余额
          vesting: '一 一', //锁仓
          pledge: '一 一', //质押
          power: '一 一', //有效算力
          sectorSize: '一 一', //扇区大小
          active: '一 一', //有效扇区
          faulty: '一 一', //失败扇区
          live: '一 一', //总扇区
          owner: '一 一', //owner钱包
          beneficiary: '一 一', //收益人
          node: '', //节点
          role: 0 //委托角色 0 owner 1 受益人
        }
      }, 500)
    } else if (isEnterRole.value !== 3 && minerData.value.mortgageType !== 0) {
      setTimeout(() => {
        router.push({
          path: '/buff/enterSuccess'
        })
        loading.value = false
        // 清空数据
        minerData.value = {
          balance: '一 一', //节点余额
          available: '一 一', //可用余额
          vesting: '一 一', //锁仓
          pledge: '一 一', //质押
          power: '一 一', //有效算力
          sectorSize: '一 一', //扇区大小
          active: '一 一', //有效扇区
          faulty: '一 一', //失败扇区
          live: '一 一', //总扇区
          owner: '一 一', //owner钱包
          beneficiary: '一 一', //收益人
          node: '', //节点
          role: 0 //委托角色 0 owner 1 受益人
        }
      }, 500)
    } else if (minerData.value.mortgageType == 0) {
      await ElMessage.error('该节点已退出合约，需进行owner修改')
      // 跳转到退出页面,让用户操作退出
      setTimeout(() => {
        // 离职
        router.push({
          path: `/buff/minerInfoExit/${minerStore.minerObj.node}`
        })
      }, 500)
    }
  }

  // else if (!showNext.value) {
  //   ElMessage.error('The available balance of the node is less than 0')
  // } else {
  //   ElMessage.error('Wallet not connected')
  // }
}
</script>

<script>
export default {
  name: 'MinerSearch'
}
</script>
<style lang="scss" scoped>
::v-deep #minerEnterOne {
  .el-loading-mask {
    border-radius: 20px;
  }
}
::v-deep .contentBox {
  min-height: 500px;
  background: linear-gradient(180deg, #2d1e46 0%, #5629ad 100%);
  border-radius: 20px;
  z-index: 5;
}

// 搜索
::v-deep .searchBox {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30px 50px;

  /* 搜索框 */
  .search {
    flex: 1;
    margin-right: 30px;
    .el-input {
      .el-input__wrapper {
        background: #272932;
        border-radius: 10px;
        box-shadow: none;
        border: 1px solid rgba(255, 255, 255, 0.6);

        &.is-focus {
          box-shadow: 0 0 0 1px #ccc;
        }
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
    .inputError {
      color: #bb2915;
      padding-left: 10px;
      font-size: 12px;
    }
  }

  /* 按钮 */
  .el-button {
    width: 100%;
    height: 42px;
    border: 1px solid #fcaa13;
    border-radius: 10px;
    background-color: transparent;
    color: #fcaa13;

    &:focus {
      border: 1px solid #ffcc6c;
      color: #ffcc6c;
    }

    .el-loading-mask {
      background: transparent;
    }
  }
}

// 信息
.info {
  position: relative;
  padding: 10px 100px;

  .rowItem {
    display: flex;
    flex-wrap: wrap;

    .leftBox,
    .rightBox {
      margin-bottom: 15px;
      font-family: Montserrat;
      div:nth-child(1) {
        margin-bottom: 10px;
        color: #ccc;
      }
      div:nth-child(2) {
        margin-left: 30px;
      }

      .status {
        width: 100%;
      }
    }
  }
}

//入驻介绍
.topProd {
  padding: 20px 50px;
  h4 {
    margin-bottom: 15px;
  }
  p {
    // text-indent: 2em;
    line-height: 30px;
    color: #ccc;
  }
}

@keyframes moveLeft {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(-100%, 0);
  }
}

// 卡片
::v-deep .bottomCard {
  width: 100%;
  padding: 20px 30px;
  display: flex;
  // justify-content: center;

  // 卡片信息
  .cardInfo {
    flex: 1;
    z-index: 5;
    overflow: hidden;

    // .move {
    //   animation: 1s moveLeft;
    // }
  }

  .start,
  .next {
    display: flex;
    align-items: center;
    min-height: 400px;
    width: 150px;
    background: #5f4982;
    border-radius: 12px;
    font-size: 25px;
    scale: 0.8;
    .el-loading-mask {
      border-radius: 10px;
      .el-loading-spinner {
        top: 0;
        display: flex;
        flex-direction: column;

        .path {
          stroke: #ccc;
        }
      }
      .el-loading-text {
        color: #ccc;
        font-size: 20px;
        font-weight: 800;
      }
    }
  }

  .start {
    margin-right: -20px;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ccc;
    }
  }

  .next {
    &:hover {
      color: #6be585;
    }

    margin-left: -20px;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ccc;
    }
  }

  .okColor {
    cursor: pointer;
    background: #7b33c3;
    div {
      color: #fff;
    }
  }

  .prevNextBtn {
    width: 100%;
    text-align: center;
    .el-button {
      margin: 20px 10px;
      color: #fff;
      background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);

      &:hover {
        color: #6be585;
      }
    }
  }
}

// 类型弹框
::v-deep .el-dialog {
  background: #d9d9d9;
  border-radius: 15px;

  .el-dialog__header {
    font-size: 18px;
    padding: 10px;
    color: #000;
  }

  .el-dialog__body {
    padding: 0px 10px 10px;

    .el-button {
      padding: 15px;
      font-size: 20px;
      color: #000;
    }
  }
}

@media screen and (max-width: 768px) {
  .topProd {
    padding: 20px 10px;
  }
  ::v-deep .bottomCard {
    padding: 0 0 20px;
    display: flex;
    justify-content: center;
  }

  // 搜索
  ::v-deep .searchBox {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 20px 15px;
  }

  // 信息
  .info {
    position: relative;
    padding: 10px 20px;
    text-align: center;
    .rowItem {
      display: flex;
      flex-wrap: wrap;

      .leftBox,
      .rightBox {
        margin-bottom: 15px;
        font-family: Montserrat;
        div:nth-child(1) {
          margin-bottom: 10px;
          color: #ccc;
        }

        div:nth-child(2) {
          margin-left: 15px;
          font-size: 12px;
        }

        .status {
          width: 100%;
        }
      }
    }
  }
}
</style>
