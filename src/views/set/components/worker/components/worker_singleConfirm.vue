<template>
  <div id="WorkerSingleConfirm" class="container">
    <!-- 修改Control -->
    <div class="topProd">
      <h4>{{ $t('Control') }}</h4>

      <!--  如果有需要，您可以通过智能合约修改节点的Control地址。 -->
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

          <!-- 消息内容 -->
          <div class="infoContent">
            <!-- 确认worker -->
            <h6>{{ $t('worker_Confirm') }}</h6>

            <!-- 待确认的worker -->
            <p class="Original confirmed">{{ $t('worker_confirmed') }}</p>

            <!-- 当前worker -->
            <div class="old">
              <el-input
                :disabled="true"
                v-model.trim="oldAddress"
                :placeholder="$t('worker_confirmed')"
              >
                <template #suffix>
                  <el-icon @click="handleCopy('old')"><CopyDocument /></el-icon>
                </template>
              </el-input>
            </div>

            <!-- 消息内容 -->
            <p class="Original">{{ $t('operator_content') }}</p>

            <ul class="topBtn">
              <li
                class="col-4 col-sm-4 col-md-4 col-lg-4"
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
          <el-button @click="nextClick" class="nextPage"> Next </el-button>
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
  contractAbiCborCode4,
  cidToBytesToHex,
  HexToBase64
} from '@/utils/arraybufferToBase64.js'
import { useMinerStore } from '@/store/module/miner' //miner仓
import { useSetStore } from '@/store/module/set.js'
import { DocumentCopy, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router' //路由
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useClipboard from 'vue-clipboard3' //复制插件

const { toClipboard } = useClipboard() //使用复制插件
const router = useRouter() //使用路由

// 使用仓库
const minerStore = useMinerStore()
const { minerObj, minerEnterContractId, linkHref } = storeToRefs(minerStore)
const setStore = useSetStore()
const { controlInfo } = storeToRefs(setStore)

onMounted(async () => {
  if (minerStore.minerObj) {
    node.value = minerStore.minerObj.node

    workerId.value = setStore.controlInfo.NewWorker //新worker
    oldAddress.value = setStore.controlInfo.NewWorker //新worker
    if (setStore.controlInfo.ControlAddresses) {
      controlAddArr.value = setStore.controlInfo.ControlAddresses.map(v =>
        v.substr(2)
      ) // 控制地址数组
    } else {
      controlAddArr.value = []
    }

    await getNonce() //获取nonce
    await getAbiCborCode1() //新worker为空的时候
    await getGas() // 获取gas
  } else {
    router.push({
      path: '/buff/buff_home'
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
const textarea = ref() //签名结果
const skeletonShow = ref(true)
const oldAddress = ref() //待确认worker

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

//  getGas
const query2 = ref({
  jsonrpc: '2.0',
  method: 'Filecoin.GasEstimateMessageGas', //方法名
  params: [
    {
      From: '', //owner钱包地址
      To: '', //入职的合约 id
      Method: 3844450837,
      Params: '', // 生成的param参数
      Value: '0', //金额0
      Nonce: '', // 获取操作人信息中的nonce值
      Version: 0 //0
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
        From: '',
        Method: 2,
        Nonce: '',
        Params: '',
        To: '', //合约id
        Value: '0',
        GasFeeCap: '',
        GasLimit: '',
        GasPremium: '',
        Version: 0
      },

      Signature: {
        Type: '',
        Data: ''
      } //签名内容 Type: f1为1，f3为2，f4为3
    }
  ],
  id: Math.floor(Math.random() * 100)
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

// 获取 nonce值
const nonce = ref()
const getNonce = async () => {
  query.value.params = await [minerStore.minerObj.oldOwner]

  const res = await filecoinMpoolGetNonce(query.value)

  // console.log('getNonce', res)

  if (!res.error) {
    nonce.value = await res.result

    query2.value.params[0].Nonce = res.result
  } else {
    // 提示错误
    ElMessage.error(res.error.message)
  }
}

// 获取合约 abi编码params
const node = ref()
const workerId = ref()
const controlAddArr = ref()
// 如果有NewWorker且WorkerChangeEpoch已经超过当前时间/高度
const signQuery1 = ref('confirmChangeWorkerAddress(uint64)') //节点号
const getAbiCborCode1 = () => {
  const arr = [signQuery1.value, node.value]

  const params = contractAbiCborCode4(arr)
  query2.value.params[0].Params = params //  getGas参数
  // console.log('contractAbiCborCode4', params)
}

// 获取  gas and cid
const cidParams = ref() //cid编码
const getGas = async () => {
  query2.value.params[0].From = await minerStore.minerObj.oldOwner //钱包地址
  query2.value.params[0].To = await minerStore.minerEnterContractId //合约id

  const res = await filecoinGasEstimateMessageGas(query2.value)
  console.log('getGas:', res)

  if (!res.error) {
    skeletonShow.value = false
    //  cid编码16进制--lotus消息
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

    query3.value = await {
      jsonrpc: '2.0',
      method: 'Filecoin.MpoolPush',
      params: [
        {
          Message: {
            From: res.result.From, //owner钱包地址
            Method: res.result.Method, //方法类型，跟获取gas一致
            Nonce: res.result.Nonce, //2获取的nonce值
            Params: res.result.Params,
            To: res.result.To, // 合约id
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
  }
}

//推送上链
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
      loading.value = false
      setStore.clearSet() //清空信息

      // 成功
      router.push({
        path: '/buff/worker_success'
      })
    } else {
      ElMessage.error('上链消息异常，功能不执行，需重新操作')
      router.push('/buff/worker_await')
    }
  } else {
    loading.value = false //停止加载
    ElMessage.error(res.error.message)
  }
}

// 上一步
const backClick = async () => {
  router.push('/buff/worker_await')
}

// 下一步

const nextClick = async () => {
  if (textarea.value && !loading.value) {
    loading.value = true //开启加载下一页

    const res = await getPush() //提交签名

    if (!res.error) {
      // getMsg消息参数
      query4.value.params[0]['/'] = await res.result['/']

      // 等1分钟发请求获取上链消息
      setTimeout(async () => {
        await getMsg() //获取结果
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

// 消息按钮
const btnArr = ref([
  {
    label: 'operator_main'
  },
  {
    label: 'operator_details'
  }
])
const infoIndex = ref(0)
const infoBtnClick = (item, index) => {
  infoIndex.value = index
}

//点击复制
const handleCopy = async val => {
  if (val == 'old') {
    try {
      await toClipboard(oldAddress.value)
      ElMessage.success('复制成功')
    } catch (e) {
      console.error('copyError', e)
    }
  } else if (val == 'detail') {
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
      console.error('copyError', e)
    }
  }
}
</script>

<script>
export default {
  name: 'WorkerSingleConfirm'
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

  // 加载样式
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

  // 卡片信息
  .cardInfo {
    flex: 1;
    z-index: 5;
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

.contentBox {
  width: 100%;
  min-height: 550px;
  background: linear-gradient(180deg, #2d1e46 0%, #5629ad 100%);
  border-radius: 20px;
  z-index: 5;
  box-shadow: -2px -2px 5px #2d1e46, 2px 2px 5px #5c2cb9;
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

.Original.confirmed {
  padding: 10px 40px 0;
}

// 消息
::v-deep .infoContent {
  h6 {
    margin: 10px 0 0 30px;
  }

  .topBtn {
    display: flex;
    justify-content: center;
    li {
      text-align: center;
      border-radius: 6px;
      padding: 3px 20px 5px;
      color: #fff;
      border: 1px solid #fff;
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

  // 待确认
  .old {
    margin: 0 15% 0 15%;
    .txt {
      margin-left: -100px;
    }
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

  // 复制图标
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
.detailInfo {
  margin: 20px auto;
  padding: 0 100px;
  .row {
    .detailRight {
      color: #fff;
      font-weight: 700;
      // display: -webkit-box; //使用了flex，需要加
      overflow: hidden; //超出隐藏
      word-break: break-all; //纯英文、数字、中文
      text-overflow: ellipsis; //省略号
      -webkit-box-orient: vertical; //垂直
      -webkit-line-clamp: 1; //显示一行
      white-space: pre-line; //合并空白符序列，但是保留换行符。(如果要使用这个垂直和显示几行的代码也要写)
      //查资料发现应该是元素脱离文档流然后定义宽度无效  换行符失效导致的
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
    }

    .copyIcon {
      text-align: right;
      .el-icon:hover {
        cursor: pointer;
      }
    }
  }
}

// 结果
.result {
  padding-bottom: 40px;
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

@media screen and (min-width: 768px) and (max-width: 992px) {
  // 公共样式
  .Original {
    padding: 5px 40px 10px;
  }

  // 消息
  .infoContent {
    .detailInfo {
      padding: 0 20px;
    }

    // 待确认
    .old {
      // margin: 1% 15% 0 15%;
      .txt {
        margin-left: -10px;
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
  }

  // 消息
  .infoContent {
    .detailInfo {
      padding: 0 20px;
    }

    // 待确认
    .old {
      // margin: 1% 15% 0 15%;
      .txt {
        margin-left: -30px;
      }
    }
  }

  // 公共样式
  .Original {
    padding: 10px 20px;
  }
  .Original.confirmed {
    padding: 10px 20px 0;
  }
}
</style>
