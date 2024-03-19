<template>
  <div id="ControlUpdate" class="container">
    <!-- 修改Control -->
    <div class="topProd">
      <h4>{{ $t('Control') }}</h4>

      <!--  入如果有需要，您可以通过智能合约修改节点的Control地址。 -->
      <p>{{ $t('Control_smart') }}</p>
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

          <!-- 设置control -->
          <div v-if="controlArr.length > 0" class="old">
            <!-- 当前control -->
            <div class="txt">
              {{ $t('Control_Current') }}
            </div>
            <el-input
              v-for="(item, index) in controlArr"
              :key="index"
              :disabled="true"
              v-model.trim="controlArr[index]"
              :placeholder="$t('Control_Current')"
            >
              <template #suffix>
                <el-icon @click="clickCopy(item)"><CopyDocument /></el-icon>
              </template>
            </el-input>
          </div>

          <!-- 新的Control -->
          <div class="new">
            <div class="txt">{{ $t('Control_New') }}</div>
            <div
              class="inputBox"
              v-for="(item, index) in newAddressArr"
              :key="index"
            >
              <el-input
                v-model.trim="item.address"
                :placeholder="$t('Control_address')"
              ></el-input>

              <el-icon
                v-if="index < newAddressArr.length - 1"
                @click="clickDel(index)"
                class="CloseBold"
                ><CloseBold
              /></el-icon>
              <el-icon v-else @click="clickAdd(index)" class="Plus"
                ><Plus
              /></el-icon>
            </div>

            <!-- 如需变更Control请输入新的Control地址 -->
            <p>{{ $t('Control_address2') }}</p>
          </div>
        </div>

        <div class="prevNextBtn d-block d-sm-block d-md-block d-lg-none">
          <el-button @click="backClick" class="prevPage">上一页</el-button>
          <el-button @click="nextClick" class="nextPage">下一页</el-button>
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
import { minerMinerInfo } from '@/api/checkIn.js' //节点入职接口
import { useMinerStore } from '@/store/module/miner' //节点
import { useBuffStore } from '@/store/module/buff.js' //buff
import { useSetStore } from '@/store/module/set.js' //设置
import { CopyDocument, Plus, CloseBold } from '@element-plus/icons-vue'
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
  if (buffStore.actorInfo && setStore.controlInfo) {
    node.value = buffStore.actorInfo.nodeId
    controlArr.value = setStore.controlInfo.ControlAddresses
      ? setStore.controlInfo.ControlAddresses
      : [] //当前control数组
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
const node = ref()
const oldAddress = ref()
const newAddress = ref()
const controlArr = ref([])
const newAddressArr = ref([
  {
    address: ''
  }
])

// 点击删除
const clickDel = index => {
  if (newAddressArr.value.length > 0) {
    // splice 第一个参数是要删除的元素的下标，第二个参数是要删除的个数
    newAddressArr.value.splice(index, 1)
  }
}

const checkNull = arr => {
  // 判断是否有空项
  const bool = arr.some(v => {
    if (!v.address) {
      return true
    } else {
      return false
    }
  })

  return bool
}

// 点击添加
const clickAdd = async index => {
  const bool = await checkNull(newAddressArr.value)

  if (!bool) {
    newAddressArr.value.push({
      address: ''
    })
  } else {
    ElMessage.error('The address cannot be empty.')
  }
}

// 上一步
const backClick = async () => {
  router.push(`/buff/minerInfo/${minerStore.minerObj.node}`)
}

// 下一步
const nextClick = async () => {
  loading.value = true
  const bool = await checkNull(newAddressArr.value)
  if (bool) {
    loading.value = false
    ElMessage.error('The address cannot be empty.')
  } else {
    // 新的control数组剔除前两位
    setStore.controlInfo.controlArr = newAddressArr.value.map(v =>
      v.address.substr(2)
    )
    loading.value = false

    switch (minerStore.minerObj.mode) {
      case 'single':
        setTimeout(async () => {
          router.push('/buff/control_single')
        }, 500)
        break
      case 'more':
        setTimeout(async () => {
          router.push('/buff/control_multiple')
        }, 500)
        break
    }
  }
}

// 点击复制
const clickCopy = val => {
  try {
    toClipboard(val)
    ElMessage.success('复制成功')
  } catch (e) {
    console.error('copyError', e)
  }
}
</script>

<script>
export default {
  name: 'ControlUpdate'
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
  padding: 20px 30px;
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
    .inputBox {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    i {
      margin-left: 5px;
    }
    .CloseBold {
      color: #fb7979;
      &:hover {
        cursor: pointer;
      }
    }

    .Plus {
      color: #fff;

      &:hover {
        cursor: pointer;
      }
    }

    .el-input {
      height: 45px;

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
      text-align: center;
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
