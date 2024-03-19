import service from '@/utils/request.js'

// 节点清算告警公告
export const warnNodeList = params => {
  return service({
    url: '/liquidate/warnNodeList',
    method: 'get',
    params
  })
}

// 节点详情
export const warnNodeDetail = params => {
  return service({
    url: '/liquidate/warnNodeDetail',
    method: 'get',
    params
  })
}

// 告警节点统计
export const warnNodeCount = params => {
  return service({
    url: '/liquidate/warnNodeCount',
    method: 'get',
    params
  })
}
