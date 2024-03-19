<template>
  <div id="SetOwnerUpdate" class="container">
    <!-- 设置操作员 -->
    <div class="topProd">
      <h4>{{ $t('operator') }}</h4>

      <!--  智能合约通过分离存储提供商的所有权和运营来确保安全的节点授权，只允许授权的操作人执行借贷、还款和取款权操作。 -->
      <p>
        {{ $t('operator_txt') }}
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
      <div class="cardInfo">
        <div class="contentBox">
          <div class="title">
            <h2>{{ $t('operator_Node') }} {{ node }}</h2>
          </div>

          <!-- 设置操作人 -->
          <div class="old">
            <!-- 当前操作人 -->
            <div class="txt">{{ $t('operator_Current') }}</div>
            <el-input
              :disabled="true"
              v-model="oldAddress"
              id="copyCode"
              :placeholder="$t('operator_Address')"
            >
              <template #suffix>
                <el-icon @click="clickCopy"><CopyDocument /></el-icon>
              </template>
            </el-input>
          </div>

          <!-- 新的操作人 -->
          <div class="new">
            <div class="txt">{{ $t('operator_New') }}</div>
            <el-input
              v-model.trim="newAddress"
              :placeholder="$t('operator_Newaddress')"
            ></el-input>
            <!-- 如需变更操作员请输入新的操作员地址 -->
            <p>{{ $t('operator_If') }}</p>
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
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router' //路由
import { useSetStore } from '@/store/module/set.js' //设置仓
import { useMinerStore } from '@/store/module/miner.js' //节点仓
import { useAccountStore } from '@/store/module/accounts.js' //账号
import { useBuffStore } from '@/store/module/buff.js' //buff
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'
import useClipboard from 'vue-clipboard3' //复制插件
const { toClipboard } = useClipboard() //使用复制插件

const router = useRouter()
// 使用仓库
const accountStore = useAccountStore()
const { isConnected } = storeToRefs(accountStore)
const setStore = useSetStore()
const { operatorInfo } = storeToRefs(setStore)
const minerStore = useMinerStore()
const { minerObj, minerEnterContractId } = storeToRefs(minerStore)
const buffStore = useBuffStore()
const { actorInfo } = storeToRefs(buffStore)
onMounted(() => {
  if (minerStore.minerObj && accountStore.isConnected) {
    //旧操作人
    oldAddress.value = setStore.operatorInfo.operator
    node.value = setStore.operatorInfo.actor

    mode.value = minerStore.minerObj.mode
  } else {
    router.push({
      path: `/buff/buff_home`
    })
  }
})

//加载图标
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
const loading = ref(false) //加载下一页
const node = ref()
const mode = ref() //单签多签
//复制当前操作员地址
const oldAddress = ref()
const newAddress = ref()

// 上一步
const backClick = async () => {
  // 节点详情
  router.push({
    path: `/buff/minerInfo/${minerStore.minerObj.node}`
  })
}

// 下一步
const nextClick = async () => {
  // 新操作人地址不为空时
  if (newAddress.value) {
    if (newAddress.value !== oldAddress.value) {
      loading.value = true
      setStore.operatorInfo.newOperator = await newAddress.value

      switch (mode.value) {
        // 单签
        case 'single':
          setTimeout(() => {
            loading.value = false //停止加载

            router.push({
              path: '/buff/setOwner_singleInfo'
            })
          }, 500)
          break

        // 多签
        case 'more':
          setTimeout(() => {
            loading.value = false //停止加载

            router.push({
              path: '/buff/setOwner_multipleInfo'
            })
          }, 500)
          break
      }
    } else {
      ElMessage.error('The new address cannot be the same as the old address')
    }
  } else {
    ElMessage.error('The new address cannot be empty')
  }
}

// 点击复制
const clickCopy = async () => {
  if (accountStore.isConnected) {
    await toClipboard(oldAddress.value)
    ElMessage.success('复制成功')
  }
}
</script>

<script>
export default {
  name: 'SetOwnerUpdate'
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
  }

  .start,
  .next {
    display: flex;
    align-items: center;
    min-height: 400px;
    width: 150px;
    background: #7b33c3;
    border-radius: 12px;
    font-size: 25px;
    scale: 0.8;

    &:hover {
      cursor: pointer;
      color: #6be585;
    }

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
    div {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
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

// 内容
::v-deep .contentBox {
  width: 100%;
  min-height: 500px;
  background: linear-gradient(180deg, #2d1e46 0%, #5629ad 100%);
  border-radius: 20px;
  z-index: 5;
  // box-shadow: -2px -2px 5px #2d1e46, 2px 2px 5px #5c2cb9;
  font-family: 'Montserrat';
  box-sizing: border-box;
  padding: 20px 30px 0;
  color: #ccc;

  h2 {
    font-weight: 700;
    color: #fff;
  }

  .old,
  .new {
    margin: 5% 15% 0 15%;

    .txt {
      margin-left: -50px;
    }

    .el-input {
      height: 45px;
      margin-top: 10px;
      .el-input__wrapper {
        border-radius: 15px;
        padding-left: 25px;
        box-shadow: none;
        border: 1px solid #ccc;
      }
    }

    p {
      font-size: 12px;
      padding: 10px 25px 0;
    }
  }

  .old {
    .el-input {
      height: 45px;
      margin-top: 10px;
      .el-input__wrapper {
        border-radius: 15px;
        padding-left: 25px;
        background: #272932;

        &.is-focus {
          border: 1px solid #fff;
          // box-shadow: -1px 0 0 0;
          .el-input__inner {
            color: #fff;
          }
        }

        // 复制图标

        .el-input__suffix {
          font-size: 20px;
          color: #7139cf;
          cursor: pointer;
        }
      }
    }
  }

  .new {
    .el-input {
      .el-input__wrapper {
        &.is-focus {
          box-shadow: none;
          border: 1px solid #7139cf;
        }
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

  // 内容
  .contentBox {
    box-shadow: none;

    .old,
    .new {
      margin: 10% 0 0 0;

      .txt {
        margin-left: -10px;
      }
    }
  }
}
</style>
