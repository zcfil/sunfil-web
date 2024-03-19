import { defineStore, storeToRefs } from 'pinia'
import { formatAmount } from '@/utils/formatAmount.js'
import { ref } from 'vue'

export const useSetStore = defineStore('setStore', () => {
  const operatorInfo = ref() //节点操作信息
  const controlInfo = ref()

  const clearSet = () => {
    operatorInfo.value = ''
  }

  return {
    operatorInfo,
    controlInfo,
    clearSet
  }
})
