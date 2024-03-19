<template>
  <div id="Stake">
    <div class="container">
      <div class="top">
        <div class="topLeft col-12 col-sm-12 col-md-12 col-lg-8">
          <div class="titleBox">
            <div class="title">
              <!-- 流动质押你的FIL -->
              <div v-if="itemIndex == 0">
                <h4 class="col-6 col-sm-6 col-md-6 col-lg-6">
                  {{ $t('STAKE_txt') }}
                </h4>
                <h4 class="col-6 col-sm-6 col-md-6 col-lg-6">
                  {{ $t('STAKE_txt2') }}
                </h4>
              </div>

              <div v-if="itemIndex == 1">
                <h4 class="col-6 col-sm-6 col-md-6 col-lg-6">
                  {{ $t('STAKE_txt3') }}
                </h4>
                <h4 class="col-6 col-sm-6 col-md-6 col-lg-6">
                  {{ $t('STAKE_txt4') }}
                </h4>
              </div>
            </div>
          </div>

          <div class="filBox">
            <div class="left">
              <div class="col-12 col-sm-12 col-md-5 col-lg-5">
                <div class="itemBox">
                  <span v-if="!accountStore.isConnected">一 一 FIL</span>
                  <span v-else>{{ accountsBalance }} FIL</span>
                </div>

                <div style="font-size: 12px; color: #a3a4a8">FIL Balance</div>
              </div>

              <div class="divider col-12 col-sm-12 col-md-2 col-lg-2">
                <div></div>
              </div>

              <div class="col-12 col-sm-12 col-md-5 col-lg-5">
                <div class="itemBox">
                  <span v-if="!accountStore.isConnected">一 一 sunFIL</span>
                  <span v-else>{{ accountTokenBalance }} sunFIL</span>
                </div>

                <div
                  class="tokenBalance"
                  style="font-size: 12px; color: #a3a4a8"
                >
                  <span class="col-6 col-sm-6 col-md-6 col-lg-6"
                    >Token Balance</span
                  >

                  <span class="col-6 col-sm-6 col-md-6 col-lg-6">
                    <SvgIcon
                      @click="clickAddToken"
                      name="plus"
                      style="
                        width: 15px;
                        height: 15px;
                        background-color: #7139cf;
                        cursor: pointer;
                      "
                    />
                  </span>
                </div>
              </div>
            </div>

            <!-- 钱包地址 -->
            <div class="center">
              <div class="circleBox">
                <div class="circle">
                  <SvgIcon
                    v-if="accountStore.isConnected"
                    name="fox"
                    style="width: 100%; height: 100%"
                  >
                  </SvgIcon>
                </div>
              </div>

              <div class="addressBox">
                <span
                  class="address"
                  id="copyCode"
                  v-if="accountStore.isConnected"
                  >{{ accountStore.account }}</span
                >
                <!-- 钱包地址 -->
                <span class="address" v-else>{{ $t('STAKE_WALLET2') }}</span>
                <SvgIcon
                  @click="clickCopy"
                  name="copy"
                  style="
                    width: 15px;
                    height: 15px;
                    cursor: pointer;
                    margin-top: -5px;
                  "
                />
              </div>
            </div>

            <!-- 质押页面描述 -->
            <div class="right" style="color: #a3a4a8">
              {{ $t('STAKE_txt5') }}
            </div>
          </div>
        </div>

        <!-- 资金利用率组件 -->
        <CapitalRate />
      </div>

      <div class="bottom">
        <div class="bottomLeft col-12 col-sm-12 col-md-12 col-lg-8">
          <ul class="stakeAndUnStake">
            <li
              :class="{
                active: itemIndex == index
              }"
              v-for="(item, index) in stakeArr"
              :key="index"
              @click="stakeLiClick(index)"
            >
              <SvgIcon
                :class="{
                  active: itemIndex == index
                }"
                :name="item.icon"
                style="width: 25px; height: 30px; margin-top: -3px"
              />
              {{ $t(item.name) }}
            </li>
          </ul>

          <div class="stakeContent">
            <div class="inputBox">
              <!-- 质押 -->
              <el-input
                v-if="itemIndex == 0"
                type="number"
                :disabled="showBtnLoading"
                maxlength="10"
                @input="stakeInputFn"
                @blur="onblur($event, stakeInput)"
                @keydown="onKeydown"
                v-model.trim="stakeInput"
                placeholder="0.00"
              >
                <template #prefix>
                  <SvgIcon name="fil" style="width: 30px; height: 30px" />
                </template>

                <!-- 最大 -->
                <template #suffix>
                  <el-button
                    :disabled="showBtnLoading"
                    @click="clickMax(itemIndex)"
                    :class="maxColor"
                  >
                    {{ $t('STAKE_MAX') }}
                  </el-button>
                </template>
              </el-input>

              <!-- 解质押 -->
              <el-input
                v-else
                type="number"
                :disabled="showBtnLoading"
                maxlength="10"
                @blur="onblur($event, unStakeInput)"
                @input="unStakeInputFn"
                @keydown="onKeydown"
                v-model.trim="unStakeInput"
                placeholder="0.00"
              >
                <template #prefix>
                  <SvgIcon name="logo" style="width: 30px; height: 30px" />
                </template>
                <!-- 最大 -->
                <template #suffix>
                  <el-button
                    :disabled="showBtnLoading"
                    @click="clickMax(itemIndex)"
                    :class="maxColor"
                  >
                    {{ $t('STAKE_MAX') }}
                  </el-button>
                </template>
              </el-input>
            </div>

            <!-- 最小质押 -->
            <div
              v-if="itemIndex == 0 && !showTxtError && !showTxtMaXTip"
              style="font-size: 12px; margin: 10px 0 10px 20px; color: #ccc"
            >
              {{ $t('STAKE_maximum') }}
            </div>

            <!-- 预留至少0.5FIL的余额用于GAS -->
            <div
              v-if="itemIndex == 0 && showTxtError && accountStore.isConnected"
              class="maximumTxt"
              style="font-size: 12px; margin: 10px 0 10px 20px; color: #ff483d"
            >
              <el-icon>
                <WarningFilled style="margin-top: 3px" />
              </el-icon>
              {{ $t('STAKE_maximum2') }}
            </div>

            <!-- STAKE金额将超过你的FIL余额 -->
            <div
              v-if="itemIndex == 0 && showTxtMaXTip && accountStore.isConnected"
              class="maximumTxt"
              style="font-size: 12px; margin: 10px 0 10px 20px; color: #ff483d"
            >
              <el-icon>
                <WarningFilled style="margin-top: 3px" />
              </el-icon>
              {{ $t('STAKE_maximum3') }}
            </div>

            <!-- 保持切换平衡 -->
            <div
              style="height: 18px; margin: 10px 0 10px 20px; color: #ccc"
              v-if="itemIndex == 1"
            ></div>

            <ul>
              <!-- 你将收到 -->
              <li>
                <div>{{ $t('STAKE_will') }}</div>
                <div>
                  <span v-if="itemIndex == 0">{{
                    stakeInput ? stakeInput : 0
                  }}</span>
                  <span v-else>{{ unStakeInput ? unStakeInput : 0 }}</span>
                  <span v-if="itemIndex == 0"> sunFIL</span>
                  <span v-else> FIL</span>
                </div>
              </li>

              <!-- 可用流动 -->
              <li>
                <div>{{ $t('STAKE_Liquidity') }}</div>
                <div v-if="itemIndex == 0">
                  <SvgIcon
                    v-if="itemIndex == 0 && stakeInput"
                    name="greenUp"
                    style="
                      width: 20px;
                      height: 20px;
                      margin-top: -5px;
                      margin-right: 5px;
                    "
                  />

                  <span
                    v-if="itemIndex == 0 && availableAssets"
                    :class="{ greenUp: itemIndex == 0 && stakeInput }"
                    >{{ availableAssets }} FIL</span
                  >
                  <span v-else> — — </span>
                </div>

                <div v-if="itemIndex == 1">
                  <SvgIcon
                    v-if="itemIndex == 1 && unStakeInput"
                    name="redDown"
                    style="
                      width: 20px;
                      height: 20px;
                      margin-top: -5px;
                      margin-right: 5px;
                    "
                  />

                  <span
                    v-if="itemIndex == 1 && unStakeAvailableAssets"
                    :class="{ redDown: itemIndex == 1 && unStakeInput }"
                    >{{ unStakeAvailableAssets }} FIL</span
                  >
                  <span v-else> — — </span>
                </div>
              </li>

              <!-- 汇率 -->
              <li>
                <div>{{ $t('STAKE_Rate') }}</div>
                <div>
                  {{
                    { 0: '1 FIL = 1 sunFIL', 1: '1 sunFIL = 1 FIL' }[itemIndex]
                  }}
                </div>
              </li>
            </ul>

            <div class="btnBox">
              <div v-if="accountStore.isConnected">
                <!-- 提 交 -->
                <div class="pushIdBox" v-if="stakeId && itemIndex == 0">
                  <span class="pushId" @click="clickPushId(0)">
                    <span style="margin-right: 5px">交易Hash</span>
                    <span
                      >{{ stakeId.slice(0, 10) }}...{{
                        stakeId.slice(-10)
                      }}</span
                    >
                    <SvgIcon
                      name="rocket"
                      style="
                        width: 16px;
                        height: 16px;
                        margin-top: -2px;
                        margin-left: 5px;
                      "
                    />
                  </span>
                </div>
                <div class="pushIdBox" v-if="unStakeId && itemIndex == 1">
                  <span class="pushId" @click="clickPushId(1)">
                    <span style="margin-right: 5px">交易Hash</span>
                    <span
                      >{{ unStakeId.slice(0, 10) }}...{{
                        unStakeId.slice(-10)
                      }}</span
                    >
                    <SvgIcon
                      name="rocket"
                      style="
                        width: 16px;
                        height: 16px;
                        margin-top: -2px;
                        margin-left: 5px;
                      "
                    />
                  </span>
                </div>

                <!-- 提交按钮 -->
                <div v-if="itemIndex == 0">
                  <el-button
                    v-if="!showBtnLoading"
                    :disabled="submitDisabled"
                    class="submit"
                    @click="submitClick"
                  >
                    {{ $t('STAKE_SUBMIT') }}
                  </el-button>
                </div>

                <div v-if="itemIndex == 1">
                  <el-button
                    v-if="!showBtnLoading"
                    :disabled="submitDisabled2"
                    class="submit"
                    @click="submitClick"
                  >
                    {{ $t('STAKE_SUBMIT') }}
                  </el-button>
                </div>

                <!-- 交易确认-->
                <el-button
                  v-if="showBtnLoading"
                  :loading="showBtnLoading"
                  class="submit"
                >
                  {{ $t('STAKE_SUBMIT2') }}
                </el-button>
              </div>

              <!-- 连接钱包 -->
              <el-button v-else class="link" @click="linkWalletClick">{{
                $t('STAKE_Connect')
              }}</el-button>
            </div>
          </div>
        </div>
        <div class="bottomRight col-12 col-sm-12 col-md-12 col-lg-4">
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toFixedNum } from '@/utils/num.js'
import { getNonceFn, getGasFn, getGasPriceData } from '@/utils/gas/gas.js'
import { gasParams } from '@/utils/arraybufferToBase64.js'
import CapitalRate from '@/components/capitalRate.vue' //资金利用率组件
import Sidebar from '@/components/sidebar.vue' //右侧价值组件
import { formatAmount } from '@/utils/formatAmount.js'
import useClipboard from 'vue-clipboard3' //复制插件
import { ethers } from 'ethers' // ES6 or TypeScript
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/module/accounts.js' //账户信息store
import { useMinerStore } from '@/store/module/miner' //节点信息
import { useStakeContractStore } from '@/store/module/stakeContract.js' //质押合约
import { useSidebarStore } from '@/store/module/sidebar.js' //侧边栏
import { useRateContractStore } from '@/store/module/rateContract.js'

//  以太坊错误: 4001请求被用户拒绝  -32602 参数无效  -32603 内部错误
// 连接以太坊: MetaMask
// const providerWEB = new ethers.providers.Web3Provider(window.ethereum)

onMounted(async () => {
  getAvailable()

  if (
    window.ethereum &&
    window.ethereum.isMetaMask &&
    accountStore.isConnected
  ) {
    stakeContractAddr.value = stakeContractStore.stakeContractAddress //质押合约地址
    stakeContract.value = await stakeContractStore.getStakeContract() //生成质押合约

    stakeContractStore.getAccountData() //获取余额
  }
})

const { toClipboard } = useClipboard() //使用复制插件

// 使用pinia仓
const accountStore = useAccountStore()
const { isConnected, account, balance, tokenBalance, showType } =
  storeToRefs(accountStore) // 使用storeToRefs可以保证解构出来的数据也是响应式的
const stakeContractStore = useStakeContractStore()
const { stakeContractAddress, getStakeContract, getAccountData } =
  storeToRefs(stakeContractStore)

const sidebarStore = useSidebarStore()
const { getTotalFilSideInfo } = storeToRefs(sidebarStore)

const minerStore = useMinerStore()
const { linkHref } = storeToRefs(minerStore)

// 利率
const rateContractStore = useRateContractStore()
const { getAvailableAssetsData } = storeToRefs(rateContractStore)

// 实时监听钱包余额及合约
watch(
  () => [
    accountStore.balance,
    accountStore.tokenBalance,
    accountStore.account,
    accountStore.isConnected
  ],
  async ([new1, new2, new4, new5], [old1, old2, old4, old5]) => {
    if (new1) {
      accountsBalance.value = formatAmount(
        Number(new1.match(/^\d+(?:\.\d{0,2})?/))
      )
    }

    if (new2) {
      accountTokenBalance.value = formatAmount(
        Number(new2.match(/^\d+(?:\.\d{0,2})?/))
      )
    }

    if (new4 !== old4) {
      fromAccountAddress.value = accountStore.account
      //账号切换，重新生成质押合约
      stakeContract.value = await stakeContractStore.getStakeContract()
      stakeContractStore.getAccountData() //获取余额
    }

    // 清空输入框
    if (new5) {
      stakeInput.value = ''
      unStakeInput.value = ''
      showTxtError.value = false
      showTxtMaXTip.value = false
      getAvailable()
    } else {
      stakeInput.value = ''
      showTxtError.value = false
      showTxtMaXTip.value = false
      getAvailable()
    }
  }
)

const getPrice = async () => {
  // 连接以太坊: MetaMask
  const providerWEB = new ethers.providers.JsonRpcProvider(
    accountStore.netWorke
  )
  const gasPrice = await providerWEB.getGasPrice()
}

const nonce = ref() //nonce值
const gasParam = ref() //合约方法名生成的参数
const gasTxObj = ref({
  From: '', //发送地址
  To: '', // 接收地址（交易发给谁）
  Method: 3844450837, //方法类型
  Params: '', // 方法名和是否需要传参生成的编码
  Value: '1', //金额
  Nonce: '', // 获取的nonce值
  Version: 0, // 0
  GasFeeCap: '0' //消耗的gas
})
const gasData = ref() //gas值

// 获取可流动资金
const availableAssets = ref(0)
const unStakeAvailableAssets = ref(0)
const availableAssets2 = ref(0)
const getAvailable = async () => {
  const res = await rateContractStore.getAvailableAssetsData()

  // 可流动资金
  availableAssets2.value = toFixedNum(
    JSON.parse(JSON.stringify(res.data.availableAssets)),
    2
  )

  checkStakeInput()
  checkUnStakeInput()
}

//钱包余额
const accountsBalance = ref(
  accountStore.balance
    ? formatAmount(Number(accountStore.balance.match(/^\d+(?:\.\d{0,2})?/)))
    : null
)

// 代币余额
const accountTokenBalance = ref(
  accountStore.tokenBalance
    ? formatAmount(
        Number(accountStore.tokenBalance.match(/^\d+(?:\.\d{0,2})?/))
      )
    : null
)

//质押合约
const stakeContract = ref()

//质押或解质押
const itemIndex = ref(0)
const stakeArr = ref([
  {
    name: 'STAKE_Stake',
    icon: 'stake2'
  },
  {
    name: 'STAKE_UNstake',
    icon: 'stake3'
  }
])

const stakeLiClick = index => {
  itemIndex.value = index

  // 重新获取可流动资金
  getAvailable()
}

// 添加代币方法
const tokenAddFn = async () => {
  const res = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: stakeContractStore.stakeContractAddress,
        symbol: 'SunFIL',
        decimals: 18,
        image: 'https://foo.io/token-image.svg'
      }
    }
  })

  if (res) {
    ElMessage.success('sunFIL successfully added to wallet!')
  } else {
    throw new Error('Something went wrong.')
  }
}

//点击添加账户代币
const clickAddToken = () => {
  tokenAddFn()
}

// 点击复制钱包地址
const clickCopy = async () => {
  if (accountStore.isConnected) {
    await toClipboard(accountStore.account)
    ElMessage.success('复制成功')
  }
}

/* 质押输入框 */
const stakeInput = ref(null) //质押输入框
const unStakeInput = ref(null) //解质押质押输入框
const showTxtError = ref(false) //提示质押gas预留0.5F
const showTxtMaXTip = ref(false) // 提示超出账户余额
const submitDisabled = ref(true) //控制提交按钮禁启用
const submitDisabled2 = ref(true) //控制提交按钮禁启用

//封装获取gas
const getGasDataFn = async (value, boolNum) => {
  // 获取nonce值
  nonce.value = await getNonceFn(accountStore.account)

  if (itemIndex.value == 0) {
    gasParam.value = await gasParams('addStakes()', 'addStakes')
  } else {
    gasParam.value = await gasParams(
      'withdrawStakes(uint256,uint256)',
      'withdrawStakes',
      value.toString(),
      boolNum
    )
  }

  // 组装参数
  gasTxObj.value = {
    From: accountStore.account, //owner钱包地址
    To: stakeContractStore.stakeContractAddress, //合约
    Method: 3844450837, //方法类型
    Params: gasParam.value, //3.生成的param参数
    Value: itemIndex.value == 0 ? '1' : '0', //质押时候传 '1' 解质押写 '0'
    Nonce: nonce.value, // 获取的nonce值
    Version: 0, //0
    GasFeeCap: '0' //消耗的gas
  }

  gasData.value = await getGasFn(gasTxObj.value)
  // 获取链上价格
  const gasPriceData = await getGasPriceData()

  // 生成交易结构体
  let overrides = {}

  if (gasData.value) {
    if (itemIndex.value == 0) {
      if (Number(gasPriceData) < Number(gasData.value.GasFeeCap)) {
        overrides = {
          gasLimit: Math.floor(gasData.value.GasLimit * 0.85), // 设置交易燃气限制
          gasPrice: Math.floor((Number(gasPriceData) * 1.25).toString()), // 设置交易燃气价格
          value: value,
          nonce: nonce.value
        }
      } else {
        overrides = {
          gasLimit: Math.floor(gasData.value.GasLimit * 0.85), // 设置交易燃气限制
          gasPrice: Math.floor(
            (Number(gasData.value.GasFeeCap) * 1.25).toString()
          ), // 设置交易燃气价格
          value: value,
          nonce: nonce.value
        }
      }
    } else {
      if (Number(gasPriceData) < Number(gasData.value.GasFeeCap)) {
        overrides = {
          gasLimit: Math.floor(gasData.value.GasLimit * 0.85), // 设置交易燃气限制
          gasPrice: Math.floor((Number(gasPriceData) * 1.25).toString()), // 设置交易燃气价格
          nonce: nonce.value
        }
      } else {
        overrides = {
          gasLimit: Math.floor(gasData.value.GasLimit * 0.85), // 设置交易燃气限制
          gasPrice: Math.floor(
            (Number(gasData.value.GasFeeCap) * 1.25).toString()
          ), // 设置交易燃气价格
          nonce: nonce.value
        }
      }
    }
  } else {
    // 重新获取
    await getGasDataFn(value, boolNum)
    console.log('repetitionGas')
  }
  console.log('overrides:', overrides)
  return overrides
}

// 点击最大
const maxColor = ref('max')
const clickMax = index => {
  showTxtError.value = false
  showTxtMaXTip.value = false

  if (index == 0 && accountStore.isConnected) {
    showTxtError.value = false
    showTxtMaXTip.value = false
    submitDisabled.value = false //启用按钮

    // 质押 至少预留0.5FIL的余额用于GAS
    stakeInput.value = toFixedNum(
      Number(accountStore.balance) - 0.5 >= 1
        ? Number(accountStore.balance) - 0.5
        : 0,
      8
    )

    checkStakeInput()
  } else if (index == 1 && accountStore.isConnected) {
    maxColor.value = 'maxActive'
    showTxtError.value = false
    showTxtMaXTip.value = false

    // 解质押--代币
    unStakeInput.value = toFixedNum(accountStore.tokenBalance, 8)

    checkUnStakeInput()
  }
}
// 封装方法
const checkStakeInput = () => {
  if (accountStore.isConnected && stakeInput.value) {
    if (Number(stakeInput.value) >= 1) {
      submitDisabled.value = false //启用提交按钮

      // 可流动资产
      availableAssets.value = toFixedNum(
        Number(availableAssets2.value) + Number(stakeInput.value),
        2
      )

      if (Number(stakeInput.value) > Number(accountStore.balance)) {
        showTxtMaXTip.value = true //超出最大提示
        showTxtError.value = false
        submitDisabled.value = true //禁止提交
      } else {
        if (Number(stakeInput.value) > Number(accountStore.balance) - 0.5) {
          showTxtError.value = true //预留提示
          submitDisabled.value = true //禁止提交
        } else {
          showTxtMaXTip.value = false
          showTxtError.value = false
        }
      }
    } else {
      submitDisabled.value = true //禁止提交
      showTxtMaXTip.value = false
      showTxtError.value = false

      availableAssets.value = toFixedNum(
        Number(availableAssets2.value) + Number(stakeInput.value),
        2
      )
    }
  } else {
    //可流动资金+输入值
    availableAssets.value = toFixedNum(Number(availableAssets2.value), 2)
    submitDisabled.value = true //禁用提交按钮
    showTxtError.value = false
    showTxtMaXTip.value = false
  }
}

const checkUnStakeInput = () => {
  // 已经连接钱包解质押
  if (accountStore.isConnected) {
    if (unStakeInput.value) {
      if (Number(unStakeInput.value) >= Number(availableAssets2.value)) {
        submitDisabled2.value = false //启用提交按钮
        unStakeAvailableAssets.value = '0.00'

        // 解质押金额等于可流动金额
        unStakeInput.value = availableAssets2.value

        //再次判断是否大于代币余额
        if (Number(unStakeInput.value) >= Number(accountStore.tokenBalance)) {
          // 大于直接等于代币
          unStakeInput.value = toFixedNum(accountStore.tokenBalance, 8)

          //可流动资金-输入值
          unStakeAvailableAssets.value = toFixedNum(
            Number(availableAssets2.value) - Number(unStakeInput.value),
            2
          )

          //开启最大
          maxColor.value = 'maxActive'
        } else {
          unStakeAvailableAssets.value = toFixedNum(
            Number(availableAssets2.value) - Number(unStakeInput.value),
            2
          )

          maxColor.value = 'max'
        }
      } else {
        //再次判断是否大于代币余额
        if (Number(unStakeInput.value) > Number(accountStore.tokenBalance)) {
          submitDisabled2.value = false //启用提交按钮
          // 解质押金额等于最大代币余额
          unStakeInput.value = toFixedNum(accountStore.tokenBalance, 8)

          unStakeAvailableAssets.value = toFixedNum(
            Number(availableAssets2.value) - Number(unStakeInput.value),
            2
          )

          //开启最大
          maxColor.value = 'maxActive'
        } else {
          submitDisabled2.value = false //启用提交按钮
          unStakeAvailableAssets.value = toFixedNum(
            Number(availableAssets2.value) - Number(unStakeInput.value),
            2
          )

          maxColor.value = 'max'
        }
      }
    } else {
      //可流动资金-输入值
      unStakeAvailableAssets.value = toFixedNum(
        Number(availableAssets2.value) - Number(unStakeInput.value),
        2
      )
      submitDisabled2.value = true //禁用提交按钮
      showTxtError.value = false
      showTxtMaXTip.value = false
    }
  } else {
    // 未连接钱包-解质押
    if (Number(unStakeInput.value) >= Number(availableAssets2.value)) {
      unStakeAvailableAssets.value = '0.00' //可流动资金
    } else {
      //可流动资金-输入值
      unStakeAvailableAssets.value = toFixedNum(
        Number(availableAssets2.value) - Number(unStakeInput.value),
        2
      )
    }
    submitDisabled2.value = true //禁用提交按钮
    showTxtError.value = false
    showTxtMaXTip.value = false
  }
}

// 质押
const stakeInputFn = val => {
  if (val.length > 10) stakeInput.value = val.slice(0, 10)
  checkStakeInput()
}

// 解质押输入框
const unStakeInputFn = val => {
  if (val.length > 10) unStakeInput.value = val.slice(0, 10)
  checkUnStakeInput()
}

// 输入框中禁止输入e、+、-
const onKeydown = e => {
  let key = e.key
  if (key === 'e' || key === 'E' || key === '+' || key === '-') {
    e.returnValue = false
  } else {
    e.returnValue = true
  }
}

// 去除多余零
const onblur = e => {
  // 可以再次通过失焦事件先去除开头的0 再取出末尾的0
  e.target.value = e.target.value.replace(/^0+\./g, '0.') //把小数0开头的多余0去掉
  e.target.value = e.target.value.replace(/^[0]+/, '') //把整数0开头的多余0去掉

  e.target.value = parseFloat(e.target.value) //去除末尾的0
  if (itemIndex.value == 0) {
    stakeInput.value = e.target.value //重新赋值给变量
  } else {
    unStakeInput.value = e.target.value //重新赋值给变量
  }
}

// 点击提交
const stakeId = ref() //消息id
const unStakeId = ref() //解质押消息id
const showBtnLoading = ref(false) //控制加载显示
const fromAccountAddress = ref() //取当前小狐狸连接账号
const stakeContractAddr = ref() // 合约地址
const submitClick = async () => {
  // 重新生成提交合约
  stakeContract.value = await stakeContractStore.getStakeContract(2)

  showBtnLoading.value = true //开启加载

  let num = ''
  let amount = ''
  let overrides = ''

  if (itemIndex.value == 0) {
    num = JSON.parse(JSON.stringify(stakeInput.value))
    amount = ethers.utils.parseEther(stakeInput.value)
  } else {
    num = JSON.parse(JSON.stringify(unStakeInput.value))
    amount = ethers.utils.parseEther(unStakeInput.value)
  }

  // 结构参数
  if (maxColor.value == 'maxActive') {
    overrides = await getGasDataFn(amount, 1)
  } else {
    overrides = await getGasDataFn(amount, 0)
  }

  //  质押----调用智能合约质押方法下向合约转账
  if (itemIndex.value == 0) {
    switch (maxColor.value) {
      // 最大值质押
      case 'maxActive':
        try {
          //拿到交易hash
          const tx = await stakeContract.value.addStakes(overrides)
          stakeId.value = tx.hash
          const receipt = await tx.wait() // 等待交易被确认并返回收据

          if (receipt.status === 1) {
            ElNotification.success({
              title: 'Success',
              message: `<strong>You have successfully staked ${num} FIL</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })

            stakeId.value = ''
            stakeInput.value = '' //重置输入框
            showBtnLoading.value = false //关闭加载
            submitDisabled.value = true //禁用提交按钮
            //  刷新余额
            accountStore.getBalance()
            accountStore.getTokenBalance(stakeContract.value)
            sidebarStore.getTotalFilSideInfo() //刷新侧边栏
          }
        } catch (error) {
          stakeId.value = ''
          showBtnLoading.value = false //关闭加载
          console.log('maxStake', error)

          if (error.code == -32603) {
            ElNotification.error({
              title: 'Error',
              message: `<strong>There may be outstanding transaction activity.</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })
          }
        }

        break

      // 非最大值质押
      case 'max':
        try {
          //拿到交易hash
          const tx = await stakeContract.value.addStakes(overrides)
          stakeId.value = tx.hash
          const receipt = await tx.wait() // 等待交易被确认并返回收据

          if (receipt.status === 1) {
            ElNotification.success({
              title: 'Success',
              message: `<strong>You have successfully staked ${num} FIL</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })

            stakeId.value = ''
            stakeInput.value = '' //重置输入框
            showBtnLoading.value = false //关闭加载
            submitDisabled.value = true //禁用提交按钮
            //  刷新余额
            accountStore.getBalance()
            accountStore.getTokenBalance(stakeContract.value)
            sidebarStore.getTotalFilSideInfo() //刷新侧边栏
          }
        } catch (error) {
          stakeId.value = ''
          showBtnLoading.value = false //关闭加载

          if (error.code == -32603) {
            ElNotification.error({
              title: 'Error',
              message: `<strong>There may be outstanding transaction activity.</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })
          }
          console.log('catchStakeError', error)
        }

        break
    }
  } else if (itemIndex.value == 1) {
    // 解质押----调用智能合约质押方法提取质押
    switch (maxColor.value) {
      // 最大值
      case 'maxActive':
        try {
          //拿到交易hash
          const tx = await stakeContract.value.withdrawStakes(
            amount.toString(),
            1,
            overrides
          )

          unStakeId.value = tx.hash
          const receipt = await tx.wait() // 等待交易被确认并返回收据

          if (receipt.status === 1) {
            ElNotification.success({
              title: 'Success',
              message: `<strong>You have successfully unstaked ${num} FIL</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })

            unStakeId.value = ''
            stakeInput.value = '' //重置输入框
            showBtnLoading.value = false //关闭加载
            submitDisabled.value = true //禁用提交按钮

            //  刷新余额
            accountStore.getBalance()
            accountStore.getTokenBalance(stakeContract.value)
            sidebarStore.getTotalFilSideInfo() //刷新侧边栏
          }
        } catch (error) {
          unStakeId.value = ''
          showBtnLoading.value = false //关闭加载

          if (error.code == -32603) {
            ElNotification.error({
              title: 'Error',
              message: `<strong>There may be outstanding transaction activity.</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })
          }
          console.log('unStakeMax:', error)
        }
        break

      // 非最大值
      case 'max':
        try {
          //拿到交易hash
          const tx = await stakeContract.value.withdrawStakes(
            amount.toString(),
            0,
            overrides
          )

          unStakeId.value = tx.hash
          const receipt = await tx.wait() // 等待交易被确认并返回收据

          if (receipt.status === 1) {
            ElNotification.success({
              title: 'Success',
              message: `<strong>You have successfully unstaked ${num} FIL</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })

            unStakeId.value = ''
            stakeInput.value = '' //重置输入框
            showBtnLoading.value = false //关闭加载
            submitDisabled.value = true //禁用提交按钮

            //  刷新余额
            accountStore.getBalance()
            accountStore.getTokenBalance(stakeContract.value)
            sidebarStore.getTotalFilSideInfo() //刷新侧边栏
          }
        } catch (error) {
          unStakeId.value = ''
          showBtnLoading.value = false //关闭加载

          if (error.code == -32603) {
            ElNotification.error({
              title: 'Error',
              message: `<strong>There may be outstanding transaction activity.</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })
          }
          console.log('unStake:', error)
        }

        break
    }
  }
}

// 点击连接钱包
const linkWalletClick = () => {
  // 显示连接弹框
  accountStore.showType = true
}

//点击消息Hash跳到区块浏览器查询
const clickPushId = val => {
  switch (val) {
    // 借款
    case 0:
      window.open(minerStore.linkHref + stakeId.value, '_blank')
      break
    case 1:
      // 提现
      window.open(minerStore.linkHref + unStakeId.value, '_blank')
      break
  }
}
</script>

<script>
export default {
  name: 'Stake'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss'; //引用此混合样式

.container {
  position: relative;
  padding: 20px 20px;
  // background: url('@/assets/img/homeBg1.png');
  background-size: 100% 100%;

  // 输入框去除步进器样式
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::v-deep input[type='number'] {
    -moz-appearance: textfield;
  }
}
/* 公共样式 */

.top,
.bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
}

.topLeft {
  margin-right: 20px;
}
/* 顶部左边 */
.titleBox .title div {
  display: flex;
  justify-content: space-between;
  background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
  border-radius: 10px;
  padding: 40px 20px;

  h4:nth-child(1) {
    text-align: center;
  }

  h4:nth-child(2) {
    text-align: center;
  }
}

/* 流动质押 */
.filBox {
  display: flex;
  justify-content: space-between;
  padding: 25px 0px;

  .left {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-right: 10px;

    div {
      text-align: center;
      white-space: pre-wrap;
      word-break: break-all;

      // padding-left: 5px;
    }

    .itemBox {
      span {
        font-family: Montserrat;
        font-weight: 600;
        // font-size: 18px;
        word-break: break-all; //纯英文、数字、中文
      }
    }

    // 分割线
    .divider {
      padding-left: 0px;
      &:nth-child(2) {
        height: 30%;
        display: flex;
        justify-content: center;
        div {
          padding-left: 0px;
          width: 1px;
          height: 100%;
          border: 1px solid #5b5b5b;
        }
      }
    }

    // sunFIL
    .tokenBalance {
      .svg-icon {
        width: 13px !important;
        height: 13px !important;
        margin-left: 3px;
      }
    }
  }

  .center {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: -80px;

    // 钱包头像
    .circleBox {
      width: 120px;
      height: 120px;
      // border: 1px solid yellow;
      border-radius: 50%;
      background-color: #1a1c26;
      .circle {
        position: relative;
        height: 120px;
        width: 120px;
        scale: 0.8;
        border-radius: 50%;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ccc;

        // 钱包头像
        .avatarBox {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid yellow;
          position: absolute;
          bottom: -10px;
          right: -10px;
          background-color: #fff;
        }
      }
    }

    // 钱包地址
    .addressBox {
      width: 120px;
      display: flex;
      align-items: center;
      span {
        width: 100%;
        overflow: hidden; //超出隐藏
        text-overflow: ellipsis; //省略号
        -webkit-line-clamp: 1; //显示一行
        text-align: center;
      }
    }
  }

  .right {
    flex: 1;
    margin-left: 10px;
    font-size: 12px;
  }
}

/* 顶部右边 */
.topRight {
  flex: 1;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: $cardBgColor;
  font-family: 'Montserrat';
  // margin-left: 20px;

  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .greenCircle {
    // display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 3px;
    background: #65efad;
  }

  h2 {
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-style: normal;
    font-weight: 800;
    font-size: 60px;
    text-transform: capitalize;
    background: $txtColor;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    margin: 50px 0;
  }

  div {
    font-weight: 800;
    padding-right: 20px;
  }
}

/* 底部左边 */
.bottomLeft {
  padding: 30px 20px;
  border-radius: 10px;
  background-color: $cardBgColor;
  margin-right: 20px;
  margin-bottom: 20px;
}

.stakeAndUnStake {
  display: flex;
  li {
    padding: 10px 20px;

    border-bottom: 2px solid #67696f;
    &.active {
      border-bottom: 2px solid #8c67f7;
    }
    cursor: pointer;

    .svg-icon {
      color: #67696f;
      &.active {
        color: #8c67f7;
      }
    }
  }
}

/* 输入框 */
::v-deep .stakeContent {
  margin-top: 50px;
  padding: 0 30px;
  /* 输入框 */
  .el-input {
    height: 60px;
    .el-input__wrapper {
      border-radius: 15px;
      &.is-focus {
        box-shadow: none;
      }
      .el-input__inner {
        font-family: 'Montserrat';
        font-size: 30px;
      }
    }

    .el-button {
      width: 65px;
    }

    .is-disabled {
      border: 1px solid transparent;
      // background: #5e4b92;
      background: #9174c4;
      box-shadow: none;
      outline: none;
      color: #fff;
    }
    .is-disabled:hover {
      border: 1px solid transparent;
      background: #9174c4;
      box-shadow: none;
      outline: none;
      color: #fff;
    }
  }

  /* 汇率兑换 */
  ul {
    margin-top: 20px;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 50px;

      span.greenUp {
        color: #03ad00;
      }
      span.redDown {
        color: #b90005;
      }
    }
  }

  .maximumTxt {
    display: flex;
  }
}

.max {
  color: #fff;
  border: none;
  background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
  padding: 0px 10px;
}

.maxActive {
  color: #fff;
  border: none;
  // background: #5e4b92;
  background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
  padding: 0px 10px;
}

/* 连接按钮 */
::v-deep .btnBox {
  margin: 50px 0 0 0;
  text-align: center;
  .el-button {
    width: 80%;
    height: 50px;
    border-radius: 10px;
    margin: 10px 0 0 0;
    background-color: transparent;
    font-size: 18px;
  }
  .pushIdBox {
    .pushId {
      color: #ccc;
      cursor: pointer;
      &:hover span {
        color: #fff;
      }
    }
  }

  .link {
    border: 1px solid #ab97e2;
    color: #8c67f6;
  }

  .submit {
    background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
    color: #fff;
  }

  .is-disabled {
    border: 1px solid transparent;
    background: #5e4b92;
    box-shadow: none;
    outline: none;
  }
}

/* 底部右边 */
.bottomRight {
  flex: 1;
  margin-bottom: 20px;
}

@media screen and (max-width: 767px) {
  .titleBox .title div h4 {
    font-size: 13px;
  }

  /* 流动质押 */
  .filBox {
    display: flex;
    flex-direction: column;

    .left,
    .right {
      font-size: 12px;
    }

    .left {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 10px;

      div {
        padding: 0;
        font-size: 12px;
      }

      .divider:nth-child(2) {
        width: 85%;
        height: 1px;
        padding: 10px 0;

        div {
          width: 100%;
        }
      }

      div:nth-child(3) {
        div:nth-child(2) {
          .svg-icon {
            margin-left: 3px;
          }
        }
      }

      .tokenBalance {
        .svg-icon {
          margin-left: 0px;
          align-self: flex-end;
        }
      }
    }

    .center {
      margin-top: 0;
      .circleBox {
        width: 80px;
        height: 80px;

        border-radius: 50%;
        background-color: #1a1c26;
        .circle {
          position: relative;
          height: 80px;
          width: 80px;
          scale: 0.8;
          border-radius: 50%;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ccc;

          .avatarBox {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 1px solid yellow;
            position: absolute;
            bottom: -10px;
            right: -10px;
            background-color: #fff;
          }
        }
      }
    }
  }

  /* 输入框 */
  ::v-deep .stakeContent {
    margin-top: 20px;
    padding: 0;
    /* 输入框 */
    .el-input {
      height: 60px;
      .el-input__wrapper {
        border-radius: 15px;
        .el-input__inner {
          font-family: 'Montserrat';
          font-size: 18px;
        }
      }
    }

    /* 汇率兑换 */
    ul li {
      padding: 5px 10px;
    }
  }
}
</style>
