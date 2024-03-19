export const toFixedNum = (num, decimal) => {
  num = num.toString()
  let index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}

// 处理进度条超过100%数据
export const _format = value => {
  return () => {
    return value.toFixed(2) + '%'
  }
}

export const _format2 = value => {
  return () => {
    return ''
  }
}
