<template>
  <!-- 设置操作人 -->
  <div id="SetOperator" class="container">
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
        @click="backClick"
        class="start d-none d-sm-none d-md-none d-lg-block col-2 col-sm-2 col-md-2 col-lg-2"
        style="display: inline-block"
      >
        <div>Back</div>
      </div>

      <!-- 内容 -->
      <div class="cardInfo col-8 col-sm-8 col-md-8 col-lg-8">
        <div class="contentBox">
          <div class="title">
            <h2>{{ $t('operator_Node') }} {{ node }}</h2>
            <div @click="clickNowAccount" class="nowAccount">
              <span>选择当前钱包</span>
            </div>
          </div>

          <!-- 设置操作人 -->
          <div class="setAddress">
            <div class="txt">{{ $t('operator') }}</div>

            <div class="input">
              <el-input
                v-model="input"
                @input="inputFn"
                :placeholder="$t('operator_Address')"
              ></el-input>
            </div>

            <!--     智能合约通过分离存储提供商的所有权和运营来确保安全的节点授权，只允许授权的操作人执行借贷、还款和取款权操作。 -->
            <p>
              {{ $t('operator_txt') }}
            </p>
          </div>
        </div>

        <div class="prevNextBtn d-block d-sm-block d-md-block d-lg-none">
          <el-button @click="backClick" class="prevPage">Back</el-button>
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
    </div>
  </div>
</template>

<script setup>
import {
  filecoinStateLookupID,
  filecoinEthAddressToFilecoinAddress
} from '@/api/checkIn.js'
import { useMinerStore } from '@/store/module/miner.js'
import { useAccountStore } from '@/store/module/accounts.js'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router' //路由
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Web3 from 'web3'
// 使用仓库
const accountStore = useAccountStore()
const { account, isConnected, accountIsNoConnect } = storeToRefs(accountStore)
const minerStore = useMinerStore()
const { minerObj, nodeDebt } = storeToRefs(minerStore)

const router = useRouter()

// var web3 = new Web3('https://api.calibration.node.glif.io/rpc/v1') // 测试网

// 初始化
onMounted(async () => {
  // 页面刷新时回到第一步
  if (minerStore.minerObj && !minerStore.nodeDebt) {
    node.value = minerStore.minerObj.node
  } else {
    // router.push({
    //   path: '/buff/buff_home'
    // })
  }
})

// 加载svg
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      ` //加载图标
const node = ref()
const input = ref() //输入框
const showNext = ref(false) //允许点击下一步
const loading = ref(false) //加载下一页
// 把钱包地址转成 f4
const query = ref({
  jsonrpc: '2.0',
  method: 'Filecoin.EthAddressToFilecoinAddress',
  params: [],
  id: Math.floor(Math.random() * 100) //随机向下取整
})

// 检查钱包是否上链
const query5 = ref({
  jsonrpc: '2.0',
  method: 'Filecoin.StateLookupID',
  params: [
    '', //小狐狸0X地址转换成filecion  f4地址
    []
  ],
  id: Math.floor(Math.random() * 100) //随机向下取整
})

// 输入框
const inputFn = val => {
  if (val) {
    showNext.value = true
  } else {
    showNext.value = false
  }
}

// 获取f4地址
const getF4 = async () => {
  query.value.params = await [input.value]
  const res = await filecoinEthAddressToFilecoinAddress(query.value)

  if (!res.error) {
    // 保存操作人 f4地址
    minerStore.minerObj.operatorAddressF4 = res.result

    // switch (minerStore.minerObj.mode) {
    //   case 'single':
    //     // 单签
    //     setTimeout(() => {
    //       loading.value = false
    //       router.push({
    //         path: '/buff/singleReceiveApply'
    //       })
    //     }, 500)
    //     break

    //   //多签
    //   case 'more':
    //     setTimeout(() => {
    //       loading.value = false
    //       router.push({
    //         path: '/buff/multipleReceiveApply'
    //       })
    //     }, 500)

    //     break
    // }

    query5.value.params = await [res.result, []]
    await lookId()
  } else {
    loading.value = false
    ElMessage.error(res.error.message)
  }
}

// 检查钱包是否上链
const lookId = async () => {
  const res = await filecoinStateLookupID(query5.value)
  // 如果报错
  if (!res.error) {
    switch (minerStore.minerObj.mode) {
      case 'single':
        // 单签
        setTimeout(() => {
          router.push({
            path: '/buff/singleReceiveApply'
          })
          loading.value = false
        }, 500)
        break

      //多签
      case 'more':
        setTimeout(() => {
          router.push({
            path: '/buff/multipleReceiveApply'
          })
          loading.value = false
        }, 500)

        break
    }
  } else {
    // 提示
    ElMessage.error(`找不到该钱包，请检查钱包是否正常，${res.error.message}`)
  }
}

const clickNowAccount = () => {
  if (accountStore.isConnected) {
    input.value = accountStore.account
  } else {
    input.value = accountStore.accountIsNoConnect
  }

  showNext.value = true
}

// 上一步-从头开始签名
const backClick = async () => {
  router.push({
    path: '/buff/minerSearch'
  })
}

// 下一步
const nextClick = async () => {
  if (showNext.value) {
    loading.value = true //开启加载

    // 保存操作人
    minerStore.minerObj.operatorAddress = input.value
    await getF4()
  }
}
</script>

<script>
export default {
  name: 'SetOperator'
}
</script>
<style lang="scss" scoped>
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
    min-height: 500px;
    width: 150px;
    background: #7b33c3;
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
    }
  }

  .next {
    margin-left: -20px;
    background: #5f4982;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .okColor {
    cursor: pointer;
    background: #7b33c3;
    div {
      color: #fff;

      &:hover {
        cursor: pointer;
        color: #6be585;
      }
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

::v-deep .contentBox {
  width: 100%;
  min-height: 500px;
  background: linear-gradient(180deg, #2d1e46 0%, #5629ad 100%);
  border-radius: 20px;
  z-index: 5;
  font-family: 'Montserrat';
  box-sizing: border-box;
  padding: 20px 30px 0;
  color: #ccc;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-weight: 700;
      color: #fff;
    }
    // 选择当前钱包
    .nowAccount {
      text-align: right;
      span {
        color: #ccc;
        font-size: 12px;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 2px 15px 3px;
      }

      &:hover {
        cursor: pointer;
        span {
          color: #fff;
          border: 1px solid #fff;
        }
      }
    }
  }

  .setAddress {
    margin: 10% 10% 0 10%;

    .txt {
      margin-left: -50px;
    }

    p {
      padding: 0 20px;
      margin-top: 30px;
      font-size: 20px;
      text-align: center;
    }

    .input {
      text-align: center;

      .el-input {
        width: 80%;
        height: 45px;
        margin-top: 10px;
        .el-input__wrapper {
          border-radius: 15px;
          padding-left: 25px;
          &.is-focus {
            box-shadow: none;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .topProd {
    padding: 0px 10px 20px;
  }
  ::v-deep .bottomCard {
    padding: 0 0 20px;
    display: flex;
    justify-content: center;
  }

  .contentBox {
    min-height: 500px;
    box-shadow: none;

    .title {
      h2 {
        font-size: 20px;
      }
      // 选择当前钱包
      .nowAccount {
        span {
          padding: 2px 8px 4px;
        }
      }
    }

    .setAddress {
      margin: 20% 0 0 0;

      .txt {
        margin-left: -10px;
      }

      p {
        padding: 0;
        margin-top: 15px;
        font-size: 12px;
      }

      .input {
        text-align: center;

        .el-input {
          width: 100%;
          height: 45px;
          margin-top: 10px;
          .el-input__wrapper {
            border-radius: 15px;
            padding-left: 25px;
            &.is-focus {
              box-shadow: none;
              border: 1px solid #7139cf;
            }
          }
        }
      }
    }
  }
}
</style>
