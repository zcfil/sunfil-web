<template>
  <div id="WorkerUpdate" class="container">
    <!-- worker设置成功 -->
    <div class="topProd">
      <h4>{{ $t('worker') }}</h4>

      <!--  如果有需要，您可以通过智能合约修改节点的worker地址。 -->
      <p>{{ $t('worker_smart') }}</p>
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

          <!-- 设置worker -->
          <div v-if="oldAddress" class="old">
            <!-- 当前worker -->
            <div class="txt">{{ $t('worker_Current') }}</div>
            <el-input
              :disabled="true"
              v-model.trim="oldAddress"
              :placeholder="$t('worker_Current')"
            >
              <template #suffix>
                <el-icon @click="clickCopy"><CopyDocument /></el-icon>
              </template>
            </el-input>
          </div>

          <!-- 新的worker -->
          <div class="new">
            <div class="txt">{{ $t('worker_New') }}</div>
            <el-input
              v-model.trim="newAddress"
              :placeholder="$t('worker_Address')"
            ></el-input>
            <!-- 如需变更worker请输入新的worker地址 -->
            <p>{{ $t('worker_enter') }}</p>
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
import { useMinerStore } from '@/store/module/miner' //节点
import { useBuffStore } from '@/store/module/buff.js' //buff
import { useSetStore } from '@/store/module/set.js' //设置
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router' //路由
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useClipboard from 'vue-clipboard3' //复制插件

const { toClipboard } = useClipboard() //使用复制插件
const router = useRouter() //使用路由

// 使用仓库
const minerStore = useMinerStore()
const { minerObj } = storeToRefs(minerStore)

const buffStore = useBuffStore()
const { actorInfo } = storeToRefs(buffStore)

const setStore = useSetStore()
const { controlInfo } = storeToRefs(setStore)

onMounted(async () => {
  if (buffStore.actorInfo) {
    node.value = buffStore.actorInfo.nodeId
    oldAddress.value = setStore.controlInfo.Worker
  } else {
    router.push('/buff/buff_home')
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
const node = ref() //节点
const oldAddress = ref()
const newAddress = ref()

// 上一步
const backClick = async () => {
  router.push({
    path: `/buff/minerInfo/${minerStore.minerObj.node}`
  })
}

// 下一步
const nextClick = async () => {
  // 新地址不为空时
  if (newAddress.value) {
    if (newAddress.value !== oldAddress.value) {
      loading.value = true
      if (minerStore.minerObj) {
        // 新的worker

        minerStore.minerObj.newWorkerId = await newAddress.value

        switch (minerStore.minerObj.mode) {
          // 单签
          case 'single':
            setTimeout(() => {
              router.push({
                path: '/buff/worker_single'
              })
              loading.value = false //停止加载
            }, 500)
            break

          // 多签
          case 'more':
            setTimeout(() => {
              router.push({
                path: '/buff/worker_multiple'
              })
              loading.value = false //停止加载
            }, 500)
            break
        }
      }
    } else {
      ElMessage.error('新的地址与当前地址相同')
    }
  } else {
    ElMessage.error('新的地址不能为空')
  }
}

// 点击复制
const clickCopy = () => {
  try {
    toClipboard(oldAddress.value)
    ElMessage.success('复制成功')
  } catch (e) {
    console.error('copyError', e)
  }
}
</script>

<script>
export default {
  name: 'WorkerUpdate'
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
  box-shadow: -2px -2px 5px #2d1e46, 2px 2px 5px #5c2cb9;
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
