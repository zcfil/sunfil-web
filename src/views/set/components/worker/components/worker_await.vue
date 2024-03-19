<template>
  <div id="WorkerAwait" class="container">
    <!-- 修改worker -->
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
        class="start show d-none d-sm-none d-md-none d-lg-block col-2 col-sm-2 col-md-2 col-lg-2"
        style="display: inline-block"
      >
        <div>Back</div>
      </div>

      <!-- 内容 -->
      <div class="cardInfo">
        <div class="contentBox">
          <div class="title">
            <h2>{{ $t('operator_Node') }} {{ form.node }}</h2>
          </div>

          <div class="waitBox" style="text-align: center">
            <!-- 等待新的worker生效 -->
            <h2 style="font-weight: 400; margin-top: 20px">
              {{ $t('worker_Waiting') }}
            </h2>
          </div>

          <!-- 设置worker -->
          <div class="old">
            <!-- 当前worker -->
            <div class="txt">{{ $t('worker_Current') }}</div>
            <el-input
              :disabled="true"
              v-model.trim="form.Worker"
              id="copyCode"
              :placeholder="$t('worker_Current')"
            >
              <template #suffix>
                <el-icon @click="clickCopy('old')"><CopyDocument /></el-icon>
              </template>
            </el-input>
          </div>

          <!-- 待生效的新worker -->
          <div class="new">
            <div class="txt">{{ $t('worker_validated') }}</div>

            <el-input
              :disabled="true"
              v-model.trim="form.NewWorker"
              id="copyCode2"
              :placeholder="$t('worker_validated')"
            >
              <template #suffix>
                <el-icon @click="clickCopy('new')"><CopyDocument /></el-icon>
              </template>
            </el-input>
          </div>

          <!-- 生效时间 -->
          <div class="timeBox">
            <div class="txt">{{ $t('worker_effect') }}：</div>
            <div class="time">{{ form.time }}</div>
          </div>

          <div class="heightBox" style="text-align: center; margin-top: 30px">
            <!-- 当前高度 -->
            {{ $t('worker_height') }} {{ form.nowHeight }}，{{
              $t('worker_height2')
            }}
            <!-- 生效高度 -->
            {{ form.WorkerChangeEpoch }}
          </div>
        </div>

        <div class="prevNextBtn d-block d-sm-block d-md-block d-lg-none">
          <el-button @click="backClick" class="prevPage">Back</el-button>
          <el-button @click="nextClick" class="nextPage">Confirm</el-button>
        </div>
      </div>

      <!-- 下一步 -->
      <div
        @click="nextClick"
        style="display: inline-block"
        class="next d-none d-sm-none d-md-none d-lg-block col-2 col-sm-2 col-md-2 col-lg-2"
        :class="{ show: disabled }"
      >
        <div
          v-loading="loading"
          :element-loading-spinner="svg"
          element-loading-svg-view-box="-10, -10, 50, 50"
          element-loading-text="Loading..."
          element-loading-background="#5f4982"
        >
          {{ loading ? '' : 'Confirm' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getWorkerId } from '@/api/worker.js'
import { getNowHeight, getExpiryTime } from '@/utils/arraybufferToBase64.js'
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
  if (minerStore.minerObj) {
    // getControl
    query.value.params = await [minerStore.minerObj.node, []]
    await getControl()
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
const disabled = ref(false) //允许加载下一页

const form = ref({
  node: '', //节点
  time: '', //生效时间
  Worker: '', //旧worker
  NewWorker: '', //待生效worker
  nowHeight: '', //当前高度
  WorkerChangeEpoch: '' //生效高度
})

// getControl
const query = ref({
  jsonrpc: '2.0',
  method: 'Filecoin.StateMinerInfo',
  params: [
    '', //节点号
    []
  ],

  id: Math.floor(Math.random() * 100)
})

// 获取control信息
const getControl = async () => {
  const res = await getWorkerId(query.value)
  form.value = await res.result
  form.value.node = minerStore.minerObj.node
  form.value.nowHeight = getNowHeight() //当前高度
  form.value.time = getExpiryTime(res.result.WorkerChangeEpoch) //转化时间

  if (form.value.nowHeight > form.value.WorkerChangeEpoch) {
    disabled.value = true //禁止点击下一步
  }

  setStore.controlInfo = await res.result
}

// 上一步
const backClick = () => {
  router.push({
    path: `/buff/minerInfo/${minerStore.minerObj.node}`
  })
}

// 下一步
const nextClick = async () => {
  if (disabled.value) {
    loading.value = true
    switch (minerStore.minerObj.mode) {
      // 单签
      case 'single':
        setTimeout(() => {
          router.push({
            path: '/buff/worker_singleConfirm'
          })
          loading.value = false //停止加载
        }, 500)
        break

      // 多签
      case 'more':
        setTimeout(() => {
          router.push({
            path: '/buff/worker_multipleConfirm'
          })
          loading.value = false //停止加载
        }, 500)
        break
    }
  }
}

// 点击复制
const clickCopy = async val => {
  switch (val) {
    case 'old':
      await toClipboard(form.value.Worker)
      ElMessage.success('Copy success')
      break

    case 'new':
      await toClipboard(form.value.NewWorker)
      ElMessage.success('Copy success')
      break
  }
}
</script>

<script>
export default {
  name: 'WorkerAwait'
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
    min-height: 500px;
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

  .show {
    background: #7b33c3;
    &:hover {
      cursor: pointer;
      color: #6be585;
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
  padding: 20px 30px 20px;
  color: #ccc;

  h2 {
    font-weight: 700;
    color: #fff;
  }

  .old,
  .new,
  .timeBox {
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

  .old,
  .new {
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

  .timeBox {
    margin-top: 30px;
    display: flex;
    align-items: center;
    .txt {
      margin-left: -50px;
    }
    .time {
      flex: 1;
      text-align: center;
      font-weight: 700;
      color: #fff;
    }
  }
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  .waitBox {
    h2 {
      font-size: 20px;
    }
  }

  // 内容
  .contentBox {
    box-shadow: none;

    .old,
    .new {
      // margin: 10% 0 0 0;

      .txt {
        width: 100%;
        margin-left: -30px;
        .time {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .waitBox {
    h2 {
      font-size: 14px;
    }
  }
  .topProd {
    padding: 20px 10px;
  }
  ::v-deep .bottomCard {
    padding: 0 0 20px;
    display: flex;
    justify-content: center;
  }

  // 内容
  ::v-deep .contentBox {
    box-shadow: none;

    .el-input__inner {
      font-size: 12px;
    }

    .old,
    .new {
      margin: 10% 0 0 0;

      .txt {
        width: 100%;
        margin-left: -10px;
        font-size: 12px;
        .time {
          width: 100%;
          text-align: center;
        }
      }
    }

    .timeBox {
      font-size: 12px;
    }

    .heightBox {
      font-size: 12px;
    }
  }
}
</style>
