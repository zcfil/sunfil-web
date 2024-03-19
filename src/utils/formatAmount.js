/**
 * 金额千分位分割格式函数
 * @param {Number|String} value 需要转化的金额字符串
 */

export const formatAmount = value => {
  //传入值不是数字直接返回0
  if (!value) return '0.00'
  const values = value.toString().split('.')
  // 整数部分
  let integerNum = values[0]
  // 小数部分
  let decimalNum = values[1] ? values[1] : '00'
  decimalNum = decimalNum.length === 1 ? decimalNum + 0 : decimalNum
  //传入值小于1000不切割
  if (integerNum < 1000) {
    return `${integerNum}.${decimalNum}`
  }
  const list = []
  while (integerNum.length > 3) {
    // 倒序切割
    list.unshift(integerNum.slice(-3))
    integerNum = integerNum.slice(0, -3)
  }
  // 处理剩余长度
  list.unshift(integerNum)
  return `${list.join(',')}.${decimalNum}`
}
