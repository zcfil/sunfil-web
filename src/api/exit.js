import service from '@/utils/request.js'

// 查询离职节点信息
export const departInfo = params => {
  return service({
    url: '/miner/departInfo',
    method: 'get',
    params
  })
}
