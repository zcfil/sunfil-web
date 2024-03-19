import service from '@/utils/request.js'

//获取钱包余额
export const getBalance = data => {
  return service({
    url: '/rpc/v1',
    method: 'post',
    data
  })
}
