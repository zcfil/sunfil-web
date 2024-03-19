import service from '@/utils/request.js'

// 通知后台刷新票数
export const contractWarnNode = params => {
  return service({
    url: 'liquidate/contractWarnNode',
    methods: 'get',
    params
  })
}
