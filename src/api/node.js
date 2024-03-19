import service from '@/utils/request.js'

// 获取节点操作信息列表
export const nodeRecordList = params => {
  return service({
    url: 'nodeRecord/nodeRecordList',
    methods: 'get',
    params
  })
}
// 获取节点还款/借款信息
export const getNodeRepayInfo = params => {
  return service({
    url: 'sysNodeInfo/getNodeRepayInfo',
    methods: 'get',
    params
  })
}

// 获取节点提现信息
export const getNodeWithdrawInfo = params => {
  return service({
    url: 'sysNodeInfo/getNodeWithdrawInfo',
    methods: 'get',
    params
  })
}

// 获取节点数据信息
export const getNodeDataInfo = params => {
  return service({
    url: 'sysNodeInfo/getNodeDataInfo',
    methods: 'get',
    params
  })
}

//获取节点列表
export const getNodeInfoList = params => {
  return service({
    url: 'sysNodeInfo/getNodeInfoList',
    methods: 'get',
    params
  })
}

// 获取可用流动资产
export const getAvailableAssets = params => {
  return service({
    url: 'sysNodeInfo/getAvailableAssets',
    methods: 'get',
    params
  })
}

// 将节点转 0x地址
export const getNodeAddress = params => {
  return service({
    url: 'sysNodeInfo/getNodeAddress',
    methods: 'get',
    params
  })
}
