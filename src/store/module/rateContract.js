import { defineStore, storeToRefs } from 'pinia'
import { ethers } from 'ethers' // ES6 or TypeScript
import { ref } from 'vue'
import { rateAbi } from '@/abi/rateABI.js'
import { useStakeContractStore } from './stakeContract'
import { useDebtContractStore } from './debtContract'
import { useManageNodeContractStore } from './manageNodeContract'
import { useAccountStore } from './accounts'
import { toFixedNum } from '@/utils/num.js'
import {
  getAvailableAssets,
  getNodeInfoList,
  getNodeWithdrawInfo,
  getNodeDataInfo,
  getNodeAddress
} from '@/api/node.js'
import {
  getFinanceUseRate,
  getDebtInfoList,
  getTotalityChange,
  getStakeInfoList,
  getTotalFilList,
  getTotalRateSide,
  getLoanRateSide,
  getStackRateSide
} from '@/api/home.js'

export const useRateContractStore = defineStore('rateContractStore', () => {
  // 债务
  const debtContractStore = useDebtContractStore()
  const { getDebtContract } = storeToRefs(debtContractStore)
  //质押
  const stakeContractStore = useStakeContractStore()
  const { getStakeContract } = storeToRefs(stakeContractStore)
  //管理
  const manageNodeContractStore = useManageNodeContractStore()
  const { getManageNodeContract } = storeToRefs(manageNodeContractStore)
  //账号
  const accountStore = useAccountStore()
  const { getDataAccount, getBalance, account, keyId, netWorke } =
    storeToRefs(accountStore)

  // 利率合约地址
  const rateContractAddress = ref('0x2811aaa47902C87c04072921711dbe00f5445422') //f02828429

  // 获取利率合约
  const getRateContract = () => {
    // 连接以太坊: MetaMask
    const providerWEB = new ethers.providers.JsonRpcProvider(
      accountStore.netWorke
    )

    const testKey = accountStore.keyId
    const wallet = new ethers.Wallet(testKey, providerWEB)

    // 质押合约实例
    const contractRate = new ethers.Contract(
      rateContractAddress.value,
      rateAbi,
      wallet
    )
    return contractRate
  }

  // 总利率
  const form = ref({
    stakeAPY: '', //	是	string	质押的利率，rate合约 getDepositRate()
    loanAPY: '', //	是	string	借贷的利率，rate合约 getLoanRate()
    financeUseRate: '' //	是	string	资金利用率，rate合约 getPoolUseRate()
  })
  // 借贷
  const form2 = ref({
    loanAPY: '', //	是	string	质押的利率，rate合约 getDepositRate()
    totalLoan: '', //	是	string	借贷总额，debt合约 totalSupply()
    remainFil: '' //	是	string	剩余资金，stake合约 getContractAmount()
  })
  // 质押
  const form3 = ref({
    stakeAPY: '', //是	string	质押的利率，rate合约 getDepositRate()
    totalStake: '' //是	string	借贷的利率，stake合约 totalSupply()
  })

  // 总池折线
  const form4 = ref({
    timeInterval: '', //	否	string	时间间隔标识 1d 1天, 7d 7天, 1m 1个月, 3m 3个月
    totalBalance: '' //	否	string	池子总量, debt合约 getTotalFilBalance()
  })

  // 质押总质押折线
  const form5 = ref({
    timeInterval: '', //	否	string	时间间隔标识 1d 1天, 7d 7天, 1m 1个月, 3m 3个月
    stakeAPY: '', //	是	string	质押的利率，rate合约 getDepositRate()
    totalStake: '' //	是	string	借贷的利率，stake合约 totalSupply()
  })

  // 资金，借款，质押折线
  const form6 = ref({
    timeInterval: '', //	否	string	时间间隔标识 1d 1天, 7d 7天, 1m 1个月, 3m 3个月
    stakeAPY: '', //	是	string	质押的利率，rate合约 getDepositRate()
    loanAPY: '', //	是	string	借贷的利率，rate合约 getLoanRate()
    financeUseRate: '' //	是	string	资金利用率，rate合约 getPoolUseRate()
  })

  // 借贷和借贷总额折线
  const form7 = ref({
    timeInterval: '', //	否	string	时间间隔标识 1d 1天, 7d 7天, 1m 1个月, 3m 3个月
    loanAPY: '', //	是	string	质押的利率，rate合约 getDepositRate()
    totalLoan: '' //	是	string	借贷总额，debt合约 totalSupply()
  })

  // 资金利用率
  const form8 = ref({
    financeUseRate: '' //	是	string	资金利用率，rate合约 getPoolUseRate()
  })

  const form9 = ref({
    lastAvailableBalance: '' //是	string	可用流动资产，stake合约 getContractAmount()
  })
  // 节点详情
  const form10 = ref({
    nodeId: '', //否	string	节点id, 如节点为t032219, 传值t032219即可
    operator: '', //否	string	当前小狐狸地址, 未连接则传空,用以确定有哪个节点是和小狐狸绑定的
    nodeDebt: '', //是	string	节点债务，debtValue：debt合约，balanceOf(address) 获取节点债务 其中的address地址需要先将节点地址转为ETH才能使用,结果记得除以10的18次方使用,保留2位小数
    maxDebtRate: '', //是	string	最大债务比，清算阈值: rate合约, getRateContractParam(uint256) uint64为对应节点,例如节点为f0123456,传参即为123456,返回为结构体,所需要的是第一个值maxDebtRatio 最大债务比,第二个值settlementThreshold 清算阈值, 除以10的18次方展示
    liquidateRate: '', //是	string	最大债务比，清算阈值: rate合约, getRateContractParam(uint256) uint64为对应节点,例如节点为f0123456,传参即为123456,返回为结构体,所需要的是第一个值maxDebtRatio 最大债务比,第二个值liquidateRate 清算阈值, 除以10的18次方展示
    maxWithdrawLimit: '' //是	string	借助go后端接口 sysNodeInfo/getNodeWithdrawInfo 获取
  })

  // 合约
  const rateContract = ref()
  const debtContract = ref()
  const stakeContract = ref()
  const manageNodeContract = ref()

  // 生成合约
  const getContract = async () => {
    rateContract.value = await getRateContract()
    debtContract.value = await debtContractStore.getDebtContract()
    stakeContract.value = await stakeContractStore.getStakeContract(1)
    manageNodeContract.value =
      await manageNodeContractStore.getManageNodeContract()
  }
  getContract()

  const maxWithdrawBalance = ref() //最大提现阈值

  // 把节点转 0x 地址
  const getNodeAddressFn = async nodeId => {
    let nodeAddress = await getNodeAddress({
      nodeId
    })
    return nodeAddress
  }

  // 获取总利率数据参数
  const getForm = async (val, time = '1d', nodeId, operator) => {
    switch (val) {
      case 1:
        let stakeAPY = await rateContract.value.getDepositRate()
        let loanAPY = await rateContract.value.getLoanRate()
        let financeUseRate = await rateContract.value.getPoolUseRate()

        form.value = {
          stakeAPY: stakeAPY.toString(),
          loanAPY: loanAPY.toString(),
          financeUseRate: financeUseRate.toString()
        }
        break
      case 2:
        let loanAPY2 = await rateContract.value.getDepositRate()
        let totalLoan2 = await debtContract.value.totalSupply()
        let remainFil2 = await stakeContract.value.getContractAmount()
        form2.value = {
          loanAPY: loanAPY2.toString(),
          totalLoan: totalLoan2.toString(),
          remainFil: remainFil2.toString()
        }

        break
      case 3:
        let stakeAPY3 = await rateContract.value.getDepositRate()
        let totalStake3 = await stakeContract.value.totalSupply()

        form3.value = {
          stakeAPY: stakeAPY3.toString(),
          totalStake: totalStake3.toString()
        }

        break
      case 4:
        let totalBalance4 = await debtContract.value.getTotalFilBalance()

        form4.value = {
          timeInterval: time,
          totalBalance: totalBalance4.toString()
        }

        break
      case 5:
        let stakeAPY5 = await rateContract.value.getDepositRate()
        let totalStake5 = await stakeContract.value.totalSupply()

        form5.value = {
          timeInterval: time,
          stakeAPY: stakeAPY5.toString(),
          totalStake: totalStake5.toString()
        }

        break
      case 6:
        let stakeAPY6 = await rateContract.value.getDepositRate()
        let loanAPY6 = await rateContract.value.getLoanRate()
        let financeUseRate6 = await rateContract.value.getPoolUseRate()

        form6.value = {
          timeInterval: time,
          stakeAPY: stakeAPY6.toString(),
          loanAPY: loanAPY6.toString(),
          financeUseRate: financeUseRate6.toString()
        }

        break
      case 7:
        let loanAPY7 = await rateContract.value.getLoanRate()
        let totalLoan7 = await debtContract.value.totalSupply()

        form7.value = {
          timeInterval: time,
          loanAPY: loanAPY7.toString(),
          totalLoan: totalLoan7.toString()
        }
        break
      case 8:
        let financeUseRate8 = await rateContract.value.getPoolUseRate()

        form8.value = {
          financeUseRate: financeUseRate8.toString()
        }
        break
      case 9:
        let lastAvailableBalance9 =
          await stakeContract.value.getContractAmount()

        form9.value = {
          lastAvailableBalance: lastAvailableBalance9.toString()
        }
        break
      case 10:
        let maxWithdrawLimit10 = await getNodeWithdrawInfo({ nodeId })
        maxWithdrawBalance.value = maxWithdrawLimit10.data.maxWithdrawBalance

        // 转 0x 地址
        let nodeAddress = await getNodeAddressFn(nodeId)

        let nodeDebt10 = await debtContract.value.balanceOf(
          nodeAddress.data.ethAddr
        )

        form10.value = {
          nodeId: nodeId,
          operator: operator,
          nodeDebt: nodeDebt10.toString(),
          maxWithdrawLimit: maxWithdrawLimit10.data.maxWithdrawBalance
        }

        break
    }
  }

  // 获取总利率数据
  const getTotalRateData = async () => {
    const res = await getTotalRateSide()

    return res.data
  }

  // 获取借贷数据
  const getLoanRateData = async () => {
    const res = await getLoanRateSide()

    return res.data
  }

  // 获取质押数据
  const getStackRateData = async () => {
    const res = await getStackRateSide()
    return res.data
  }

  // 获取总池子折线
  const getTotalFilData = async (time = '1d') => {
    const res = await getTotalFilList({
      timeInterval: time
    })
    return res.data
  }

  // 获取质押总质押折线
  const getStakeInfoData = async (time = '1d') => {
    const res = await getStakeInfoList({
      timeInterval: time
    })
    return res.data
  }

  // 获取资金。借款，质押折现
  const getTotalityData = async (time = '1d') => {
    const res = await getTotalityChange({
      timeInterval: time
    })
    return res.data
  }

  // 获取借贷与借贷总额折线
  const getDebtInfoData = async (time = '1d') => {
    const res = await getDebtInfoList({
      timeInterval: time
    })

    return res.data
  }

  // 获取资金利用率
  const getFinanceUseRateData = async () => {
    await getForm(8)
    const res = await getFinanceUseRate(form8.value)
    return res
  }

  // 获取可用流动资产
  const getAvailableAssetsData = async () => {
    await getForm(9)
    const res = await getAvailableAssets(form9.value)
    return res
  }

  // 获取节点列表
  const getNodeInfoListData = async (form, nodeId) => {
    // 获取节点信息
    const res = await getNodeInfoList(formObj)

    if (res.data.list) {
      for (let index = 0; index < res.data.list.length; index++) {
        let obj = await rateContract.value.getRateContractParam(
          res.data.list[index].nodeId.substr(2)
        )

        // 最大债务比
        res.data.list[index].maxDebtRatio = ethers.utils.formatEther(obj[0])
        // 清算阈值
        res.data.list[index].settlementThreshold = ethers.utils.formatEther(
          obj[1]
        )

        // 转 0x 地址
        let nodeAddress = await getNodeAddressFn(res.data.list[index].nodeId)

        // 获取节点债务
        let debtValue = await debtContract.value.balanceOf(
          nodeAddress.data.ethAddr
        )
        res.data.list[index].debtValue = toFixedNum(
          ethers.utils.formatEther(debtValue),
          2
        )

        //节点所有权额度
        res.data.list[index].nodeOwnershipBalance = toFixedNum(
          res.data.list[index].nodeTotalBalance -
            res.data.list[index].debtValue,
          2
        )

        if (res.data.list[index].debtValue > 0) {
          //  当前债务比率
          res.data.list[index].debtRatio = toFixedNum(
            res.data.list[index].debtValue /
              res.data.list[index].nodeTotalBalance,
            4
          )
        }
      }
    }

    return res
  }

  // 获取节点详情
  const getNodeInfoData = async (nodeId, operator) => {
    let operatorAddr = operator
    if (!operatorAddr) {
      operatorAddr = accountStore.getDataAccount
    }

    let balance = await checkBalance(operatorAddr)

    if (balance <= 0) {
      operatorAddr = accountStore.getDataAccount
    }

    await getForm(10, '', nodeId, operatorAddr)
    const res = await getNodeDataInfo(form10.value)

    return res
  }

  // 获取节点卡片还款信息
  const getMinerData = async (val, nodeId) => {
    let nodeAddress = await getNodeAddressFn(nodeId)

    switch (val) {
      case 1:
        //还款信息
        let obj = {
          data: {
            outstandingDebt: '', // 待偿还借贷额度
            maxLoanLimit: '' // 最大借贷金额
          }
        }

        let outstandingDebt = await debtContract.value.balanceOf(
          nodeAddress.data.ethAddr
        )

        let maxLoanLimit = await rateContract.value.getMaxBorrowableAmount(
          nodeId.substr(2)
        )

        obj.data = {
          outstandingDebt: outstandingDebt.toString(), // 待偿还借贷额度
          maxLoanLimit: maxLoanLimit.toString() // 最大借贷金额
        }

        return obj
        break
      case 2:
        // 节点提现

        let obj2 = {
          data: {
            maxWithdrawBalance: '', // 最大可提现余额
            payee: '' // 收款人
          }
        }

        let payee = await manageNodeContract.value.getMinersByActorId(
          nodeId.substr(2)
        )

        obj2.data = {
          maxWithdrawBalance: maxWithdrawBalance.value, // 最大可提现余额
          payee: 'f0' + payee.ownerId.toNumber() // 收款人
        }

        return obj2

        break
    }
  }
  const checkBalance = async operator => {
    let balance = await accountStore.getBalance(operator)
    return balance
  }

  return {
    rateContractAddress,
    getRateContract,
    getTotalRateData,
    getLoanRateData,
    getStackRateData,
    getTotalFilData,
    getStakeInfoData,
    getTotalityData,
    getDebtInfoData,
    getFinanceUseRateData,
    getAvailableAssetsData,
    getNodeInfoListData,
    getNodeInfoData,
    getMinerData,
    checkBalance
  }
})
