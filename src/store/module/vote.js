import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { ethers } from 'ethers' // ES6 or TypeScript
import { voteAbi } from '@/abi/voteABI.js'
import { useAccountStore } from './accounts'

export const useVoteStore = defineStore('voteStore', () => {
  //账号
  const accountStore = useAccountStore()
  const { netWorke } = storeToRefs(accountStore)

  const voteItem = ref() //节点详情
  // 投票合约地址
  const voteContractAddress = ref('0x574C255649719Fd05d6dd18A1B1d1aCd26e6620e') //f02815185

  // 投票合约
  const getVoteContract = () => {
    const providerWEB = new ethers.providers.JsonRpcProvider(
      accountStore.netWorke
    )
    // 签名者对象
    const signer = providerWEB.getSigner()

    // 质押合约实例
    const contractVote = new ethers.Contract(
      voteContractAddress.value,
      voteAbi,
      signer
    )

    return contractVote
  }

  return {
    voteItem,
    getVoteContract,
    voteContractAddress
  }
})
