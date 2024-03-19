import { defineStore, storeToRefs } from 'pinia'
import { formatAmount } from '@/utils/formatAmount.js'
import { ref } from 'vue'

export const useBuffStore = defineStore('buffStore', () => {
  const actorInfo = ref() //被点项节点信息
  const departObj = ref() //离职信息

  const clearSet = () => {
    actorInfo.value = ''
    departObj.value = ''
  }

  return {
    actorInfo,
    departObj,
    clearSet
  }
})
