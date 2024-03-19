import { defineStore, storeToRefs } from 'pinia'
import { ethers } from 'ethers' // ES6 or TypeScript
import { ref } from 'vue'
import { loanAbi } from '@/abi/loanABI.js'
import { useAccountStore } from './accounts'

export const useLoanContractStore = defineStore('loanContractStore', () => {
  //账号
  const accountStore = useAccountStore()
  const { account, keyId, balance, netWorke } = storeToRefs(accountStore)

  // 借贷合约地址
  const loanContractAddress = ref('0xC1eb96eEc5B4c75A64f5DE36849c5f9E0B240294') //f02815179

  // 获取借贷合约
  const getLoanContract = val => {
    if (!accountStore.account || val == 1) {
      // 连接以太坊: MetaMask
      const providerWEB = new ethers.providers.JsonRpcProvider(
        accountStore.netWorke
      )
      const testKey = accountStore.keyId
      const wallet = new ethers.Wallet(testKey, providerWEB)

      // 质押合约实例
      const contractLOAN = new ethers.Contract(
        loanContractAddress.value,
        loanAbi,
        wallet
      )

      return contractLOAN
    } else if (val == 2) {
      // 连接以太坊: MetaMask
      const providerWEB = new ethers.providers.Web3Provider(window.ethereum)

      // 签名者对象
      const signer = providerWEB.getSigner()

      // 质押合约实例
      const contractLOAN = new ethers.Contract(
        loanContractAddress.value,
        loanAbi,
        signer
      )

      return contractLOAN
    }
  }

  return {
    loanContractAddress,
    getLoanContract
  }
})
