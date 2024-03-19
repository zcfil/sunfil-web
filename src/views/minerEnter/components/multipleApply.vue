<template>
  <!-- 多签 -->
  <div id="MultipleApply" class="container">
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
            <h2>{{ $t('Check_node') }} {{ form.node }}</h2>
          </div>

          <!-- 申请 -->
          <div class="apply">
            <!-- 设置操作员 -->
            <p v-if="role == 1" style="margin-top: 10px">
              {{ $t('Check_Submit') }}
            </p>
            <p v-if="role == 2" style="margin-top: 10px">
              {{ $t('Check_Submit2') }}
            </p>
            <p v-if="role == 1" class="Original" style="font-weight: 700">
              Original Owner
            </p>
            <p v-if="role == 2" class="Original" style="font-weight: 700">
              Original Beneficiary
            </p>

            <div class="OriginalInfo">
              <div class="row">
                <div class="leftBox col-4 col-sm-4 col-md-4 col-lg-4">
                  Address
                </div>
                <div
                  v-if="!skeletonShow"
                  class="rightBox col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  {{ form.owner }}
                </div>
                <div v-else class="rightBox col-8 col-sm-8 col-md-8 col-lg-8">
                  <el-skeleton :rows="0" animated />
                </div>
              </div>

              <div class="row">
                <div class="leftBox col-4 col-sm-4 col-md-4 col-lg-4">
                  Actor
                </div>

                <div
                  v-if="!skeletonShow"
                  class="rightBox col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  {{ form.node }}
                </div>
                <div v-else class="rightBox col-8 col-sm-8 col-md-8 col-lg-8">
                  <el-skeleton :rows="0" animated />
                </div>
              </div>

              <div class="row">
                <div class="leftBox col-4 col-sm-4 col-md-4 col-lg-4">
                  Approval Threshold
                </div>

                <div
                  v-if="!skeletonShow"
                  class="rightBox col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  {{ form.threshold }}
                </div>
                <div v-else class="rightBox col-8 col-sm-8 col-md-8 col-lg-8">
                  <el-skeleton :rows="0" animated />
                </div>
              </div>

              <div class="row">
                <div class="leftBox col-4 col-sm-4 col-md-4 col-lg-4">
                  No. of Singer
                </div>

                <div
                  v-if="!skeletonShow"
                  class="rightBox col-8 col-sm-8 col-md-8 col-lg-8"
                >
                  {{ form.signersNum }}
                </div>
                <div v-else class="rightBox col-8 col-sm-8 col-md-8 col-lg-8">
                  <el-skeleton :rows="0" animated />
                </div>
              </div>
            </div>
          </div>

          <!-- 请选择一个地址来发起申请 -->
          <div class="addressBox">
            <p class="Original">{{ $t('Check_Please') }}</p>

            <ul v-if="!skeletonShow">
              <li
                class="col-12 col-sm-12 col-md-12 col-lg-12"
                :class="{ active: index == itemIndex }"
                v-for="(item, index) in addressArr"
                :key="index"
              >
                <el-tooltip placement="top" effect="light" trigger="click">
                  <template #content>
                    <div class="tooltipTxt" style="width: 300px">
                      {{ item.Address }}
                    </div>
                  </template>
                  <el-button
                    :disabled="item.disabled"
                    type="info"
                    class="btn"
                    @click="addressClick(item, index)"
                  >
                    <template #default>
                      <span v-if="index == itemIndex" class="approved">
                        Approved
                      </span>

                      <!-- 选中图标 -->
                      <el-icon v-if="item.disabled"><SuccessFilled /></el-icon>

                      <span> {{ item.Address }}</span>
                    </template>
                  </el-button>
                </el-tooltip>
              </li>
            </ul>

            <!-- 骨架屏 -->
            <ul v-else>
              <li><el-skeleton :rows="0" animated /></li>
              <li><el-skeleton :rows="0" animated /></li>
              <li><el-skeleton :rows="0" animated /></li>
            </ul>
          </div>

          <!-- 消息内容 -->
          <div v-if="itemIndex >= 0" class="infoContent">
            <p class="Original">{{ $t('Check_content') }}</p>

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
                  v-if="!showSkeleton"
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
                  v-if="!showSkeleton"
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
                  v-if="!showSkeleton"
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
                  v-if="!showSkeleton"
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
          <div v-if="itemIndex >= 0" class="lotus">
            <p class="Original">{{ $t('Check_Message') }}</p>

            <div
              v-if="!showSkeleton"
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
          <div v-if="itemIndex >= 0" class="result">
            <p class="Original">{{ $t('Check_Results') }}</p>

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
          <div v-if="pushId" @click="clickPushId" class="txtBox">
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
import {
  minerMsigInspect,
  filecoinGasEstimateMessageGas,
  filecoinMpoolPush,
  filecoinStateWaitMsg
} from '@/api/checkIn.js'
import {
  arraybufferToBase64,
  cidToBytesToHex,
  HexToBase64,
  MajorType1,
  beneficiaryParams
} from '@/utils/arraybufferToBase64.js'
import { serializeParams } from '@zondax/filecoin-signing-tools' //cbor编码库
import useClipboard from 'vue-clipboard3' //复制插件
import { DocumentCopy, SuccessFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router' //路由
import { ref, onMounted } from 'vue'
import { useAccountStore } from '@/store/module/accounts.js' //账号仓
import { useMinerStore } from '@/store/module/miner.js' //节点信息仓
import { storeToRefs } from 'pinia'

const accountStore = useAccountStore()
const { isConnected } = storeToRefs(accountStore)
const minerStore = useMinerStore()
const {
  minerObj,
  motionInfo,
  minerEnterContractId2,
  contractObj,
  checkInBool,
  linkHref,
  nodeDebt
} = storeToRefs(minerStore)

const router = useRouter() //路由
const { toClipboard } = useClipboard() //使用复制插件

onMounted(async () => {
  if (minerStore.minerObj && minerStore.checkInBool && !minerStore.nodeDebt) {
    form.value.node = minerStore.minerObj.node
    form.value.owner = minerStore.minerObj.owner
    role.value = minerStore.minerObj.role //角色

    // 获取 gas 参数  发送签名请求给 owner
    query2.value.params[0].To = minerStore.minerObj.owner

    // 获取多签信息
    await getData(minerStore.minerObj.owner)

    // 生成的合约方法编码
    obj.value.Params = minerStore.contractObj.Params

    // 生成第一次多签签名 gas中 params参数--owner角色
    if (minerStore.minerObj.role == 1) {
      obj.value.To = minerStore.minerObj.node

      // 如果没有提案
      if (!isFindMotion.value) {
        await getSerializeParams() //第一条参数
      } else {
        // 有提案 有提案txId生成参数 拿到提案的txId发信息
        if (sendNum.value >= 2) {
          txId.value = minerStore.motionInfo.TxId
        }
        getTxIdParams(minerStore.motionInfo.TxId)
      }
    } else {
      // 受益人
      obj2.value.To = minerStore.minerObj.node
      await getBeneficiaryParams()
      await getSerializeParams2()
    }
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
const addressArr = ref([]) //多签地址
const sendNum = ref(0) // 记录消息发送成功次数
const sendArr = ref([])
const txId = ref() //保存txId用于签两条以上消息
const skeletonShow = ref(true) //骨架屏显示
const showSkeleton = ref(true) //  getGas骨架屏显示
const role = ref(1) //owner

// 提交申请表单
const form = ref({
  node: '', // 节点
  owner: '', // owner 钱包地址
  threshold: '', //需要批准数
  signersNum: '', //多签成员个数
  approvals: '' //已签名钱包数量
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

//  getGas
const query2 = ref({
  jsonrpc: '2.0',
  method: 'Filecoin.GasEstimateMessageGas', //方法名
  params: [
    {
      From: '', //成员钱包地址
      To: '', //多签钱包节点号
      Method: 2, //方法类型，2代表发起多签提议 3是批准 第二次及以上签名都是批准
      Params: '', // 生成的param参数
      Value: '0', //金额0
      Nonce: '', //钱包nonce值
      Version: 0 //0
    },
    { MaxFee: '250000000000000000' }, //第二个参数使用gas上限，写死
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
        Method: '',
        Nonce: '',
        Params: '',
        To: '', //多签钱包节点号
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

// 获取多签信息
const isFindMotion = ref(false)
const getData = async owner => {
  const res = await minerMsigInspect({
    actor: owner
  })

  if (!res.error) {
    skeletonShow.value = false //关闭骨架屏

    form.value.threshold = res.data.Threshold //需要批准数
    form.value.signersNum = res.data.Signers.length //多签个数
    addressArr.value = res.data.Signers //多签成员

    // 如果已经有提案,找到保存,注意：多签成功之后提案会清空
    if (res.data.Transactions) {
      // 查看提案合约是否有本平台
      const findMotion = res.data.Transactions.find(
        v =>
          v.Params.substr(1) == minerStore.minerEnterContractId2.substr(1) &&
          v.Method == 23 &&
          v.To == minerStore.minerObj.node
      )

      // 如果有则保存提案
      if (findMotion) {
        minerStore.motionInfo = findMotion

        isFindMotion.value = true
        // 保存已经同意提案个数
        form.value.approvals = findMotion.Approvals

        // 拿到已签个数
        sendNum.value = form.value.approvals

        // 禁用已发过消息地
        res.data.Signers.map(v => {
          if (findMotion.ApprovalAddress.includes(v.Id)) {
            v.disabled = true

            if (sendArr.value.length <= 0) {
              sendArr.value.push(v)
            } else {
              //如果已经存在则不添加
              sendArr.value.map(i => {
                if (i.Id !== v.Id) {
                  sendArr.value.push(v)
                }
              })
            }
          }
        })
      }
    }
  }
}

// getGas  params 参数 第一次  owner参数
const obj = ref({
  To: '', //当前需要入职的节点
  Value: '0',
  Method: 23,
  Params: '' //合约地址编码 后端提供
})

const getSerializeParams = async () => {
  const bytesArr = serializeParams(obj.value) //把对象转成

  const params = arraybufferToBase64(bytesArr)

  //把字节数组转成 base64
  query2.value.params[0].Params = params
}

// 受益人参数
const obj2 = ref({
  To: '', //当前需要入职的节点
  Value: '0',
  Method: 30,
  Params: '' //合约地址编码
})

const getBeneficiaryParams = () => {
  const params = beneficiaryParams(minerStore.minerEnterContractId2)
  obj2.value.Params = params
}

const getSerializeParams2 = async () => {
  const bytesArr = serializeParams(obj2.value) //把对象转成
  const params = arraybufferToBase64(bytesArr)

  //把字节数组转成 base64
  query2.value.params[0].Params = params
}

// 获取二次及以上签名 getGas 参数
const getTxIdParams = id => {
  // 第一段
  const txId = id
  const arr = [130]

  // 第二段

  let obj = 0
  if (obj >= 0) {
    obj = MajorType1(9, 0, txId)
  } else {
    obj = MajorType1(9, 1, -txId - 1)
  }

  //第三段
  let obj2 = MajorType1(1, 2, 0)

  // 合并字节数组
  const concat = [...arr, ...obj.arr.slice(0, obj.res), ...obj2.arr]

  // 生成编码...
  const params = arraybufferToBase64(concat)
  // 获取 gas 中Params参数
  query2.value.params[0].Params = params
}

// 获取 gas and cid
const cidParams = ref() //gas的cid编码
const getGas = async () => {
  const res = await filecoinGasEstimateMessageGas(query2.value)

  if (!res.error) {
    showSkeleton.value = false //关闭getGas骨架屏

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

    // 推送签名参数
    query3.value = await {
      jsonrpc: '2.0',
      method: 'Filecoin.MpoolPush',
      params: [
        {
          Message: {
            From: res.result.From, //owner钱包地址
            Method: res.result.Method, //方法类型，23代表修改owner
            Nonce: res.result.Nonce, //2获取的nonce值
            Params: res.result.Params,
            To: res.result.To, //多签钱包地址
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
    ElMessage.error(res.error.message)
    showSkeleton.value = false //关闭getGas骨架屏
  }
}

// 点击地址
const selectAddObj = ref()
const itemIndex = ref(-1)

const addressClick = async (item, index) => {
  showSkeleton.value = true //开启gas骨架屏

  if (!loading.value) {
    itemIndex.value = index

    selectAddObj.value = item

    // 请求gas参数
    query2.value.params[0].From = await item.Address //当前点击项地址
    query2.value.params[0].Nonce = await item.Nonce //当前点击项 nonce

    if (form.value.approvals > 0) {
      query2.value.params[0].Method = 3 //第二次及以上都是 3批准
    }

    // 获取gas
    getGas()
  }
}

//提交签名内容
const pushId = ref() //推送消息Id
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
      await sendNum.value++

      // 上链成功清空消息id
      pushId.value = ''

      // 保存发送成功项
      if (sendArr.value.length <= 0) {
        sendArr.value.push(selectAddObj.value)
      } else {
        //如果已经存在则不添加
        sendArr.value.map(i => {
          if (i.Id !== selectAddObj.value.Id) {
            sendArr.value.push(selectAddObj.value)
          }
        })
      }

      //循环签名
      if (+sendNum.value < +form.value.threshold) {
        // 禁用发送成功项

        addressArr.value.map(v => {
          sendArr.value.map(i => {
            if (v.Id == i.Id) {
              v.disabled = true
            }
          })
        })

        textarea.value = '' // 清空签名
        loading.value = false //停止加载
        itemIndex.value = -1 //地址选择重置

        //第二次及以上都是 3批准
        query2.value.params[0].Method = 3

        // 如果返回有就重新保存txId
        if (res.result.ReturnDec.TxnID) {
          txId.value = res.result.ReturnDec.TxnID
        }

        if (+sendNum.value < 2) {
          // 生成 txId
          await getTxIdParams(res.result.ReturnDec.TxnID)
        } else {
          // 生成 txId 用保存的值
          await getTxIdParams(txId.value)
        }
      } else {
        // 已经签完
        loading.value = false //停止加载
        textarea.value = '' //清空签名
        itemIndex.value = -1 //地址选择重置

        // 跳到设置操作人
        router.push({
          path: '/buff/setOperator'
        })
      }
    } else {
      ElMessage.error('上链消息异常，功能不执行，需重新操作')
      router.push({
        path: '/buff/minerRoleInfo'
      })
    }
  } else {
    // 上链失败
    loading.value = false //停止加载
    ElMessage.error(res.error.message)
  }
}

// 上一步
const backClick = async () => {
  router.push({
    path: '/buff/minerRoleInfo'
  })
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
      textarea.value = '' //清空签名
      itemIndex.value = -1 //地址选择重置
      // 提示
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
    label: 'Check_main'
  },
  {
    label: 'Check_details'
  }
])
const infoIndex = ref(0)
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
  name: 'MultipleApply'
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

.contentBox {
  width: 100%;
  min-height: 500px;
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
      .rightBox {
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

        span {
          color: #fff;
          font-weight: 700;
        }
      }
    }
  }
}

// 地址
.addressBox {
  ul {
    // display: flex;
    // flex-direction: column;
    // align-items: center;

    padding: 0 50px 10px;
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
      }

      &.active {
        background: $txtColor;
        color: #fff;
      }

      // 地址按钮
      .el-button {
        display: flex;
        background: transparent;
        width: 100%;
        height: 100%;
        // border: 1px solid yellowgreen;
        border: 1px solid transparent;
        color: #fff;
        span {
          display: -webkit-box; //使用了flex，需要加
          overflow: hidden; //超出隐藏
          word-break: break-all; //纯英文、数字、中文
          text-overflow: ellipsis; //省略号
          -webkit-box-orient: vertical; //垂直
          -webkit-line-clamp: 1; //显示一行
          white-space: pre-line; //合并空白符序列，但是保留换行符。(如果要使用这个垂直和显示几行的代码也要写)
          //查资料发现应该是元素脱离文档流然后定义宽度无效  换行符失效导致的
        }

        &.is-disabled {
          background: #968cc9;
        }
      }

      .approved {
        width: 110px;
        height: 100%;
        padding: 5px 10px 7px;
        border: 1px solid #fcaa13;
        border-radius: 10px;
        margin: 0 8px 0 0;
        color: #fcaa13;
      }
    }
  }
}

// 消息
.infoContent {
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
      border: 1px solid #8c67f6;
      color: #8c67f6;
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
  padding: 0 78px 0 100px;
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
