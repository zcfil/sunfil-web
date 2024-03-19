import { defineStore, storeToRefs } from 'pinia'
import { ethers } from 'ethers' // ES6 or TypeScript
import { ref } from 'vue'
import { stakeAbi } from '@/abi/stakeABI'
import { useAccountStore } from './accounts' // 账户信息仓库

export const useStakeContractStore = defineStore('stakeData', () => {
  // 使用仓库
  const accountStore = useAccountStore()
  const { account, getBalance, getTokenBalance, keyId, netWorke } =
    storeToRefs(accountStore)

  //质押合约地址
  const stakeContractAddress = ref('0x1a1994ddF4C0c26Ee57823b3Ca2c232F8d268935') //f02815164

  // 获取质押合约
  const getStakeContract = val => {
    if (!accountStore.account || val == 1) {
      // 连接以太坊: MetaMask
      const providerWEB = new ethers.providers.JsonRpcProvider(
        accountStore.netWorke
      )
      const testKey = accountStore.keyId
      const wallet = new ethers.Wallet(testKey, providerWEB)

      // 质押合约实例
      const contractSTAKE = new ethers.Contract(
        stakeContractAddress.value,
        stakeAbi,
        wallet
      )

      return contractSTAKE
    } else if (val == 2) {
      const providerWEB = new ethers.providers.Web3Provider(window.ethereum)

      // 签名者对象
      const signer = providerWEB.getSigner()
      // 质押合约实例
      const contractSTAKE = new ethers.Contract(
        stakeContractAddress.value,
        stakeAbi,
        signer
      )

      return contractSTAKE
    }
  }

  const getAccountData = async () => {
    let contractSTAKE = await getStakeContract(1)
    accountStore.getBalance()
    accountStore.getTokenBalance(contractSTAKE) // 代币余额
  }

  return {
    stakeContractAddress,
    getStakeContract,
    getAccountData
  }
})
