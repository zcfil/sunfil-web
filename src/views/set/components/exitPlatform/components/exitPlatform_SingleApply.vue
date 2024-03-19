<template>
  <!-- 在职 -->
  <div id="exitPlatformSingleApply" class="container">
    <div class="topProd">
      <h4>{{ $t('Exit') }}</h4>

      <!-- 退出内容 -->
      <p>
        {{ $t('Exit_txt') }}
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
            <h2>{{ $t('operator_Node') }} {{ form.node }}</h2>
          </div>

          <!-- 申请 -->
          <div class="apply">
            <p v-if="role == 1" style="margin-top: 10px">
              {{ $t('Check_Submit') }}
            </p>
            <p v-if="role == 2" style="margin-top: 10px">
              {{ $t('Check_Submit2') }}
            </p>

            <div class="OriginalInfo">
              <!-- 地址 -->
              <div class="row">
                <div class="leftBox col-4 col-sm-4 col-md-4 col-lg-5">
                  Address
                </div>
                <div
                  v-if="!skeletonShow"
                  class="rightBox col-8 col-sm-8 col-md-8 col-lg-7"
                >
                  <div class="tooltipTxt">
                    {{ form.owner }}
                  </div>
                </div>

                <div v-else class="rightBox col-8 col-sm-8 col-md-8 col-lg-7">
                  <el-skeleton :rows="0" animated />
                </div>
              </div>

              <!-- 节点 -->
              <div class="row">
                <div class="leftBox col-4 col-sm-4 col-md-4 col-lg-5">
                  Actor
                </div>

                <div
                  v-if="!skeletonShow"
                  class="rightBox col-8 col-sm-8 col-md-8 col-lg-7"
                >
                  {{ form.node }}
                </div>
                <div v-else class="rightBox col-8 col-sm-8 col-md-8 col-lg-7">
                  <el-skeleton :rows="0" animated />
                </div>
              </div>

              <!-- id owner钱包id -->
              <div class="row">
                <div class="leftBox col-4 col-sm-4 col-md-4 col-lg-5">ID</div>

                <div
                  v-if="role == 1 && !skeletonShow"
                  class="rightBox col-8 col-sm-8 col-md-8 col-lg-7"
                >
                  {{ form.ownerId }}
                </div>
                <div
                  v-if="role == 2 && !skeletonShow"
                  class="rightBox col-8 col-sm-8 col-md-8 col-lg-7"
                >
                  {{ form.beneficiaryId }}
                </div>

                <div
                  v-if="skeletonShow"
                  class="rightBox col-8 col-sm-8 col-md-8 col-lg-7"
                >
                  <el-skeleton :rows="0" animated />
                </div>
              </div>
            </div>
          </div>

          <!-- 消息内容 -->
          <div class="infoContent">
            <p class="Original">{{ $t('operator_content') }}</p>

            <ul class="topBtn">
              <li
                class="col-5 col-sm-5 col-md-5 col-lg-4"
                :class="{ active: infoIndex == index }"
                @click="infoBtnClick(item, index)"
                v-for="(item, index) in btnArr"
                :key="index"
              >
                {{ $t(item.label) }}
              </li>
            </ul>

            <!-- 主要内容 -->
            <div
              v-if="infoIndex === 0"
              class="detailInfo col-12 col-sm-12 col-md-12 col-lg-12"
            >
              <div class="row">
                <div class="detailLeft col-4 col-sm-4 col-md-4 col-lg-4">
                  Form
                </div>

                <div
                  v-if="!skeletonShow"
                  class="detailRight col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  {{ mainForm.form }}
                </div>
                <div
                  v-else
                  class="detailRight col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  <el-skeleton :rows="0" animated />
                </div>
              </div>

              <div class="row">
                <div class="detailLeft col-4 col-sm-4 col-md-4 col-lg-4">
                  To
                </div>

                <div
                  v-if="!skeletonShow"
                  class="detailRight col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  {{ mainForm.to }}
                </div>
                <div
                  v-else
                  class="detailRight col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  <el-skeleton :rows="0" animated />
                </div>
              </div>

              <div class="row">
                <div class="detailLeft col-4 col-sm-4 col-md-4 col-lg-4">
                  Method
                </div>

                <div
                  v-if="!skeletonShow"
                  class="detailRight col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  {{ mainForm.method }}
                </div>
                <div
                  v-else
                  class="detailRight col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  <el-skeleton :rows="0" animated />
                </div>
              </div>

              <div class="row">
                <div class="detailLeft col-4 col-sm-4 col-md-4 col-lg-4">
                  GasFee
                </div>

                <div
                  v-if="!skeletonShow"
                  class="detailRight col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  {{ mainForm.gasFee }}
                </div>
                <div
                  v-else
                  class="detailRight col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  <el-skeleton :rows="0" animated />
                </div>
              </div>
            </div>

            <!--  json格式详细内容 -->
            <div
              v-if="infoIndex == 1"
              class="mainInfo col-10 col-sm-10 col-md-10 col-lg-10"
              style="word-wrap: break-word; white-space: pre-wrap"
            >
              <pre id="copyCode1">{{ detailForm }}</pre>

              <div class="copyIcon">
                <el-icon @click="handleCopy('detail')"
                  ><DocumentCopy
                /></el-icon>
              </div>
            </div>
          </div>

          <!-- 签名 -->
          <div class="lotus">
            <p class="Original">{{ $t('operator_Message') }}</p>

            <div
              v-if="!skeletonShow"
              id="copyCode2"
              class="sign col-9 col-sm-9 col-md-9 col-lg-9"
            >
              <div>lotus wallet sign</div>
              <div>{{ mainForm.form }}</div>
              <div>
                {{ cidParams }}
              </div>

              <div class="copyIcon">
                <el-icon @click="handleCopy('signature')"
                  ><DocumentCopy
                /></el-icon>
              </div>
            </div>

            <!-- 骨架屏 -->
            <div v-else class="sign col-9 col-sm-9 col-md-9 col-lg-9">
              <div><el-skeleton :rows="0" animated /></div>
              <div><el-skeleton :rows="0" animated /></div>
              <div>
                <el-skeleton :rows="0" animated />
              </div>

              <div class="copyIcon">
                <el-icon @click="handleCopy('signature')"
                  ><DocumentCopy
                /></el-icon>
              </div>
            </div>
          </div>

          <!-- 结果 -->
          <div class="result">
            <p class="Original">{{ $t('operator_Results') }}</p>

            <div class="mainResult col-10 col-sm-10 col-md-10 col-lg-10">
              <el-input
                v-model="textarea"
                :rows="2"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 20 }"
              />
            </div>
          </div>

          <!-- 消息ID跳转 -->
          <div @click="clickPushId" v-if="pushId" class="txtBox">
            <span style="margin-right: 5px">消息ID</span>
            <span>{{ pushId.slice(0, 10) }}...{{ pushId.slice(-10) }}</span>
            <SvgIcon
              name="rocket"
              style="
                width: 16px;
                height: 16px;
                margin-top: -2px;
                margin-left: 5px;
              "
            />
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
import {
  filecoinMpoolGetNonce,
  filecoinGasEstimateMessageGas,
  filecoinMpoolPush,
  filecoinStateWaitMsg
} from '@/api/checkIn.js'
import {
  HexToBase64,
  cidToBytesToHex,
  beneficiaryParams2,
  departAbi
} from '@/utils/arraybufferToBase64.js'
import { useAccountStore } from '@/store/module/accounts.js'
import { useBuffStore } from '@/store/module/buff.js' //buff
import { useMinerStore } from '@/store/module/miner.js'
import { storeToRefs } from 'pinia'
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router' //路由
import { ref, onMounted, watch } from 'vue'
import useClipboard from 'vue-clipboard3' //复制插件

const { toClipboard } = useClipboard() //使用复制插件
const router = useRouter() //路由

// 使用仓库
const accountStore = useAccountStore()
const { account, isConnected } = storeToRefs(accountStore) //解构
const minerStore = useMinerStore()
const { minerObj, contractObj, minerEnterContractId, method, linkHref } =
  storeToRefs(minerStore)

const buffStore = useBuffStore()
const { actorInfo, departObj } = storeToRefs(buffStore)

// 初始化
onMounted(async () => {
  if (accountStore.isConnected && minerStore.minerObj) {
    form.value.node = minerStore.minerObj.node
    form.value.owner = minerStore.minerObj.owner

    query2.value.params[0].From = await minerStore.minerObj.oldOwner //钱包oldOwner地址
    query2.value.params[0].To = minerStore.minerEnterContractId //合约id

    node.value = minerStore.minerObj.node //节点号
    // 钱包角色
    role.value = minerStore.minerObj.role

    await getNonce()
    // owner
    if (minerStore.minerObj.role == 1) {
      form.value.ownerId = minerStore.minerObj.ownerId
      query2.value.params[0].Method = minerStore.method //方法 3844450837
      getOwnerDepartAbi()
    } else {
      // 受益人
      query2.value.params[0].To = minerStore.minerObj.node //节点号
      form.value.beneficiaryId = minerStore.minerObj.beneficiaryId
      query2.value.params[0].Method = 30
      getBeneficiaryParams() //合约参数
    }

    getGas()
  } else {
    router.push({
      path: `/buff/minerInfo/${minerStore.minerObj.node}`
    }) //节点详情
  }
})

// 加载图标
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
const loading = ref(false) //加载下一页
const textarea = ref() //签名结果
const skeletonShow = ref(true) //骨架屏显示
const role = ref(1) //角色(根据角色展示不同的钱包id)

// 提交申请表单
const form = ref({
  node: '', // 节点
  owner: '', // owner 钱包地址
  ownerId: '', //钱包 ownerId
  beneficiaryId: '' //受益人id
})

// 主要内容
const mainForm = ref({
  form: '',
  to: '',
  method: '',
  gasFee: ''
})

// 详细内容
const detailForm = ref({
  From: '',
  To: '',
  Method: '',
  GasFeeCap: '',
  GasLimit: '',
  GasPremium: '',
  Params: '',
  Value: '',
  Nonce: '',
  Version: ''
})

// getNonce
const query = ref({
  jsonrpc: '2.0',
  method: 'Filecoin.MpoolGetNonce',
  params: [],
  id: Math.floor(Math.random() * 100) //随机向下取整
})

// getGas
const query2 = ref({
  jsonrpc: '2.0',
  method: 'Filecoin.GasEstimateMessageGas', //方法名
  params: [
    {
      From: '', //owner钱包地址
      To: '', //合约id
      Method: '', //方法类型，23代表修改owner(入职)  30代表受益人
      Params: '', //3.生成的param参数
      Value: '0', //金额0
      Nonce: '', // 获取的nonce值
      Version: 0, //0
      GasFeeCap: '0' //消耗的gas
    },
    { MaxFee: '250000000000000000' }, //第二个参数使用gas上限，写死就好
    [] //第三个参数留空
  ],
  id: Math.floor(Math.random() * 100) //随机向下取整
})

// getPush
const query3 = ref({
  jsonrpc: '2.0',
  method: 'Filecoin.MpoolPush',
  params: [
    {
      Message: {
        From: '', //owner钱包地址
        To: '', //节点ID
        Method: '', //方法类型，23代表修改owner  30代表受益人
        Nonce: '', //2 获取的nonce值
        Params: '', //参数
        Value: '0', //金额0
        GasFeeCap: '', // 接口获取的gas
        GasLimit: '', // 接口获取
        GasPremium: '', // 接口获取
        Version: 0
      },

      //签名内容
      Signature: {
        Type: '', //类型 f1为1，f3为2，f4为3 通过签名结果前两位亦可判断
        Data: '' //签名结果
      }
    }
  ],
  id: Math.floor(Math.random() * 100) //随机向下取整
})

// getMsg
const query4 = ref({
  jsonrpc: '2.0',
  method: 'Filecoin.StateWaitMsg',
  params: [
    {
      '/': ''
    },
    1,
    // Math.floor(Math.random() * 100 + 900), //随机向下取整大于九百的数
    -1, //随机向下取整大于九百的数
    true
  ],
  id: Math.floor(Math.random() * 100) //随机向下取整
})

//   owner离职  getGas Params
const signQuery = ref('minerExiting(uint64)') //智能合约abi接口  方法节+点号
const node = ref() //节点号
const getOwnerDepartAbi = () => {
  const params = departAbi(signQuery.value, node.value)
  query2.value.params[0].Params = params
  // console.log('getOwnerDepartAbi:', params)
}

// 受益人离职params
const getBeneficiaryParams = () => {
  const params = beneficiaryParams2(minerStore.minerObj.ownerId)
  query2.value.params[0].Params = params

  // console.log('getBeneficiaryParams:', params)
}

// getNonce
const nonce = ref()
const getNonce = async () => {
  // getNonce
  query.value.params = await [
    minerStore.minerObj.oldOwner
      ? minerStore.minerObj.oldOwner
      : minerStore.minerObj.owner
  ]
  const res = await filecoinMpoolGetNonce(query.value)
  if (!res.error) {
    nonce.value = await res.result

    query2.value.params[0].Nonce = res.result
  } else {
    // 提示错误
    ElMessage.error(res.error.message)
  }
}

//  getGas
const cidParams = ref()
const getGas = async () => {
  const res = await filecoinGasEstimateMessageGas(query2.value)

  if (!res.error) {
    skeletonShow.value = false //关闭骨架屏

    //  cid编码
    cidParams.value = cidToBytesToHex(res.result.CID['/'])

    // 主要内容
    mainForm.value = {
      form: res.result.From,
      to: res.result.To,
      method: res.result.Method,
      gasFee: res.result.GasFeeCap
    }

    // 详细内容
    detailForm.value = {
      From: res.result.From,
      To: res.result.To,
      Method: res.result.Method,
      GasFeeCap: res.result.GasFeeCap,
      GasLimit: res.result.GasLimit,
      GasPremium: res.result.GasPremium,
      Params: res.result.Params,
      Value: res.result.Value,
      Nonce: res.result.Nonce,
      Version: res.result.Version
    }

    // 推送签名参数
    query3.value = await {
      jsonrpc: '2.0',
      method: 'Filecoin.MpoolPush',
      params: [
        {
          Message: {
            Method: res.result.Method, //方法类型，23代表修改owner
            Nonce: nonce.value, //单独获取的nonce值
            To: res.result.To, //节点
            From: res.result.From, //owner钱包地址
            Params: res.result.Params,
            Value: '0', //金额0
            GasFeeCap: res.result.GasFeeCap,
            GasLimit: res.result.GasLimit,
            GasPremium: res.result.GasPremium,
            Version: 0
          },

          Signature: {
            Type: '', //类型 f1为1，f3为2，f4为3 通过签名结果前两位亦可判断
            Data: '' //签名结果
          } //签名内容
        }
      ],
      id: Math.floor(Math.random() * 100) //随机向下取整
    }
  } else {
    // 提示错误
    ElMessage.error(res.error.message)
    loading.value = false //关闭加载
  }
}

// 提交签名内容
const pushId = ref('') //推送消息Id
const getPush = async () => {
  const typeNum = +textarea.value.slice(0, 2)
  const signTxt = textarea.value.substr(2) //删除前两位 前两位为类型判断
  const base64 = await HexToBase64(signTxt) //编码成base64

  // 提交签名内容内容参数
  query3.value.params[0].Signature.Type = await typeNum
  query3.value.params[0].Signature.Data = await base64

  const res = await filecoinMpoolPush(query3.value)
  if (!res.error) {
    pushId.value = res.result['/']
  } else {
    pushId.value = ''
  }

  return res
}

//点击消息ID跳到区块浏览器查询
const clickPushId = () => {
  window.open(minerStore.linkHref + pushId.value, '_blank')
}

// 查询上链结果
const getMsg = async () => {
  const res = await filecoinStateWaitMsg(query4.value)

  if (!res.error) {
    if (res.result.Receipt.ExitCode == 0) {
      // 返回结果不报错即可代表上链成功  跳转设置操作人
      ElMessage.success('上链成功')

      loading.value = false //停止加载

      // 接收申请
      router.push({
        path: '/buff/exitPlatform_singleReceiveApply'
      })
    } else {
      ElMessage.error('上链消息异常，功能不执行，需重新操作')
      // 再次回到这个页面操作
      router.push({
        path: '/buff/singleApply'
      })
    }
  } else {
    // 上链失败
    loading.value = false //停止加载
    ElMessage.error(res.error.message)

    // 再次回到这个页面操作
    router.push({
      path: '/buff/singleApply'
    })
  }
}

// 上一步
const backClick = async () => {
  if (buffStore.departObj.status == 1) {
    router.push({
      path: `/buff/minerInfo/${minerStore.minerObj.node}`
    })
  } else if (
    buffStore.departObj.status == 2 ||
    buffStore.departObj.status == 3
  ) {
    router.push({
      path: `/buff/minerInfoExit/${minerStore.minerObj.node}`
    })
  }
}

// 下一步
const nextClick = async () => {
  if (textarea.value && !loading.value) {
    loading.value = true //开启加载下一页

    const res = await getPush() //提交签名

    if (!res.error) {
      //上链消息参数
      query4.value.params[0]['/'] = await res.result['/']

      // 等1分钟发请求获取上链消息
      setTimeout(async () => {
        await getMsg() //获取上链结果
      }, 60000)
    } else {
      loading.value = false //停止加载
      ElMessage.error(res.error.message)
    }
  } else if (!textarea.value) {
    ElMessage.error('Please fill in the signature result.')
  } else {
    ElMessage.info('Loading...')
  }
}

// 主要/详细内容
const btnArr = ref([
  {
    label: 'Exit_main'
  },
  {
    label: 'Exit_details'
  }
])
const infoIndex = ref(0) // 内容下标

// 点击内容按钮
const infoBtnClick = (item, index) => {
  infoIndex.value = index
}

//点击复制
const handleCopy = async val => {
  if (val == 'detail') {
    const range = document.createRange() //创建range对象
    range.selectNode(document.getElementById('copyCode1')) //获取复制内容的 id 选择器
    const selection = window.getSelection() //创建 selection对象
    if (selection.rangeCount > 0) selection.removeAllRanges() //如果页面已经有选取了的话，会自动删除这个选区，没有选区的话，会把这个选取加入选区
    selection.addRange(range) //将range对象添加到selection选区当中，会高亮文本块
    document.execCommand('copy') //复制选中的文字到剪贴板
    ElMessage.success('复制成功')
    selection.removeRange(range) // 移除选中的元素
  } else {
    const copyTxt = `lotus wallet sign ${mainForm.value.form} ${cidParams.value}`
    try {
      await toClipboard(copyTxt)
      ElMessage.success('复制成功')
    } catch (e) {
      console.error('copy', e)
    }
  }
}
</script>

<script>
export default {
  name: 'exitPlatformSingleApply'
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
    // 骨架屏
    .el-skeleton.is-animated .el-skeleton__item {
      background: linear-gradient(
        103deg,
        #7b33c3 25%,
        var(--el-skeleton-to-color) 37%,
        var(--el-skeleton-color) 63%
      );
      background-size: 400% 100%;
      -webkit-animation: el-skeleton-loading 1.4s ease infinite;
      animation: el-skeleton-loading 1.4s ease infinite;
    }

    .el-skeleton__p.is-first {
      width: 100%;
    }
  }

  .start,
  .next {
    min-height: 400px;
    width: 150px;
    background: #7b33c3;
    border-radius: 12px;
    font-size: 25px;
    scale: 0.85;
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
.contentBox {
  width: 100%;
  min-height: 550px;
  background: linear-gradient(180deg, #2d1e46 0%, #5629ad 100%);
  border-radius: 20px;
  z-index: 5;
  font-family: 'Montserrat';
  box-sizing: border-box;
  color: #ccc;
  .title {
    h2 {
      padding: 20px 30px 0;
      font-weight: 700;
      color: #fff;
    }
  }
}

// 公共样式
.Original {
  padding: 5px 40px 10px;
}

// 申请
::v-deep .apply {
  padding-left: 20px;

  .OriginalInfo {
    padding: 10px 78px;
    .row {
      margin-top: 5px;
      .rightBox {
        color: #fff;
        font-weight: 700;
        // display: -webkit-box; //使用了flex，需要加
        // overflow: hidden; //超出隐藏
        word-break: break-all; //纯英文、数字、中文
        text-overflow: ellipsis; //省略号
        -webkit-box-orient: vertical; //垂直
        -webkit-line-clamp: 1; //显示一行
        white-space: pre-line; //合并空白符序列，但是保留换行符。(如果要使用这个垂直和显示几行的代码也要写)
        //查资料发现应该是元素脱离文档流然后定义宽度无效  换行符失效导致的

        span {
          color: #fff;
          font-weight: 700;
        }
      }
    }

    .tooltipTxt {
      font-weight: 700;
    }
  }
}

// 地址
.addressBox {
  ul {
    // display: flex;
    // flex-direction: column;
    // align-items: center;

    padding: 0 50px 30px;
    li {
      // width: 600px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      margin: 10px 0;
      border-radius: 10px;
      background: #34363e;
      box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.03);

      div {
        padding: 0 20px;
        display: -webkit-box; //使用了flex，需要加
        overflow: hidden; //超出隐藏
        word-break: break-all; //纯英文、数字、中文
        text-overflow: ellipsis; //省略号
        -webkit-box-orient: vertical; //垂直
        -webkit-line-clamp: 1; //显示一行
        white-space: pre-line; //合并空白符序列，但是保留换行符。(如果要使用这个垂直和显示几行的代码也要写)
        //查资料发现应该是元素脱离文档流然后定义宽度无效  换行符失效导致的

        .approved {
          padding: 5px 10px 7px;
          border: 1px solid #fcaa13;
          border-radius: 10px;
          margin: 0 25px;
          color: #fcaa13;
        }
      }

      &:hover {
        cursor: pointer;
      }

      &.active {
        background: $txtColor;
        color: #fff;
      }
    }
  }
}

// 消息
.infoContent {
  h6 {
    padding: 20px 20px 0;
  }
  .topBtn {
    display: flex;
    justify-content: center;
    li {
      text-align: center;
      border-radius: 6px;
      color: #fff;
      border: 1px solid #fff;

      padding: 3px 20px 5px;
      &:hover {
        cursor: pointer;
      }

      &:first-child {
        margin-right: 50px;
      }
    }

    li.active {
      color: #8c67f6;
      border: 1px solid #8c67f6;
    }
  }
}

// 主要内容
.mainInfo {
  min-height: 300px;
  padding: 10px 20px;
  border-radius: 5px;
  background: #272932;
  margin: 20px auto 0;
  position: relative;
  pre {
    display: -webkit-box; //使用了flex，需要加
    overflow: hidden; //超出隐藏
    word-break: break-all; //纯英文、数字、中文
    text-overflow: ellipsis; //省略号
    -webkit-box-orient: vertical; //垂直
    // -webkit-line-clamp: 1; //显示一行
    white-space: pre-line; //合并空白符序列，但是保留换行符。(如果要使用这个垂直和显示几行的代码也要写)
    //查资料发现应该是元素脱离文档流然后定义宽度无效  换行符失效导致的
  }

  .copyIcon {
    position: absolute;
    right: 10px;
    bottom: 10px;
    text-align: right;
    margin-top: -30px;
    margin-right: 10px;
    .el-icon:hover {
      cursor: pointer;
    }
  }
}

// 详细内容
::v-deep .detailInfo {
  margin: 20px auto;
  padding: 0 100px;
  .row {
    .detailRight {
      color: #fff;
      font-weight: 700;
      display: -webkit-box; //使用了flex，需要加
      overflow: hidden; //超出隐藏
      word-break: break-all; //纯英文、数字、中文
      text-overflow: ellipsis; //省略号
      -webkit-box-orient: vertical; //垂直
      -webkit-line-clamp: 1; //显示一行
      white-space: pre-line; //合并空白符序列，但是保留换行符。(如果要使用这个垂直和显示几行的代码也要写)
      //查资料发现应该是元素脱离文档流然后定义宽度无效  换行符失效导致的

      .el-only-child__content {
        font-weight: 700;
      }
    }
  }
}

// lotus签名
.lotus {
  .sign {
    margin: 0 auto;
    div {
      font-weight: 700;
      color: #fff;
      // display: -webkit-box; //使用了flex，需要加
      overflow: hidden; //超出隐藏
      word-break: break-all; //纯英文、数字、中文
      text-overflow: ellipsis; //省略号
      -webkit-box-orient: vertical; //垂直
      -webkit-line-clamp: 1; //显示一行
      white-space: pre-line; //合并空白符序列，但是保留换行符。(如果要使用这个垂直和显示几行的代码也要写)
      //查资料发现应该是元素脱离文档流然后定义宽度无效  换行符失效导致的

      span {
        font-weight: 700;
      }
    }

    .copyIcon {
      text-align: right;
      .el-icon:hover {
        cursor: pointer;
      }
    }
  }
}

// 签名结果
.result {
  padding-bottom: 40px;
  .Original {
    padding: 10px 40px;
  }
}

// 消息Id
.txtBox {
  margin-top: -30px;
  text-align: right;
  padding-right: 8%;
  padding-bottom: 40px;
  font-size: 14px;
  &:hover {
    cursor: pointer;
    color: #fff;
  }
}

::v-deep .mainResult {
  margin: 0 auto;

  .el-textarea {
    width: 100%;
    .el-textarea__inner {
      background: #272932;
      box-shadow: none;
      resize: none;
      border-radius: 10px;
      color: #ccc;
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
  .apply {
    padding: 20px;
    color: #ccc;
    .Original {
      padding: 10px 0px;
    }
  }

  .apply .OriginalInfo {
    padding: 0 10px;
    margin: 0;
    .row {
      margin-bottom: 10px;
      .leftBox {
        padding-left: 15px;
      }
      .rightBox {
        padding: 0;
      }
    }
  }

  // 地址
  .addressBox {
    ul {
      padding: 0 20px 10px;

      li {
        div {
          .approved {
            margin: 0 10px;
          }
        }
      }
    }
  }

  // 消息
  .infoContent {
    .detailInfo {
      padding: 0 20px;
      .row {
        .detailLeft {
          padding-left: 25px;
        }
        .detailRight {
          padding: 0;
        }
      }
    }

    .topBtn {
      li {
        &:first-child {
          margin-right: 20px;
        }
      }
    }
  }

  // 公共样式
  .Original {
    padding: 20px 20px 15px;
  }

  // 签名结果
  .result {
    .Original {
      padding: 10px 20px;
    }
  }
}
</style>
