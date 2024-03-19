import { defineStore, storeToRefs } from 'pinia'
import { ethers } from 'ethers' // ES6 or TypeScript
import { ref } from 'vue'
import { manageNodeAbi } from '@/abi/manageNodeABI.js'
import { useAccountStore } from './accounts'
export const useManageNodeContractStore = defineStore(
  'manageNodeContractStore',
  () => {
    //账号
    const accountStore = useAccountStore()
    const { keyId, netWorke } = storeToRefs(accountStore)

    // 借贷合约地址
    const manageNodeContractAddress = ref(
      '0xc9c87d6C35E21637ab0B2843B626D2Dbe4EE734d'
    ) //f02815178

    // 获取借贷合约
    const getManageNodeContract = () => {
      // 连接以太坊: MetaMask
      const providerWEB = new ethers.providers.JsonRpcProvider(
        accountStore.netWorke
      )

      const testKey = accountStore.keyId
      const wallet = new ethers.Wallet(testKey, providerWEB)

      // 质押合约实例
      const contractManageNode = new ethers.Contract(
        manageNodeContractAddress.value,
        manageNodeAbi,
        wallet
      )

      return contractManageNode
    }

    return {
      getManageNodeContract
    }
  }
)
