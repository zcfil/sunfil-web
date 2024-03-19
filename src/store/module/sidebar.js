import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { getTotalFilSide } from '@/api/home.js'
import { useRateContractStore } from './rateContract.js'
import { useStakeContractStore } from './stakeContract'
import { useDebtContractStore } from './debtContract'

export const useSidebarStore = defineStore('sidebar', () => {
  // 使用仓库-利率
  const rateContractStore = useRateContractStore()
  const { getRateContract } = storeToRefs(rateContractStore)
  // 债务
  const debtContractStore = useDebtContractStore()
  const { getDebtContract } = storeToRefs(debtContractStore)
  //质押
  const stakeContractStore = useStakeContractStore()
  const { getStakeContract } = storeToRefs(stakeContractStore)

  const isRefresh = ref(false) //用于判断交易是否成功,成功则刷新侧边栏数据

  const form = ref({
    stakeAPY: '', //	是	string	质押的利率，rate合约 getDepositRate()
    loanAPY: '', //	是	string	借贷的利率，rate合约 getLoanRate()
    financeUseRate: '', //	是	string	币池利用率，rate合约 getPoolUseRate()
    totalBalance: '', //	是	string	池子总量 ，debt合约的 getTotalFilBalance()
    lastAvailableBalance: '', //	是	string	可用流动资产，stake合约的 getContractAmount()
    stakeNum: '', //	是	string	质押人数，stake合约的 getStakeAddressNum()
    riskCoefficient: '', //	是	string	风险储备系数，rate合约 riskCoefficient()
    businessCoefficient: '' //	是	string	运营储备系数，rate合约 omCoefficient()
  })

  const rateData = ref({
    stakeAPY: 0, // 质押利率
    loanAPY: 0, //借贷利率
    financeUseRate: 0, // 资金利用率
    totalBalance: 0, // 池子Fil总量
    filValue: 0, // fil币价值
    totalBalanceValue: 0, // 池子Fil总价值
    totalLockValue: 0, // 池子锁定的总价值
    lastAvailableBalance: 0, // 剩余可用流动资产
    stakeNum: 0, // 质押人数
    nodeNum: 0, // 节点数
    businessCoefficient: 0, // 运营储备系数
    riskCoefficient: 0 // 风险储备系数
  }) //侧边栏数据

  // 获取参数
  const getForm = async () => {
    let rateContract = await rateContractStore.getRateContract()
    let debtContract = await debtContractStore.getDebtContract()
    let stakeContract = await stakeContractStore.getStakeContract(1)

    let stakeAPY = await rateContract.getDepositRate()
    let loanAPY = await rateContract.getLoanRate()
    let financeUseRate = await rateContract.getPoolUseRate()
    let riskCoefficient = await rateContract.riskCoefficient()
    let businessCoefficient = await rateContract.omCoefficient()

    let totalBalance = await debtContract.getTotalFilBalance()

    let lastAvailableBalance = await stakeContract.getContractAmount()
    let stakeNum = await stakeContract.getStakeAddressNum()

    form.value = {
      stakeAPY: stakeAPY.toString(),
      loanAPY: loanAPY.toString(),
      financeUseRate: financeUseRate.toString(),
      totalBalance: totalBalance.toString(),
      lastAvailableBalance: lastAvailableBalance.toString(),
      stakeNum: stakeNum.toString(),
      riskCoefficient: riskCoefficient.toString(),
      businessCoefficient: businessCoefficient.toString()
    }
  }

  //获取侧边栏数据
  const getTotalFilSideInfo = async () => {
    const res = await getTotalFilSide()

    rateData.value = res.data
    return res.data
  }

  // 定时器30秒刷新一次
  const time = ref()
  time.value = setInterval(async () => {
    getTotalFilSideInfo()
  }, 30000)

  return {
    isRefresh,
    getTotalFilSideInfo,
    rateData
  }
})
