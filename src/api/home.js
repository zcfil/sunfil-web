import service from '../utils/request'

// 获取总池子fil折线列表
export const getTotalFilList = params => {
  return service({
    url: 'lineChart/getTotalFilList',
    method: 'get',
    params
  })
}

// 返回质押利率和质押总额折线列表
export const getStakeInfoList = params => {
  return service({
    url: 'lineChart/getStakeInfoList',
    method: 'get',
    params
  })
}

// 返回资金利用率,借款利率,质押利率列表
export const getTotalityChange = params => {
  return service({
    url: 'lineChart/getTotalityChange',
    method: 'get',
    params
  })
}

// 返回借贷利率和借贷总额折线列表
export const getDebtInfoList = params => {
  return service({
    url: 'lineChart/getDebtInfoList',
    method: 'get',
    params
  })
}

// 获取总池子fil折线列表侧边栏数据
export const getTotalFilSide = params => {
  return service({
    url: 'lineChart/getTotalFilSide',
    method: 'get',
    params
  })
}

// 获取总利率的侧边栏数据
export const getTotalRateSide = params => {
  return service({
    url: 'lineChart/getTotalRateSide',
    method: 'get',
    params
  })
}

// 获取借贷的侧边栏数据
export const getLoanRateSide = params => {
  return service({
    url: 'lineChart/getLoanRateSide',
    method: 'get',
    params
  })
}

// 获取质押的侧边栏数据
export const getStackRateSide = params => {
  return service({
    url: 'lineChart/getStackRateSide',
    method: 'get',
    params
  })
}

// 获取资金利用率
export const getFinanceUseRate = params => {
  return service({
    url: 'lineChart/getFinanceUseRate',
    method: 'get',
    params
  })
}
