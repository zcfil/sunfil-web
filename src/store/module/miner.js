import { defineStore, storeToRefs } from 'pinia'
import { formatAmount } from '@/utils/formatAmount.js'
import { ref } from 'vue'
import Web3 from 'web3'
import { ownerParams } from '@/utils/arraybufferToBase64.js'
import { toFixedNum } from '@/utils/num.js'

export const useMinerStore = defineStore('minerStore', () => {
  const minerObj = ref() //节点查询信息
  const checkInBool = ref(false) //辨别节点上下操作
  const nodeDebt = ref(false) //节点是否欠费
  const linkHref = ref('https://filfox.info/zh/message/') //用于跳转区块浏览器
  const linkNet = ref('http://103.44.239.241:50002/rpc/v1') //web3实例化网络
  const linkNetTest = ref('https://api.calibration.node.glif.io/rpc/v1') //web3实例化网络
  const minerGasCidObj = ref()
  const operatorObj = ref() //设置操作人之后重新获取参数
  const motionInfo = ref() //多签提案信息
  const role = ref(3) //判断在职身份 1owner 2受益人 3不在职
  // 用于生成入职签名参数,跟 Params值  minerEnterContractId2对应
  const contractObj = ref({
    To: '', //当前需要入职的节点
    Value: '0',
    Method: 23,
    Params: '' //合约地址编码 后端提供
  })

  const minerEnterContractId2 = ref('f02815173') //   sunPond

  //  节点入职后地址 sunPond节点地址
  const contractId2Address = ref('f410f6c5cqqbzj4bocqdkfjb3z4i5b3amr6bq6eytlby')

  const minerEnterContractId = ref('f02815178') //入职合约 manageNode

  const method = ref(3844450837) //合约方法

  // 生成合约参数
  const contractObjParams = () => {
    contractObj.value.Params = ownerParams(minerEnterContractId2.value)
  }

  // 余额单位转换
  const transformWei = () => {
    if (
      minerObj.value !== 'undefined' &&
      minerObj.value !== '' &&
      minerObj.value !== null
    ) {
      const web3 = new Web3(window.ethereum)

      // 节点总余额
      minerObj.value.balance = web3.utils.fromWei(
        minerObj.value.balance.toString(),
        'ether'
      )

      // 可用余额
      minerObj.value.available = web3.utils.fromWei(
        minerObj.value.available.toString(),
        'ether'
      )

      // 最大可借
      minerObj.value.borrowableAmount = web3.utils.fromWei(
        minerObj.value.borrowableAmount.toString(),
        'ether'
      )

      //  金额千分位分割并保留5位小数
      minerObj.value.balance2 = formatAmount(
        Number(minerObj.value.balance.match(/^\d+(?:\.\d{0,5})?/))
      )

      if (minerObj.value.available >= 0) {
        minerObj.value.available2 = formatAmount(
          Number(minerObj.value.available.match(/^\d+(?:\.\d{0,5})?/))
        )
      } else {
        minerObj.value.available2 = toFixedNum(minerObj.value.available, 5)
      }
    }
  }

  // 判断是否在职入职身份
  const judgeIsEnter = info => {
    let judgeIsEnter = ''
    if (
      info.owner.substr(1) == contractId2Address.value.substr(1) ||
      info.owner.substr(1) == minerEnterContractId2.value.substr(1) ||
      info.beneficiary.substr(1) == contractId2Address.value.substr(1) ||
      info.beneficiary.substr(1) == minerEnterContractId2.value.substr(1)
    ) {
      isEnterRole.value = true // 代表已入职
      judgeIsEnter = true
    } else {
      isEnterRole.value = false
      judgeIsEnter = false
    }

    return judgeIsEnter
  }

  // 判断在职身份 1owner 2受益人 3不在职
  const judgeRole = info => {
    let nodeRole = ''

    if (
      info.owner.substr(1) == contractId2Address.value.substr(1) ||
      info.owner.substr(1) == minerEnterContractId2.value.substr(1)
    ) {
      // owner
      nodeRole = 1
    } else if (
      info.beneficiary.substr(1) == contractId2Address.value.substr(1) ||
      info.beneficiary.substr(1) == minerEnterContractId2.value.substr(1)
    ) {
      // 受益人
      nodeRole = 2
    } else {
      // 不在职
      nodeRole = 3
    }

    role.value = nodeRole
    return nodeRole
  }

  // 判断单签/多签  在职用老owner判断 不在职用owner判断
  const judgeMode = info => {
    let mode = ''

    // 当owner钱包地址和id一样时为多签
    if (info.oldOwner) {
      if (
        info.oldOwner.slice(0, 2) == 'f0' ||
        info.oldOwner.slice(0, 2) == 't0'
      ) {
        mode = 'more'
      } else {
        mode = 'single'
      }
    } else {
      if (
        info.owner == info.ownerId ||
        info.owner.slice(0, 2) == 'f0' ||
        info.owner.slice(0, 2) == 't0'
      ) {
        mode = 'more'
      } else {
        mode = 'single'
      }
    }

    return mode
  }

  //判断owner地址和受益人地址是否一致
  const judgeAddress = minerObj => {
    let bool = ''
    if (minerObj.mortgageType == 0 && minerObj.owner == minerObj.beneficiary) {
      bool = true
    } else {
      bool = false
    }
    return bool
  }

  // 清空信息
  const clearData = () => {
    minerObj.value = ''
    minerGasCidObj.value = ''
    minerGasCidObj.value = ''
    operatorObj.value = ''

    contractObj.value.To = ''
  }

  return {
    minerObj,
    minerGasCidObj,
    operatorObj,
    transformWei,
    minerEnterContractId,
    minerEnterContractId2,
    method,
    role,
    motionInfo,
    contractObj,
    clearData,
    contractId2Address,
    judgeIsEnter,
    judgeRole,
    judgeMode,
    contractObjParams,
    checkInBool,
    linkHref,
    linkNet,
    linkNetTest,
    nodeDebt,
    judgeAddress
  }
})
