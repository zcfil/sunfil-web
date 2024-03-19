import service from '@/utils/request.js'

//查询节点信息
export const minerMinerInfo = params => {
  return service({
    url: '/miner/minerInfo',
    method: 'get',
    params
  })
}

// 获取owner钱包nonce值
export const filecoinMpoolGetNonce = data => {
  return service({
    url: '/rpc/v1',
    method: 'post',
    data
  })
}

// 获取gas费及CID

export const filecoinGasEstimateMessageGas = data => {
  return service({
    url: '/rpc/v1',
    method: 'post',
    data
  })
}

// 提交签名内容
export const filecoinMpoolPush = data => {
  return service({
    url: '/rpc/v1',
    method: 'post',
    data
  })
}

// 等待消息上链
export const filecoinStateWaitMsg = data => {
  return service({
    url: '/rpc/v1',
    method: 'post',
    data
  })
}

// 将小狐狸地址转成 f4 地址钱包
export const filecoinEthAddressToFilecoinAddress = data => {
  return service({
    url: '/rpc/v1',
    method: 'post',
    data
  })
}

// 检查是否上链
export const filecoinStateLookupID = data => {
  return service({
    url: '/rpc/v1',
    method: 'post',
    data
  })
}

// 获取多签钱包信息
export const minerMsigInspect = params => {
  return service({
    url: '/miner/msigInspect',
    methods: 'get',
    params
  })
}

// 查询原操作人地址
export const pondOperator = params => {
  return service({
    url: '/miner/pondOperator',
    methods: 'get',
    params
  })
}
