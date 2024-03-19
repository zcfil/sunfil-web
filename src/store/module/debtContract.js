import { defineStore, storeToRefs } from 'pinia'
import { ethers } from 'ethers' // ES6 or TypeScript
import { ref } from 'vue'
import { debtAbi } from '@/abi/debtABI.js'
import { useAccountStore } from './accounts'

export const useDebtContractStore = defineStore('debtContractStore', () => {
  //账号
  const accountStore = useAccountStore()
  const { account, keyId, netWorke } = storeToRefs(accountStore)

  // 债务合约地址
  const debtContractAddress = ref('0x67A6F45F7b180D308f3390Ba14E1F30c26C111B8') //f02815168

  // 获取利率合约
  const getDebtContract = () => {
    // 连接以太坊: MetaMask
    const providerWEB = new ethers.providers.JsonRpcProvider(
      accountStore.netWorke
    )
    const testKey = accountStore.keyId
    const wallet = new ethers.Wallet(testKey, providerWEB)

    // 质押合约实例
    const contractDebt = new ethers.Contract(
      debtContractAddress.value,
      debtAbi,
      wallet
    )
    return contractDebt
  }

  return {
    getDebtContract
  }
})
