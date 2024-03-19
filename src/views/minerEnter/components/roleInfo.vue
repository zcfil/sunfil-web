<template>
  <div id="MinerRoleInfo" class="container">
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
            <h2>
              {{ $t('Check_node') }}
              {{ form.node }}
            </h2>
          </div>

          <!-- 选择代理角色 -->
          <div class="role">
            <p>{{ $t('Check_role') }}</p>

            <div class="Owner col-3 col-sm-3 col-md-3 col-lg-2">
              <ul>
                <li
                  @click="roleBtnClick(index)"
                  v-for="(item, index) in roleArr"
                  :key="index"
                >
                  <el-button :class="{ active: index == activeRoleIndex }">
                    {{ $t(item.label) }}</el-button
                  >
                </li>
              </ul>
            </div>

            <!-- 源地址 -->
            <div class="desc">
              <div class="OriginalAddress">
                {{ $t('Check_Original') }}： {{ form.originalAddress }}
              </div>
              <div>{{ $t('Check_txt1') }}</div>
            </div>
          </div>

          <div class="info">
            <!-- 最大可借额度 -->
            <div class="rowItem">
              <div class="leftBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>{{ $t('Check_Limit') }}</div>
                <div v-if="activeRoleIndex == 0">{{ form.debt }} FIL</div>
                <div v-else>{{ form.debt }} FIL</div>
              </div>

              <!-- 最大负债率 -->
              <div class="rightBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>{{ $t('Check_ratio') }}</div>
                <div v-if="activeRoleIndex == 0">50% （杠杆2.0x）</div>
                <div v-else>35% （杠杆1.25x）</div>
              </div>
            </div>

            <!-- 清算阈值 -->
            <div class="rowItem">
              <div class="leftBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>{{ $t('Check_Clearing') }}</div>
                <div v-if="activeRoleIndex == 0">65%</div>
                <div v-else>41%</div>
              </div>

              <!-- 可提现阈值 -->
              <div class="rightBox col-6 col-sm-6 col-md-6 col-lg-6">
                <div>{{ $t('Check_Withdrawal') }}</div>
                <div>
                  {{ form.withdraw }}
                  FIL
                </div>
              </div>
            </div>
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
import { useRouter } from 'vue-router' //路由
import { ref, onMounted } from 'vue'
import { useMinerStore } from '@/store/module/miner.js'
import { useAccountStore } from '@/store/module/accounts.js'
import { storeToRefs } from 'pinia'
import { toFixedNum } from '@/utils/num.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
// 使用仓库
const accountStore = useAccountStore()
const { account, isConnected } = storeToRefs(accountStore)
const minerStore = useMinerStore()
const {
  minerObj,
  multiSignatureInfo,
  minerEnterContractId,
  judgeMode,
  checkInBool,
  nodeDebt,
  judgeAddress
} = storeToRefs(minerStore)

// 初始化
onMounted(async () => {
  if (minerStore.minerObj && !minerStore.nodeDebt) {
    minerStore.minerObj.role = await 1 //进来就是owner

    form.value = {
      node: minerStore.minerObj.node, //节点号
      originalAddress: minerStore.minerObj.owner, //源地址
      debt: toFixedNum(minerStore.minerObj.balance / 2, 5), //可借额度,
      withdraw: toFixedNum(minerStore.minerObj.available, 5) //提现阈值
    }
  } else {
    router.push({
      path: '/buff/buff_home'
    })
  }
})

const form = ref({
  node: '', //节点号
  originalAddress: '', //源地址
  debt: '', //可借额度,
  withdraw: '' //提现阈值
})

// 加载下一步 svg
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
// 角色选项数组
const roleArr = ref([
  {
    value: 1,
    label: 'Check_Owner'
  },
  {
    value: 2,
    label: 'Check_Beneficiary'
  }
])
const activeRoleIndex = ref(0) //角色下标
const loading = ref(false) //加载下一页

//选择角色
const roleBtnClick = index => {
  activeRoleIndex.value = index
  minerStore.minerObj.role = index + 1 // 1 owner   2 受益人

  if (index == 0) {
    // owner 最大可借
    form.value.debt = toFixedNum(minerStore.minerObj.balance2 * 0.5, 5)
    form.value.originalAddress = minerStore.minerObj.owner
  } else {
    // beneficiary 最大可借
    form.value.debt = toFixedNum(minerStore.minerObj.balance2 * 0.35, 5)
    form.value.originalAddress = minerStore.minerObj.beneficiary
  }
}

// 上一步
const backClick = async () => {
  minerStore.checkInBool = false
  router.push({
    path: '/buff/minerSearch'
  })
}

// 下一步
const nextClick = async () => {
  //没有加载时候才可以点击
  if (!loading.value) {
    const bool = await minerStore.judgeAddress(minerStore.minerObj)

    if (bool) {
      loading.value = true

      const mode = minerStore.judgeMode(minerStore.minerObj)

      // 根据 owner地址判断钱包类型,当owner钱包地址和id一样为多签,其余为单签
      if (mode == 'more') {
        minerStore.minerObj.mode = await 'more' //多签

        setTimeout(() => {
          router.push({
            path: '/buff/multipleApply'
          })
          loading.value = false
        }, 500)
      } else {
        // 单签
        minerStore.minerObj.mode = await 'single' //单签

        // 没有提案--第一次
        setTimeout(() => {
          router.push({
            path: '/buff/singleApply'
          })
          loading.value = false
        }, 500)
      }
    } else {
      ElMessage.error('当前节点owner与beneficiary地址不一致')
    }
  }
}
</script>

<script>
export default {
  name: 'MinerRoleInfo'
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
    background: #7b33c3;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }

  .next {
    cursor: pointer;
    background: #7b33c3;
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

// 签名弹框
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
      &:hover {
        color: #5629ad;
      }
    }
  }
}

.contentBox {
  width: 100%;
  min-height: 500px;
  background: linear-gradient(180deg, #2d1e46 0%, #5629ad 100%);
  border-radius: 20px;
  z-index: 5;
  font-family: Montserrat;

  .title {
    h2 {
      padding: 20px 30px;
      font-weight: 700;
    }
  }
}

::v-deep .role {
  padding: 20px 30px;
  color: #ccc;
  div {
    text-align: center;
  }
  .Owner {
    width: 100%;
    margin: 15px 0;

    ul {
      width: 100%;
      display: flex;
      justify-content: space-around;
      li {
        width: 100%;
      }
      .el-button {
        width: 70%;
        padding: 20px 0;
        color: #fff;
        background: transparent;
        border: 1px solid #ccc;
        border-radius: 15px;
      }

      .active {
        border: 1px solid #fcaa13;
        color: #fcaa13;
      }
    }
  }

  .desc {
    color: #ccc;
    font-size: 12px;
    div {
      font-family: Bakbak One;
      line-height: 25px;
    }

    .OriginalAddress {
      word-break: break-all;
    }
  }
}

.info {
  position: relative;
  padding: 50px 100px 0;

  .rowItem {
    display: flex;
    flex-wrap: wrap;

    .leftBox,
    .rightBox {
      text-align: center;
      margin-bottom: 50px;
      font-family: Montserrat;

      div:nth-child(1) {
        margin-bottom: 10px;
        color: #ccc;
      }
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
  .contentBox {
    box-shadow: none;
  }
  .info {
    padding: 10px 40px;
    font-size: 13px;

    .rowItem {
      .leftBox,
      .rightBox {
        text-align: center;

        div:nth-child(2) {
          margin-left: 0px;
        }
      }
    }
  }
}
</style>
