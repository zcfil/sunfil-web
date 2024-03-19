import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ethers } from 'ethers' // ES6 or TypeScript

export const useAccountStore = defineStore(
  'accountStore',
  () => {
    const netWorke = ref('https://api.node.glif.io')
    const providerETH = new ethers.providers.JsonRpcProvider(netWorke.value)
    const getDataAccount = ref('0xb5a1fa73a632827a91b67be02bd23c0838aac764')
    const keyId = ref(
      '7ab74f1c957c61d83ed2804a3b955652c629eceb9a56314b89c20ca8851b2fa0'
    )

    const isConnected = ref(
      localStorage.getItem('isConnected')
        ? localStorage.getItem('isConnected')
        : false
    ) //判断账户是否连接

    const account = ref() //账号
    const accountIsNoConnect = ref() //没连接时候小狐狸当前账号
    const showType = ref(false) //钱包登录弹框
    const balance = ref() //账号余额
    const tokenBalance = ref() //代币余额
    const navIndex = ref(0) //导航栏下标
    const connectMode = ref('Mainnet') //网络模式
    const disconnect = ref(true) //侦听提醒用户切换网路点击确定还是取消

    // 获取账户信息
    const getAccountData = async address => {
      account.value = address // 账户地址
      isConnected.value = true //连接
    }

    // 获取账户余额
    const getBalance = async (operator = account.value) => {
      const balanceValue = await providerETH.getBalance(operator)
      // 将余额从 Wei 转换为 Ether
      balance.value = ethers.utils.formatEther(balanceValue)
    }

    // 获取代币余额
    const getTokenBalance = async stakeContractObj => {
      const sunFIL = await stakeContractObj.balanceOf(account.value)

      // 将代币余额从 Wei 转换为 Ether
      tokenBalance.value = ethers.utils.formatEther(sunFIL)
    }

    // 清空账户信息
    const clearAccountData = () => {
      isConnected.value = false
      account.value = ''
      showType.value = false
      balance.value = ''
      tokenBalance.value = ''
    }

    return {
      isConnected,
      account,
      showType,
      balance,
      tokenBalance,
      getAccountData,
      getBalance,
      getTokenBalance,
      clearAccountData,
      navIndex,
      accountIsNoConnect,
      connectMode,
      disconnect,
      getDataAccount,
      keyId,
      netWorke
    }
  }

  // 数据持久化
  // {
  //   persist: {
  //     key: 'disconnect',
  //     paths: ['disconnect'],

  //     // 指定持久化时所使用的序列化方法,以及恢复 Store 时的反序列化方法
  //     serializer: {
  //       deserialize: 'parse',
  //       serialize: 'stringify'
  //     }
  //   }
  // }
)
