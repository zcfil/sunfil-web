import service from '@/utils/request.js'

// 获取 workerId
export const getWorkerId = data => {
  return service({
    url: '/rpc/v1',
    method: 'post',
    data
  })
}
