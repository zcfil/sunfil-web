<template>
  <div id="Header" class="container-fluid">
    <!-- 电脑导航 -->
    <div class="header-nav container">
      <div class="topNav">
        <!-- 导航logo -->
        <div class="header-nav-logo logoBox">
          <a href="/HomePage" class="aLink">
            <img src="@/assets/img/logo.png" alt="logo" />
            <span class="logoTxt">LOGO</span>
          </a>
        </div>

        <!-- 电脑导航内容 -->
        <div class="d-none d-sm-none d-md-none d-lg-block navBox">
          <ul class="header-nav-wrapper navItem">
            <li
              v-for="(item, index) in navList"
              :key="index"
              :class="index == navIndex ? 'active' : ''"
              @click="clickNav(index, item.name)"
            >
              <router-link :to="item.path">
                <SvgIcon style="width: 20px; height: 20px" :name="item.svg" />
                <span> {{ $t(item.name) }}</span>
              </router-link>
            </li>
            <div class="mask"></div>
          </ul>
        </div>

        <!-- 手机导航内容 -->
        <div class="btnBox">
          <div class="d-block d-sm-block d-md-block d-lg-none phone">
            <el-dropdown trigger="hover">
              <SvgIcon
                style="
                  width: 25px;
                  height: 25px;
                  cursor: pointer;
                  margin-top: 3px;
                "
                name="more"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, index) in navList"
                    :key="index"
                    :class="index == navIndex ? 'active' : ''"
                    @click="clickNav(index, item.name)"
                  >
                    <router-link :to="item.path">
                      <SvgIcon
                        style="width: 20px; height: 20px; margin-bottom: 5px"
                        :name="item.svg"
                      />
                      <span style="margin-left: 3px"> {{ $t(item.name) }}</span>
                    </router-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div>
            <!-- 连接按钮 -->
            <el-button v-if="!address" class="linkBtn" @click="clickLink">
              Connect Wallet
            </el-button>

            <!-- 连接成功后按钮 -->
            <el-button v-else class="ok" @click="clickLinkSuccess">
              <span class="address">
                {{ address }}
              </span>
              <SvgIcon name="lock" />
            </el-button>
          </div>
        </div>
      </div>

      <!-- 钱包类型弹框 -->
      <el-dialog
        class="linkDialog"
        :model-value="showType"
        @close="close(1)"
        width="350px"
      >
        <!-- 登录弹框标题 -->
        <template #header>
          <div>{{ $t('STAKE_Started') }}</div>
        </template>

        <ul>
          <li
            @click="clickType(index)"
            v-for="(item, index) in metaArr"
            :key="index"
            :class="{ active: metaTypeIndex == index }"
          >
            <SvgIcon :name="item.icon" style="width: 35px; height: 35px" />
            <span> {{ item.label }}</span>
          </li>
        </ul>

        <!-- 连接按钮 -->
        <template #footer>
          <div>
            <el-button :disabled="disabledConnectBtn" @click="clickConnect">{{
              $t('STAKE_CONNECT2')
            }}</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 连接成功弹框 -->
      <el-dialog
        class="okDialog"
        :model-value="showWallet"
        @close="close(2)"
        width="350px"
      >
        <template #header>
          <div>{{ $t('STAKE_WALLET') }}</div>
        </template>

        <ul>
          <li>
            <div class="circle">
              <SvgIcon name="fox" />
            </div>

            <div>
              <div id="copyCode">{{ address }}</div>
              <div @click="clickCopy" class="copy">Copy</div>
            </div>
          </li>
        </ul>

        <!-- 断开连接 -->
        <template #footer>
          <div style="text-align: center">
            <el-button link @click="clickRelieve">{{
              $t('STAKE_Disconnect')
            }}</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 网络切换后弹框 -->
      <el-dialog
        class="okDialog"
        :model-value="showSwitchNetDialog"
        width="350px"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <template #header>
          <div>{{ $t('connectTxt') }}</div>
        </template>

        <template #footer>
          <div style="text-align: center">
            <el-button link @click="clickSwitchNetworke">{{
              $t('connect_switch')
            }}</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { checkMetaMaskDownload } from '@/utils/metamask.js'
import ChainConfig from '@/utils/chainConfig.js' //网络包
import { ElMessage, ElNotification } from 'element-plus'
import Web3 from 'web3'
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAccountStore } from '@/store/module/accounts.js' //账户信息store
import { useStakeContractStore } from '@/store/module/stakeContract.js' //质押合约store
import { useMinerStore } from '@/store/module/miner.js'
import { useRateContractStore } from '@/store/module/rateContract'
import { useRouter } from 'vue-router' //路由

const router = useRouter() //使用路由

//  以太坊错误: 4001请求被用户拒绝  -32602 参数无效  -32603 内部错误

// 检测网络是否连接成功
const test = async () => {
  const web3 = new Web3('https://api.node.glif.io')
  web3.eth.net
    .isListening()
    .then(() => console.log('连接成功'))
    .catch(err => console.log('连接失败', err))

  // 获取当前的网络 ID.
  web3.eth.net.getId().then(res => {
    console.log(res)
  })
}

// 使用pinia仓
const accountStore = useAccountStore()
const {
  isConnected,
  account,
  showType,
  navIndex,
  accountIsNoConnect,
  disconnect
} = storeToRefs(accountStore) // 使用storeToRefs可以保证解构出来的数据也是响应式的
const minerStore = useMinerStore()
const { contractObjParams } = storeToRefs(useMinerStore)
const stakeContractStore = useStakeContractStore()
const { linkStakeContract, getAccountData, getStakeContract } =
  storeToRefs(stakeContractStore)
// 利率仓
const rateContractStore = useRateContractStore()
const { getNodeInfoData } = storeToRefs(rateContractStore)

// 初始化钩子
onMounted(async () => {
  accountStore.navIndex = 0
  if (window.ethereum && window.ethereum.isMetaMask) {
    address.value = localStorage.getItem('address') // 读取地址
    if (!localStorage.getItem('disconnect')) {
      localStorage.setItem('disconnect', true)
    } else {
      accountStore.disconnect = JSON.parse(localStorage.getItem('disconnect'))
    }

    minerStore.contractObjParams() //生成合约参数params
    getChainId() //获取链id
    chainChangedFn()
    getAccount() // 获取账号数据
    accountsChangedFn() // 监听账号切换

    test()
  } else {
    console.log('Please install MetaMask!')
  }
})

//获取当前链ID
const chainId = ref()
const getChainId = async () => {
  chainId.value = await window.ethereum.request({ method: 'eth_chainId' })
}

// 监听链ID切换
function handleChainChanged (chainId) {
  // 建议刷新页面，因为连接的节点不同了。

  if (
    chainId !== '0x4cb2f' &&
    chainId !== '0x13a' &&
    accountStore.isConnected
  ) {
    showSwitchNetDialog.value = true
    // 断开账号
    accountStore.clearAccountData() //清空仓库账户数据
    if (accountStore.connectMode == 'Mainnet') {
      switchNetworkeFn2()
    } else {
      switchNetworkeFn()
    }
    localStorage.removeItem('address')
    address.value = ''
  } else {
    showSwitchNetDialog.value = false
    //刷新页面
    window.location.reload()
  }
}

//监听链ID切换方法
const chainChangedFn = () => {
  window.ethereum.on('chainChanged', handleChainChanged)
}

// 监听账户更改
const currentAccount = ref(null)
const getAccount = () => {
  window.ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch(err => {
      console.error(err)
    })
}

// 判断用户有没有连接
function handleAccountsChanged (accounts) {
  // 保存当前小狐狸账号
  accountStore.accountIsNoConnect = accounts[0]

  // 退出小狐狸
  if (accounts.length === 0) {
    address.value = '' // 清空地址
    localStorage.removeItem('address') // 清空本地缓存地址
    accountStore.isConnected = false
    accountStore.clearAccountData() //清空仓库账户数据
    disabledConnectBtn.value = false //启用连接按钮

    // 登录小狐狸
  } else if (accounts[0] !== currentAccount.value) {
    currentAccount.value = accounts[0] //切换账户
    accountStore.showType = false // 关闭登录弹框

    // 如果地址信息不为空
    if (address.value) {
      accountStore.getAccountData(accounts[0]) // 账号切换之后信息
      stakeContractStore.getStakeContract() //生成智能合约
      stakeContractStore.getAccountData() //获取余额
      accountStore.isConnected = true // 账户连接
      address.value = accounts[0] // 账号切换之后的地址
      localStorage.address = accounts[0] //修改本地缓存
    } else {
      accountStore.clearAccountData() // 清空pinia
      localStorage.removeItem('address')
    }
  }
}

// 监听账号切换
const accountsChangedFn = () => {
  window.ethereum.on('accountsChanged', handleAccountsChanged)
}

//获取当前小狐狸中账号信息
const address = ref(null) // 钱包地址
const getConnectAccount = async () => {
  const res = await window.ethereum.request({
    method: 'eth_requestAccounts'
  })

  address.value = res[0]

  // 保存到本地
  localStorage.setItem('address', res[0])
}

// 切换网络方法
const switchNetworkeFn = async () => {
  const web3 = new Web3(window.ethereum)
  try {
    // 切换
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: web3.utils.numberToHex(314159) // 目标链ID
        }
      ]
    })
    localStorage.disconnect = true //开启
    accountStore.disconnect = true //确认切换网络
    if (accountStore.isConnected) {
      address.value = currentAccount.value
      localStorage.setItem('address', address.value)
    }

    // 关闭钱包类型弹框
    accountStore.showType = false
  } catch (switchError) {
    // 如果为空，添加
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',

          params: [ChainConfig[314159]]
        })

        // 关闭钱包类型弹框
        accountStore.showType = false

        // 拿到地址
        address.value = currentAccount.value

        localStorage.setItem('address', address.value)
      } catch (addError) {
        //
      }
    } else if (switchError.code === 4001) {
      // 提示网络切换失败
      ElNotification({
        title: 'Error',
        message:
          'Failed to switch networks switch the network in your wallet’s settings.',
        type: 'error',
        duration: 5000 //显示时长
      })
      localStorage.setItem('disconnect', false)
      accountStore.disconnect = false //没有点击切换
      showSwitchNetDialog.value = false
      accountStore.clearAccountData() // 清空pinia
      localStorage.removeItem('address')
      address.value = '' //清空连接地址
    }
  }
}
// 切换主网
const switchNetworkeFn2 = async () => {
  const web3 = new Web3(window.ethereum)
  try {
    // 切换
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: web3.utils.numberToHex(314) // 目标链ID
        }
      ]
    })
    localStorage.disconnect = true //开启
    accountStore.disconnect = true //确认切换网络
    if (accountStore.isConnected) {
      address.value = currentAccount.value
      localStorage.setItem('address', address.value)
    }

    // 关闭钱包类型弹框
    accountStore.showType = false
  } catch (switchError) {
    // 如果为空，添加
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',

          params: [ChainConfig[314]]
        })

        // 关闭钱包类型弹框
        accountStore.showType = false

        // 拿到地址
        address.value = currentAccount.value
        localStorage.setItem('address', address.value)
      } catch (addError) {
        //没有点击添加
      }
    } else if (switchError.code === 4001) {
      // 提示网络切换失败
      ElNotification({
        title: 'Error',
        message:
          'Failed to switch networks switch the network in your wallet’s settings.',
        type: 'error',
        duration: 5000 //显示时长
      })
      localStorage.setItem('disconnect', false)
      accountStore.disconnect = false //没有点击切换
      showSwitchNetDialog.value = false
      accountStore.clearAccountData() // 清空pinia
      localStorage.removeItem('address')
      address.value = '' //清空连接地址
    }
  }
}

// 点击切换网络
const showSwitchNetDialog = ref(false) //控制切换网络弹框显示
const clickSwitchNetworke = () => {
  showSwitchNetDialog.value = false
  if (accountStore.connectMode === 'Mainnet' && accountStore.isConnected) {
    switchNetworkeFn2()
  } else if (
    accountStore.connectMode === 'Calibration' &&
    accountStore.isConnected
  ) {
    switchNetworkeFn()
  }
}

// 监听账号连接和路由
watch(
  () => [
    accountStore.isConnected,
    router.currentRoute,
    accountStore.connectMode,
    accountStore.disconnect
  ],
  ([val1, val2, val3, val4], [old1, old2, old3, old4]) => {
    if (val2) {
      navIndex.value = sessionStorage.getItem('navIndex')
        ? sessionStorage.getItem('navIndex')
        : 0
    }

    if (
      val3 === 'Mainnet' &&
      chainId.value !== '0x13a' &&
      accountStore.isConnected
    ) {
      switchNetworkeFn2()
    } else if (
      val3 === 'Calibration' &&
      chainId.value !== '0x4cb2f' &&
      accountStore.isConnected
    ) {
      switchNetworkeFn()
    }
  },
  //深度监听
  { deep: true }
)

// 导航栏
const navList = ref([
  {
    name: 'nav.menu1',
    path: '/',
    svg: 'home',
    children: []
  },
  {
    name: 'nav.menu2',
    path: '/stake',
    svg: 'stake'
  },
  {
    name: 'nav.menu3',
    path: '/buff',
    svg: 'buff'
  }
])

// 点击切换导航栏
const clickNav = (index, name) => {
  accountStore.navIndex = index
  sessionStorage.setItem('navIndex', index)
}

// 点击连接钱包
// const showType = ref(false) // 钱包类型选择弹框
const clickLink = () => {
  accountStore.showType = true //打开钱包类型弹框
}

// 钱包类型
const metaArr = ref([
  {
    icon: 'fox',
    label: 'Connect your Metamask*'
  }
])
const metaTypeIndex = ref(0)
// 点击类型
const clickType = index => {
  metaTypeIndex.value = index

  disabledConnectBtn.value = false // 限制连接按钮

  checkMetaMaskDownload() //判断是否下载钱包
}

// 确认连接钱包
const disabledConnectBtn = ref(false)
const clickConnect = async () => {
  // 判断是否选中钱包类型以及是否有下载小狐狸
  if (metaTypeIndex.value >= 0 && window.ethereum) {
    if (currentAccount.value) {
      accountStore.isConnected = true
      if (accountStore.connectMode == 'Mainnet') {
        await switchNetworkeFn2() // 判断当前连接的链id是否一样，一样直接登录成功，不一样就提示让用户切换
      } else if (accountStore.connectMode == 'Calibration') {
        switchNetworkeFn() // 判断当前连接的链id是否一样，一样直接登录成功，不一样就提示让用户切换
      }

      accountStore.isConnected = true // 判断账户连接
      accountStore.getAccountData(currentAccount.value) // 获取账户信息
      stakeContractStore.getStakeContract() //生成智能合约
      stakeContractStore.getAccountData() //获取余额
    } else {
      await getConnectAccount() //获取当前账号
      accountStore.showType = false // 关闭类型弹框
      disabledConnectBtn.value = false // 启用
      accountStore.getAccountData(currentAccount.value) // 获取账户余额
      stakeContractStore.getStakeContract() //生成智能合约
      stakeContractStore.getAccountData() //获取余额
      accountStore.isConnected = true // 判断账户连接
    }
  } else if (!window.ethereum) {
    await ElMessage.error('请安装meteMask钱包!')

    setTimeout(() => {
      // 打下载页面
      window.open('https://metamask.io/', '_blank')
    }, 1500)
  }
}

// 点击连接成功后按钮
const showWallet = ref(false) //控制连接成功后的钱包弹框
const clickLinkSuccess = () => {
  showWallet.value = true
}

// 点击断开连接
const clickRelieve = () => {
  showWallet.value = false
  disabledConnectBtn.value = false
  address.value = ''
  localStorage.removeItem('address') // 清空本地缓存
  accountStore.clearAccountData() // 清空仓库
}

// 关闭弹框
const close = num => {
  if (num == 1) {
    accountStore.showType = false
    metaTypeIndex.value = 0
    disabledConnectBtn.value = false
  } else if (num == 2) {
    showWallet.value = false
  }
}

//点击复制
const clickCopy = () => {
  const range = document.createRange() //创建range对象
  range.selectNode(document.getElementById('copyCode')) //获取复制内容的 id 选择器
  const selection = window.getSelection() //创建 selection对象
  if (selection.rangeCount > 0) selection.removeAllRanges() //如果页面已经有选取了的话，会自动删除这个选区，没有选区的话，会把这个选取加入选区
  selection.addRange(range) //将range对象添加到selection选区当中，会高亮文本块
  document.execCommand('copy') //复制选中的文字到剪贴板
  ElMessage.success('复制成功')
  selection.removeRange(range) // 移除选中的元素
}
</script>

<script>
export default {
  name: 'Header'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss'; //引用此混合样式

#Header .container {
  // 遮罩层
  // .mask2{

  // }
  // .mask {
  //   // height: 100%;
  //   width: 140px;
  //   height: 110px;
  //   // border-radius: 50px;
  //   // border: 1px solid #6be585;
  //   background-color: #1a1c26;

  //   // opacity: 0.2;
  //   position: absolute;
  //   top: -25px;
  //   left: 20px;

  //   background: #c4c4c4;
  //   border-radius: 50px;
  //   transform: rotate(90deg);
  // }

  padding: 0;

  // 类型弹框
  ::v-deep .el-dialog.linkDialog {
    background: #191919;
    border-radius: 20px;

    span {
      color: #343434;
      font-weight: 700;
    }

    .el-button {
      background: #7940cf;
      span {
        color: #fff;
      }

      &.is-disabled {
        border: none;
        box-shadow: none;
      }
    }

    .el-dialog__header {
      font-size: 30px;
    }

    ul li {
      padding: 10px;
      background-color: #2b2b2b;
      border-radius: 10px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      span {
        margin-left: 15px;
        color: #e6e6e6;
        font-size: 18px;
      }

      &:hover {
        cursor: pointer;
      }

      &.active {
        border: 1px solid #7139cf;
      }
    }
  }

  // 连接成功弹框
  ::v-deep .el-dialog.okDialog {
    border-radius: 20px;

    // 标题
    .el-dialog__header {
      font-size: 25px;
      color: #7139cf;
      font-weight: 700;
      text-align: center;
    }

    .el-dialog__footer {
      div {
        span {
          font-size: 20px;
          color: #7139cf;
          font-weight: 700;
        }
      }
    }

    ul {
      li {
        width: 300px;
        display: flex;
        align-items: center;

        .circle {
          line-height: 50px;
          text-align: center;
          width: 50px;
          height: 50px;
          border: 1px solid #7139cf;
          border-radius: 50%;

          .svg-icon {
            width: 100%;
            height: 100%;
            scale: 0.7;
            margin-top: -3px;
          }
        }

        div:nth-child(2) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 20px;

          div {
            font-size: 18px;
            font-weight: 700;

            &:first-child {
              width: 160px;
              // word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .copy {
            color: #7139cf;
            cursor: pointer;
          }
        }
      }
    }
  }

  .topNav {
    width: 100%;
    background: $cardBgColor;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 30px 20px;
    font-size: 20px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;

    // logo
    .logoBox a {
      display: flex;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
        margin-right: 15px;
        border-radius: 10px;
      }

      .logoTxt {
        font-weight: 700;
        background: $navColor;
        -webkit-background-clip: text;
        color: transparent;
      }
    }

    // 导航项
    ul {
      display: flex;
      position: relative;
      li {
        margin: 0 40px;
        z-index: 666;
        a {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          span {
            font-weight: 700;
            margin-left: 10px;
            background: $navColor;
            -webkit-background-clip: text;
            color: transparent;
          }
        }

        &.active {
          span {
            background: $bgColor2;
            -webkit-background-clip: text;
            color: transparent;
          }
        }
      }
    }

    // 连接按钮
    .btnBox {
      display: flex;
      align-items: center;

      .el-button {
        width: 120px;
        background: transparent;
        margin-left: 10px;
        border-radius: 8px;
      }

      .linkBtn {
        color: #fff;
        border: 1px solid #fff;
      }

      .ok {
        color: #7139cf;

        .address {
          width: 90px;
          padding-left: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .svg-icon {
          width: 24px;
          height: 24px;
          color: #7139cf;
        }
      }
    }
  }
}

/* 平板 */
@media screen and (min-width: 768px) and (max-width: 996px) {
  .container-fluid {
    padding: 0;
  }
  #Header .container {
    .topNav {
      ul {
        li {
          padding: 0 20px;
        }
      }
    }
  }
}

/* 手机 */
@media screen and (max-width: 767px) {
  .container-fluid {
    padding: 0;
  }
  #Header .container {
    padding: 0;
    .topNav {
      padding: 30px 15px;
      // logo
      .logoBox a {
        img {
          width: 30px;
          height: 30px;
          margin-right: 8px;
          border-radius: 5px;
        }

        .logoTxt {
          font-weight: 700;
          background: $navColor;
          -webkit-background-clip: text;
          color: transparent;
        }
      }
    }

    .btnBox {
      .linkBtn {
        margin-left: 5px;
        color: #fff;
        border: none;
        background: transparent;
        padding: 0px 10px;

        &:hover {
          border: none;
        }
      }
    }
  }

  a {
    color: #000;
  }
  .svg-icon {
    border: none;
    outline: none;
  }
}
</style>
