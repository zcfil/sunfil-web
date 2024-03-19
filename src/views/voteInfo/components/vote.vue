<template>
  <div id="vote">
    <el-dialog :model-value="showVote" @close="close" :modal="true">
      <template #header>
        <div>{{ $t('Vote_') }}</div>
      </template>

      <el-radio-group v-model="radio" size="large" :disabled="disabledBtn">
        <el-radio-button :label="2">
          <SvgIcon name="yes" />
          <span> {{ $t('Vote_YES') }} </span>
          <SvgIcon v-if="radio == 2" name="check" />
          <SvgIcon v-else name="" />
        </el-radio-button>

        <el-radio-button :label="3">
          <SvgIcon name="no" />
          <span> {{ $t('Vote_NO') }} </span>
          <SvgIcon v-if="radio == 3" name="check" />
          <SvgIcon v-else name="" />
        </el-radio-button>

        <el-radio-button :label="1">
          <SvgIcon name="abs" />
          <span> {{ $t('Vote_Abstain') }} </span>
          <SvgIcon v-if="radio == 1" name="check" />
          <SvgIcon v-else name="" />
        </el-radio-button>
      </el-radio-group>

      <!-- 可投票数 -->
      <div>
        {{ $t('Vote_rights') }}{{ sunFIL == '0.00' ? '0' : sunFIL }} FIL
      </div>

      <template #footer>
        <div>
          <el-button :disabled="disabledBtn" @click="clickConfirm"
            >Confirm →</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { contractWarnNode } from '@/api/vote.js'
import { toFixedNum } from '@/utils/num.js'
import { useVoteStore } from '@/store/module/vote.js' //投票仓
import { useAccountStore } from '@/store/module/accounts.js' //账号仓
import { ElMessage, ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { ref, defineProps, onMounted, watch } from 'vue'
import { ethers } from 'ethers' // ES6 or TypeScript
import { useRouter } from 'vue-router' //路由

const router = useRouter() //路由

const props = defineProps({
  showVote: {
    type: Boolean,
    default: false
  }
})
// 使用仓库
const accountStore = useAccountStore()
const { account, isConnected } = storeToRefs(accountStore)
const voteStore = useVoteStore()
const { voteItem, getVoteContract } = storeToRefs(voteStore)

onMounted(async () => {
  // 投票合约
  voteContractData.value = voteStore.getVoteContract()

  // 当前小狐狸连接账号
  fromAccountAddress.value = accountStore.account
  // 节点地址
  proposalAddress.value = await voteStore.voteItem.contractAddress
  // 获取可投票数
  getSunFil()
})

// 监听连接状态和在职身份和小狐狸账号
watch(
  () => accountStore.account,
  old1 => {
    fromAccountAddress.value = accountStore.account
  }
)

const disabledBtn = ref(true) //禁用点击
const voteContractData = ref() //投票合约
const fromAccountAddress = ref() //取当前小狐狸连接账号
const proposalAddress = ref() //节点地址
const radio = ref() //投票选择  1 弃权,2同意,3反对

// 获取投票sunFIL
const sunFIL = ref()
const voteId = ref()
const getSunFil = async () => {
  let overrides = {
    from: fromAccountAddress.value
  }

  const res = await voteContractData.value.getVoterWeight(
    proposalAddress.value,
    overrides
  )

  sunFIL.value = toFixedNum(ethers.utils.formatEther(res.toString()), 4)

  // 只有票数大于零才可以投票
  if (sunFIL.value > 0) {
    disabledBtn.value = false
  } else {
    disabledBtn.value = true
  }
}

//通知后台刷新数据
const getContractWarnNode = async () => {
  await contractWarnNode()
}

// 点击确定
const clickConfirm = async () => {
  if (radio.value) {
    disabledBtn.value = true //禁止重复选择投票

    let overrides = {
      from: fromAccountAddress.value //转出账户地址
    }

    try {
      //拿到交易hash
      const tx = await voteContractData.value.takeVote(
        proposalAddress.value,
        radio.value,
        overrides
      )

      voteId.value = tx.hash
      close() //  关闭弹框
      disabledBtn.value = false

      if (receipt.status === 1) {
        ElNotification.success({
          title: 'Success',
          message: `<strong>Vote successfully.</strong>`,
          duration: 5000, //显示时长
          dangerouslyUseHTMLString: true
        })

        getSunFil() // 重新获取可投票数
        getContractWarnNode() //通知后台刷新
      }
    } catch (error) {
      radio.value = '' //清空投票选项
      disabledBtn.value = false //开启按钮
      console.log('voteError', error)

      if (error.code == -32603) {
        ElNotification.error({
          title: 'Error',
          message: `<strong>There may be outstanding transaction activity.</strong>`,
          duration: 5000, //显示时长
          dangerouslyUseHTMLString: true
        })
      }
    }
  } else {
    ElMessage.error('Please select the voting content')
  }
}

// 通知父关闭弹框
const emit = defineEmits(['close'])
const close = () => {
  // 清空投票选项
  radio.value = ''
  emit('close')
}
</script>

<script>
export default {
  name: 'vote'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss';
// 遮罩层颜色
::v-deep .el-overlay {
  background: #424242cc;
}

::v-deep .el-dialog {
  width: 350px;
  background: #171717;
  border-radius: 20px;

  // .el-button {
  //   background: #7940cf;
  //   color: #fff;
  // }

  .el-button {
    color: #fff;
    background: linear-gradient(
      180deg,
      rgba(121, 64, 207, 0.5) 0%,
      rgba(89, 33, 203, 0.5) 100%
    );
    &.is-disabled {
      border: 1px solid #6c34ce;
    }
  }

  .el-dialog__header {
    font-size: 25px;
  }

  .el-radio-group {
    display: flex;
    flex-direction: column;

    .el-radio-button {
      width: 100%;
      margin-bottom: 15px;

      .el-radio-button__inner {
        display: flex;
        justify-content: space-between;
        align-items: center;

        width: 100%;
        background: #2b2b2b;
        border-radius: 10px;
        color: #cbcbcb;
        border: none;
        box-shadow: none;
        border: 1px solid transparent;
        .svg-icon {
          width: 25px;
          height: 25px;
        }
      }

      &.is-active {
        .el-radio-button__inner {
          border: 1px solid #7139cf;
          color: #7139cf;
        }
      }
    }
  }

  div {
    color: #fff;
  }
}
</style>
