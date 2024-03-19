<template>
  <div id="setOwner">
    <el-dialog :model-value="showSet" @close="close">
      <!-- 弹框标题 -->
      <template #header>
        <!-- 节点设置 -->
        <div class="addTitle">
          <span>{{ $t('Settings') }}</span>
        </div>
      </template>

      <ul>
        <li
          @click="clickType(index, item)"
          v-for="(item, index) in typeArr"
          :key="index"
          :class="{ active: index == typeIndex }"
        >
          <div class="itemBox">
            <div>
              <SvgIcon :name="item.icon"></SvgIcon>
              {{ $t(item.name) }}
            </div>

            <div v-if="index == typeIndex">
              <SvgIcon name="CheckCircle" class="CheckCircle" />
            </div>
          </div>
        </li>
      </ul>

      <!-- Proceed -->
      <div class="Proceed">
        <el-button @click="clickProceed">
          {{ $t('Settings_Proceed') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { getNowHeight } from '@/utils/arraybufferToBase64.js'
import { getWorkerId } from '@/api/worker.js'
import { pondOperator, minerMinerInfo } from '@/api/checkIn.js' //节点入职接口
import { departInfo } from '@/api/exit.js' //离职接口
import { useMinerStore } from '../../store/module/miner' //节点信息
import { useSetStore } from '@/store/module/set.js' //设置仓
import { useBuffStore } from '@/store/module/buff.js' //buff仓
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router' //路由
import { ref, defineProps, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import Web3 from 'web3'
import { toFixedNum } from '@/utils/num.js'

// 父传子
const props = defineProps({
  showSet: {
    type: Boolean,
    default: false
  }
})

onMounted(async () => {
  //节点
  node.value = route.params.id

  // getControl
  query.value.params = await [route.params.id, []]

  await getMinerInfo()
  getDepartInfo() //离职信息
})

const router = useRouter() //路由
const route = useRoute()

// 使用仓库
const minerStore = useMinerStore()
const { minerObj, judgeRole, judgeMode } = storeToRefs(minerStore)

const setStore = useSetStore()
const { operatorInfo } = storeToRefs(setStore)

const buffStore = useBuffStore()
const { departObj } = storeToRefs(buffStore)

const node = ref() //节点
//类型数组
const typeArr = ref([
  {
    name: 'Settings_Exit',
    icon: 'logout'
  }
])
const typeIndex = ref(-1) //类型下标
const typeName = ref() //选中内容
// 点击类型
const clickType = (index, item) => {
  typeIndex.value = index
  typeName.value = item.icon
}

// 监听路由变化
watch(
  () => [route.params.id],
  async ([new1]) => {
    if (new1) {
      node.value = route.params.id
      await getMinerInfo()
      getDepartInfo()
    }
  }
)

// 通知父关闭弹框
const emit = defineEmits(['close', 'showSkeleton', 'getStatus'])
const close = () => {
  typeIndex.value = -1

  emit('close', false)
}

// 通知父打开骨架屏
const showSkeleton = () => {
  emit('showSkeleton', true)
}

const sendStatus = () => [emit('getStatus', status.value)]

// 获取操作人信息
const operatorData = ref()
const getOperatorData = async () => {
  const res = await pondOperator({
    actor: node.value
  })

  operatorData.value = res.data
  setStore.operatorInfo = res.data
}

// 获取节点信息
const role = ref() //角色
const minerMode = ref() //单签/多签
const getMinerInfo = async () => {
  const res = await minerMinerInfo({
    actor: node.value
  })
  if (res.code == 0) {
    minerStore.minerObj = await res.data
    minerStore.minerObj.node = node.value

    // 判断单多签
    minerStore.minerObj.mode = minerStore.judgeMode(res.data)
    minerMode.value = minerStore.minerObj.mode

    // 判断在职身份 1owner 2受益人 3不在职
    role.value = await minerStore.judgeRole(res.data)
    minerStore.minerObj.role = await role.value
  } else {
    ElMessage.error('节点错误')
    showSkeleton()
  }
}

// 获取离职信息
const departData = ref()
const status = ref() // 0不在职，1在职，2已经离职但owner未改，3已经离职但受益人未
const getDepartInfo = async () => {
  const res = await departInfo({
    actor: node.value
  })
  // console.log('getDepartInfo:', res)

  // 如果有负载
  if (res.data.debt > 0) {
    //单位转换
    var web3 = new Web3(window.ethereum)
    res.data.debt = toFixedNum(
      web3.utils.fromWei(res.data.debt.toString(), 'ether'),
      18
    ) // 把 wei 转为以太币)
  }

  buffStore.departObj = await res.data //保存仓库
  departData.value = res.data
  status.value = res.data.status

  sendStatus()

  if (res.data.status == 1) {
    typeArr.value = [
      {
        name: 'Settings_operator',
        icon: 'operator'
      },
      {
        name: 'Settings_worker',
        icon: 'worker'
      },
      {
        name: 'Settings_control',
        icon: 'control'
      },
      {
        name: 'Settings_Exit',
        icon: 'logout'
      }
    ]
    // 根据在职角色显示操作--受益人
    if (role.value == 2) {
      // 如果是受益人只有两种操作
      typeArr.value = [
        {
          name: 'Settings_operator',
          icon: 'operator'
        },
        {
          name: 'Settings_Exit',
          icon: 'logout'
        }
      ]
    }
  } else if (
    res.data.status == 0 ||
    res.data.status == 2 ||
    res.data.status == 3
  ) {
    minerMode.value = minerStore.judgeMode(res.data)
    minerStore.minerObj.mode = minerMode.value
    // 修改owner
    typeArr.value = [
      {
        name: 'Settings_Exit',
        icon: 'logout'
      }
    ]
  }
}

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
  setStore.controlInfo = await res.result
  setStore.controlInfo.node = minerStore.minerObj.node
  judgeWorker(res.result)
}

const workerMode = ref() //worker模式 有无新worker
const judgeWorker = obj => {
  const nowHeight = getNowHeight()

  // 新worker为空
  if (!obj.NewWorker || obj.NewWorker == '<empty>') {
    workerMode.value = 'empty'
  } else if (
    (obj.WorkerChangeEpoch < nowHeight && obj.NewWorker !== '<empty>') ||
    (obj.WorkerChangeEpoch > nowHeight && obj.NewWorker !== '<empty>')
  ) {
    workerMode.value = 'await'
  }
}

// 点击确认设置
const clickProceed = async () => {
  if (typeIndex.value >= 0) {
    switch (typeName.value) {
      // 设置操作员
      case 'operator':
        await getOperatorData()

        // 已有操作人,跳转到更改操作人
        if (operatorData.value.operator) {
          router.push('/buff/setOwner_update')
        }
        // else {
        //   router.push('/buff/setOwner')
        // }
        break

      // 修改worker地址
      case 'worker':
        await getControl()

        if (workerMode.value == 'empty') {
          // 设置worker
          router.push('/buff/worker_update')
        } else if (workerMode.value == 'await') {
          // 等待生效
          router.push('/buff/worker_await')
        }
        break

      // 修改control
      case 'control':
        await getControl()

        router.push('/buff/control_update')
        break

      // 退出合约
      case 'logout':
        await getDepartInfo()

        // 判断是否有负债
        if (departData.value.debt > 0) {
          router.push('/buff/exitPlatform_debt')
        } else {
          switch (status.value) {
            case 0:
              ElMessage.error('当前节点不在职')
              break
            case 1:
              // 在职,分单多签跳转
              if (minerMode.value == 'single') {
                router.push('/buff/exitPlatform_singleApply') // 单签离职申请
              } else {
                router.push('/buff/exitPlatform_multipleApply') //多签离职申请
              }
              break
            case 2:
              // 已经离职，但 owner 未改 去入职界面操作修改 owner
              if (minerMode.value == 'single') {
                // 单签
                router.push('/buff/exitPlatform_singleReceiveApply')
              } else {
                // 多签
                router.push('/buff/exitPlatform_multipleReceiveApply')
              }
              break
            case 3:
              // 已经离职，但 受益人 未改 去入职界面操作修改 受益人
              if (minerMode.value == 'single') {
                // 单签
                router.push('/buff/exitPlatform_singleReceiveApply')
              } else {
                // 多签
                router.push('/buff/exitPlatform_multipleReceiveApply')
              }

              break
          }
        }

        break
    }
  }
}
</script>

<script>
export default {
  name: 'setOwner'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss';

::v-deep .el-dialog {
  width: 350px;
  background: #171717;
  border-radius: 20px;

  .el-dialog__body {
    padding: 20px 35px;

    ul {
      li {
        padding: 10px 15px;
        border-radius: 10px;
        margin-bottom: 15px;
        background: #2b2b2b;
        border: 1px solid #2b2b2b;
        .itemBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #e6e6e6;
          .svg-icon {
            width: 22px;
            height: 22px;
            color: #fff;
            margin-right: 5px;
          }

          .svg-icon.CheckCircle {
            width: 20px;
            height: 20px;
            margin: 0;
            color: #000;
          }
        }

        &.active {
          border: 1px solid #7139cf;

          .svg-icon {
            color: #7139cf;
          }

          .svg-icon.CheckCircle {
            color: #000;
          }
        }

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .Proceed {
    text-align: right;
    margin-top: 20px;
    .el-button {
      color: #fff;
      background: linear-gradient(
        180deg,
        rgba(121, 64, 207, 0.5) 0%,
        rgba(89, 33, 203, 0.5) 100%
      );
    }
  }
}
</style>
