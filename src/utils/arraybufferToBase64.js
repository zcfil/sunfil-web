import Web3 from 'web3'
import { CID } from 'multiformats/cid' //装换 cid 库
// 引入库
import BN from 'bn.js'
import leb from 'leb128'
import { Buffer } from 'buffer'

import {
  UnknownProtocolIndicator,
  InvalidPayloadLength,
  InvalidChecksumAddress,
  base32Decode,
  ProtocolIndicator,
  getChecksum
} from './getParams'

// 将字节数组转成base64
export const arraybufferToBase64 = byteArray => {
  // 将字节数组转成 UInt8Array
  const uint8Array = new Uint8Array(byteArray) // 变成8为无符号构成整数数组,可以用来表示二进制

  // 使用 btoa() 函数将 UInt8Array 二进制流数据 转换为 base64 编码
  const base64Encoded = btoa(String.fromCharCode.apply(null, uint8Array))

  return base64Encoded
}

// 把签名消息转成base64
export const HexToBase64 = sha1 => {
  var digits =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  var base64_rep = ''
  var ascv
  var bit_arr = 0
  var bit_num = 0

  for (var n = 0; n < sha1.length; ++n) {
    if (sha1[n] >= 'A' && sha1[n] <= 'Z') {
      ascv = sha1.charCodeAt(n) - 55
    } else if (sha1[n] >= 'a' && sha1[n] <= 'z') {
      ascv = sha1.charCodeAt(n) - 87
    } else {
      ascv = sha1.charCodeAt(n) - 48
    }

    bit_arr = (bit_arr << 4) | ascv
    bit_num += 4
    if (bit_num >= 6) {
      bit_num -= 6

      base64_rep += digits[bit_arr >>> bit_num]
      bit_arr &= ~(-1 << bit_num)
    }
  }

  if (bit_num > 0) {
    bit_arr <<= 6 - bit_num
    base64_rep += digits[bit_arr]
  }
  var padding = base64_rep.length % 4

  if (padding > 0) {
    for (var n = 0; n < 4 - padding; ++n) {
      base64_rep += '='
    }
  }
  return base64_rep
}

// cid转换成16进制
export const cidToBytesToHex = cid => {
  // 将cid序列化转成字节
  const cidTransform = CID.parse(cid)

  const byteArray = cidTransform.bytes

  let hexString = '' //16进制数组

  for (let i = 0; i < byteArray.length; i++) {
    const hexByte = byteArray[i].toString(16).padStart(2, '0')
    hexString += hexByte
  }

  return hexString
}

// 16进制字符串转字节数组
export const Str2Bytes = str => {
  if (str.length <= 0) {
    return
  }
  if (str.length % 2 != 0) {
    str = '0' + str
  }
  var pos = 0
  var len = str.length
  len /= 2
  var hexA = new Array()
  for (var i = 0; i < len; i++) {
    var s = str.substr(pos, 2)
    var v = parseInt(s, 16)
    hexA.push(v)
    pos += 2
  }
  return hexA
}

// 生成cbor编码方法
export const getCbor = (t, l) => {
  let obj = {
    res: 1,
    arr: new Array(9)
  }
  // var res = 1

  if (l < 24) {
    obj.arr[0] = (t << 5) | l

    obj.res = 1
  } else if (l < 1 << 8) {
    obj.arr[0] = (t << 5) | 24
    obj.arr[1] = l
    obj.res = 2
  } else if (l < 1 << 16) {
    obj.arr[0] = (t << 5) | 25
    obj.arr[1] = l >> 8
    obj.arr[2] = l
    obj.res = 3
  } else if (l < 1 << 32) {
    obj.arr[0] = (t << 5) | 26
    obj.arr[1] = l >> 24
    obj.arr[2] = l >> 16
    obj.arr[3] = l >> 8
    obj.arr[4] = l
    obj.res = 5
  } else {
    obj.arr[0] = (t << 5) | 27
    obj.arr[1] = l >> 56
    obj.arr[2] = l >> 48
    obj.arr[3] = l >> 40
    obj.arr[4] = l >> 32
    obj.arr[5] = l >> 24
    obj.arr[6] = l >> 16
    obj.arr[7] = l >> 8
    obj.arr[8] = l
    obj.res = 9
  }

  obj.arr = obj.arr.slice(0, obj.res)

  return obj.arr
}

// 生成参数原始方法
export const MajorType = (buf, t, l) => {
  let obj = {
    buf: buf,
    res: 1
  }
  // var res = 1
  if (l < 24) {
    obj.buf[0] = (t << 5) | l
    obj.res = 1
  } else if (l < 1 << 8) {
    obj.buf[0] = (t << 5) | 24
    obj.buf[1] = l
    obj.res = 2
  } else if (l < 1 << 16) {
    obj.buf[0] = (t << 5) | 25
    obj.buf[1] = l >> 8
    obj.buf[2] = l
    obj.res = 3
  } else if (l < 1 << 32) {
    obj.buf[0] = (t << 5) | 26
    obj.buf[1] = l >> 24
    obj.buf[2] = l >> 16
    obj.buf[3] = l >> 8
    obj.buf[4] = l
    obj.res = 5
  } else {
    obj.buf[0] = (t << 5) | 27
    obj.buf[1] = l >> 56
    obj.buf[2] = l >> 48
    obj.buf[3] = l >> 40
    obj.buf[4] = l >> 32
    obj.buf[5] = l >> 24
    obj.buf[6] = l >> 16
    obj.buf[7] = l >> 8
    obj.buf[8] = l
    obj.res = 9
  }
  return obj
}

//剪切掉16进制abi前两位
const getHex = val => {
  return val.substr(2)
}

// 入职提议签名abi参数  方法+节点号+操作人地址
export const contractAbiCborCode = (method, nodeId, account) => {
  var web3 = new Web3(window.ethereum)

  let abiStr = ''

  // .substr(2) 去掉16进制 0x 开头两位
  const methodsAbi = web3.eth.abi.encodeEventSignature(method).substr(2)

  // 剪切掉前两位再转
  const nodeAbi = web3.eth.abi
    .encodeParameter('uint64', nodeId.substr(2))
    .substr(2)

  const accountAbi = web3.eth.abi.encodeParameter('address', account).substr(2)

  // 拼接成一个16进制
  abiStr = methodsAbi.slice(0, 8) + nodeAbi + accountAbi

  // 将16进制转成字节数组
  const bytesArr = Str2Bytes(abiStr)

  let arr = new Array(9).fill(0)
  arr = getCbor(2, abiStr.length / 2)

  const concat = [...arr, ...bytesArr]
  const params = arraybufferToBase64(concat)

  return params
}

// 离职签名参数  方法+节点号
export const departAbi = (method, nodeId) => {
  var web3 = new Web3(window.ethereum)

  let abiStr = ''

  // .substr(2) 去掉16进制 0x 开头两位
  const methodsAbi = web3.eth.abi.encodeEventSignature(method).substr(2)

  // 剪切掉前两位再转
  const nodeAbi = web3.eth.abi
    .encodeParameter('uint64', nodeId.substr(2))
    .substr(2)

  // 拼接成一个16进制
  abiStr = methodsAbi.slice(0, 8) + nodeAbi

  // 将16进制转成字节数组
  const bytesArr = Str2Bytes(abiStr)

  let arr = new Array(9).fill(0)
  arr = getCbor(2, abiStr.length / 2)

  const concat = [...arr, ...bytesArr]
  const params = arraybufferToBase64(concat)

  return params
}

// 传control数组
export const contractAbiCborCode2 = (method, nodeId, workerId, controlArr) => {
  var web3 = new Web3(window.ethereum)

  let abiStr = ''

  // .substr(2) 去掉16进制 0x 开头两位
  const methodsAbi = web3.eth.abi.encodeEventSignature(method).substr(2)

  // 剪切掉前两位再转
  const nodeAbi = web3.eth.abi
    .encodeParameter('uint64', nodeId.substr(2))
    .substr(2)

  const workerIdAbi = web3.eth.abi
    .encodeParameter('uint64', workerId.substr(2))
    .substr(2)

  const controlArrAbi = web3.eth.abi
    .encodeParameter('uint64[]', controlArr)
    .substr(2)

  // 拼接成一个16进制
  abiStr = methodsAbi.slice(0, 8) + nodeAbi + workerIdAbi + controlArrAbi

  // 将16进制转成字节数组
  const bytesArr = Str2Bytes(abiStr)

  let arr = new Array(9).fill(0)
  arr = getCbor(2, abiStr.length / 2)

  const concat = [...arr, ...bytesArr]
  const params = arraybufferToBase64(concat)

  return params
}

// 生成修改control  worker abi合约参数
export const contractAbiCborCode3 = arrValue => {
  var web3 = new Web3(window.ethereum)

  let abiStr = ''

  // .substr(2) 去掉16进制 0x 开头两位
  const methodsAbi = web3.eth.abi.encodeEventSignature(arrValue[0]).substr(2)

  abiStr = web3.eth.abi.encodeParameters(
    ['uint256', 'uint256', 'uint256[]'],
    [arrValue[1].substr(2), arrValue[2].substr(2), arrValue[3]]
  )

  // // 拼接成一个16进制
  abiStr = abiStr.substr(2)

  const str = methodsAbi.slice(0, 8) + abiStr

  // // 将16进制转成字节数组
  const bytesArr = Str2Bytes(str)

  let arr = new Array(9).fill(0)
  arr = getCbor(2, str.length / 2)

  const concat = [...arr, ...bytesArr]

  const params = arraybufferToBase64(concat)

  return params
}

// 生成修改control  worker abi合约参数--已存在新worker且超过单签时间/高度
export const contractAbiCborCode4 = arrValue => {
  var web3 = new Web3(window.ethereum)

  let abiStr = ''

  // .substr(2) 去掉16进制 0x 开头两位
  const methodsAbi = web3.eth.abi.encodeEventSignature(arrValue[0]).substr(2)

  const nodeAbi = web3.eth.abi
    .encodeParameter('uint64', arrValue[1].substr(2))
    .substr(2)

  // 拼接成一个16进制
  abiStr = methodsAbi.slice(0, 8) + nodeAbi

  // 将16进制转成字节数组
  const bytesArr = Str2Bytes(abiStr)

  let arr = new Array(9).fill(0)
  arr = getCbor(2, abiStr.length / 2)

  const concat = [...arr, ...bytesArr]
  const params = arraybufferToBase64(concat)

  return params
}

// 第二个及以上钱包多签参数
export const MajorType1 = (bufLength, t, l) => {
  let obj = {
    arr: new Array(bufLength).fill(0), //生成长度为bufLength 每个值都为0数组
    res: 1
  }

  if (l < 24) {
    obj.arr[0] = (t << 5) | l
    obj.res = 1
  } else if (l < 1 << 8) {
    obj.arr[0] = (t << 5) | 24
    obj.arr[1] = l
    obj.res = 2
  } else if (l < 1 << 16) {
    obj.arr[0] = (t << 5) | 25
    obj.arr[1] = l >> 8
    obj.arr[2] = l
    obj.res = 3
  } else if (l < 1 << 32) {
    obj.arr[0] = (t << 5) | 26
    obj.arr[1] = l >> 24
    obj.arr[2] = l >> 16
    obj.arr[3] = l >> 8
    obj.arr[4] = l
    obj.res = 5
  } else {
    obj.arr[0] = (t << 5) | 27
    obj.arr[1] = l >> 56
    obj.arr[2] = l >> 48
    obj.arr[3] = l >> 40
    obj.arr[4] = l >> 32
    obj.arr[5] = l >> 24
    obj.arr[6] = l >> 16
    obj.arr[7] = l >> 8
    obj.arr[8] = l
    obj.res = 9
  }

  return obj
}

// 二次及以上签名 gas 参数
export const txIdParams = id => {
  // 第一段
  const txId = id
  const arr = [130]

  // 第二段

  let obj = 0

  if (obj >= 0) {
    obj = MajorType1(9, 0, txId)
  } else {
    obj = MajorType1(9, 1, -txId - 1)
  }

  //第三段
  let obj2 = MajorType1(1, 2, 0)
  // 合并字节数组
  const concat = [...arr, ...obj.arr.slice(0, obj.res), ...obj2.arr]
  // 生成编码
  const params = arraybufferToBase64(concat)

  // 获取 gas 中Params参数
  return params
}

// 修改worker--以下方法用于判断返回WorkerChangeEpoch值是否超过当前时间或高度
const time = '2020-08-25 06:00:00' //主网   //'2022-11-02 02:13:00' 校准网重置时间

// 把WorkerChangeEpoch转换为时间
export function getExpiryTime (expiry) {
  let genesis = new Date(time)
  let Expiry = Date.parse(genesis) + expiry * 30 * 1000
  var oldTime = new Date(Expiry)
  return getTime(oldTime)
}

// 获取当前高度
export function getNowHeight () {
  let genesis = new Date(time)
  let height = (Date.parse(new Date()) - Date.parse(genesis)) / 30 / 1000
  return parseInt(height)
}

export function getTime (oldTime) {
  return (
    oldTime.toLocaleDateString().replace(/\//g, '-') +
    ' ' +
    oldTime.toTimeString().substr(0, 8)
  )
}

// 受益人合约转换相关方法
function delegatedAddressAsBytes (address) {
  const protocolIndicator = address[1]
  let namespaceRaw = address.slice(2, address.indexOf('f', 2))
  let subAddressRaw = address.slice(address.indexOf('f', 2) + 1)
  let address_decoded = base32Decode(subAddressRaw.toUpperCase(), 'RFC4648')
  let namespaceBuff = new BN(namespaceRaw, 10).toBuffer('be', 8)
  let namespaceBytes = Buffer.from(leb.unsigned.encode(namespaceBuff))
  let protocolBytes = Buffer.from(leb.unsigned.encode(protocolIndicator))
  let bytes_address = Buffer.concat([
    protocolBytes,
    namespaceBytes,
    Buffer.from(address_decoded.slice(0, -4))
  ])
  let checksum = Buffer.from(address_decoded.slice(-4))
  if (getChecksum(bytes_address).toString('hex') !== checksum.toString('hex')) {
    throw new InvalidChecksumAddress()
  }
  return bytes_address
}

// 受益人合约转换
export function addressAsBytes (address) {
  let address_decoded, payload, checksum
  const protocolIndicator = address[1]

  const protocolIndicatorByte = `0${protocolIndicator}`

  switch (Number(protocolIndicator)) {
    case ProtocolIndicator.ID:
      if (address.length > 18) {
        throw new InvalidPayloadLength()
      }
      return Buffer.concat([
        Buffer.from(protocolIndicatorByte, 'hex'),
        Buffer.from(leb.unsigned.encode(address.substr(2)))
      ])

    case ProtocolIndicator.SECP256K1:
      address_decoded = base32Decode(address.slice(2).toUpperCase(), 'RFC4648')
      payload = address_decoded.slice(0, -4)
      checksum = Buffer.from(address_decoded.slice(-4))

      if (payload.byteLength !== 20) {
        throw new InvalidPayloadLength()
      }
      break
    case ProtocolIndicator.ACTOR:
      address_decoded = base32Decode(address.slice(2).toUpperCase(), 'RFC4648')
      payload = address_decoded.slice(0, -4)
      checksum = Buffer.from(address_decoded.slice(-4))
      if (payload.byteLength !== 20) {
        throw new InvalidPayloadLength()
      }
      break
    case ProtocolIndicator.BLS:
      address_decoded = base32Decode(address.slice(2).toUpperCase(), 'RFC4648')
      payload = address_decoded.slice(0, -4)
      checksum = Buffer.from(address_decoded.slice(-4))
      if (payload.byteLength !== 48) {
        throw new InvalidPayloadLength()
      }
      break

    case ProtocolIndicator.DELEGATED:
      return delegatedAddressAsBytes(address)
    default:
      throw new UnknownProtocolIndicator()
  }

  const bytes_address = Buffer.concat([
    Buffer.from(protocolIndicatorByte, 'hex'),
    Buffer.from(payload)
  ])

  if (getChecksum(bytes_address).toString('hex') !== checksum.toString('hex')) {
    throw new InvalidChecksumAddress()
  }

  return bytes_address
}

// 受益人入职参数
export const beneficiaryParams = contractId => {
  // 第一段
  const arr = [131]

  // 第二段 address
  const contractArr = addressAsBytes(contractId)
  let obj = MajorType1(9, 2, contractArr.length)

  // 第三段
  const filBuf = [
    81, 0, 3, 2, 95, 57, 239, 36, 28, 86, 205, 46, 124, 64, 0, 0, 0, 0
  ]
  const buf3 = Buffer.from(filBuf)

  // 第四段
  const expBuf = [27, 63, 214, 123, 160, 206, 204, 0, 0]
  const buf4 = Buffer.from(expBuf)

  // 合并
  let list = [
    ...arr,
    ...obj.arr.slice(0, obj.res),
    ...contractArr,
    ...buf3,
    ...buf4
  ]

  const params = arraybufferToBase64(list)

  return params
}

// 受益人离职参数
export const beneficiaryParams2 = contractId => {
  // 第一段
  const arr = [131]

  // 第二段 address
  const contractArr = addressAsBytes(contractId)
  let obj = MajorType1(9, 2, contractArr.length)

  // 第三段
  const buf3 = [64, 0]

  // 合并
  let list = [...arr, ...obj.arr.slice(0, obj.res), ...contractArr, ...buf3]

  const params = arraybufferToBase64(list)

  return params
}

// owner离职参数
export const ownerParams = oldOwnerId => {
  // 第二段 oldOwnerId
  const contractArr = addressAsBytes(oldOwnerId)
  let obj = MajorType1(9, 2, contractArr.length)
  // 合并
  let list = [...obj.arr.slice(0, obj.res), ...contractArr]

  const params = arraybufferToBase64(list)

  return params
}

// 方法名称转码
export const gasParams = (methodName, mode, amount, boolNum, nodeId) => {
  var web3 = new Web3(window.ethereum)
  let abiStr = ''

  // .substr(2) 去掉16进制 0x 开头两位
  let methodsAbi = ''
  let amountAbi = ''
  let boolNumAbi = ''
  let nodeAbi = ''
  let arr = new Array(9).fill(0)
  let concat = []
  let bytesArr = []
  let params = ''

  switch (mode) {
    case 'addStakes':
      methodsAbi = web3.eth.abi.encodeEventSignature(methodName).substr(2)
      abiStr = methodsAbi.slice(0, 8)
      bytesArr = Str2Bytes(abiStr)
      arr = getCbor(2, abiStr.length / 2)
      concat = [...arr, ...bytesArr]
      params = arraybufferToBase64(concat)

      return params
      break

    case 'withdrawStakes':
      //方法名

      methodsAbi = web3.eth.abi.encodeEventSignature(methodName).substr(2)

      amountAbi = web3.eth.abi.encodeParameter('uint256', amount).substr(2)

      boolNumAbi = web3.eth.abi.encodeParameter('uint256', boolNum).substr(2)

      abiStr = methodsAbi.slice(0, 8) + amountAbi + boolNumAbi

      // 将16进制转成字节数组
      bytesArr = Str2Bytes(abiStr)

      arr = getCbor(2, abiStr.length / 2)

      concat = [...arr, ...bytesArr]

      params = arraybufferToBase64(concat)
      return params
      break
    case 'loan':
      //方法名

      methodsAbi = web3.eth.abi.encodeEventSignature(methodName).substr(2)

      amountAbi = web3.eth.abi.encodeParameter('uint256', amount).substr(2)

      boolNumAbi = web3.eth.abi.encodeParameter('uint256', boolNum).substr(2)
      nodeAbi = web3.eth.abi
        .encodeParameter('uint64', nodeId.substr(2))
        .substr(2)

      abiStr = methodsAbi.slice(0, 8) + nodeAbi + amountAbi + boolNumAbi

      // 将16进制转成字节数组
      bytesArr = Str2Bytes(abiStr)

      arr = getCbor(2, abiStr.length / 2)

      concat = [...arr, ...bytesArr]

      params = arraybufferToBase64(concat)
      return params
      break
    case 'repay':
      //方法名

      methodsAbi = web3.eth.abi.encodeEventSignature(methodName).substr(2)

      amountAbi = web3.eth.abi.encodeParameter('uint256', amount).substr(2)

      boolNumAbi = web3.eth.abi.encodeParameter('uint256', boolNum).substr(2)
      nodeAbi = web3.eth.abi
        .encodeParameter('uint64', nodeId.substr(2))
        .substr(2)

      abiStr = methodsAbi.slice(0, 8) + nodeAbi + amountAbi + boolNumAbi

      // 将16进制转成字节数组
      bytesArr = Str2Bytes(abiStr)

      arr = getCbor(2, abiStr.length / 2)

      concat = [...arr, ...bytesArr]

      params = arraybufferToBase64(concat)
      return params
      break
    case 'withdraw':
      //方法名

      methodsAbi = web3.eth.abi.encodeEventSignature(methodName).substr(2)

      amountAbi = web3.eth.abi.encodeParameter('uint256', amount).substr(2)

      boolNumAbi = web3.eth.abi.encodeParameter('uint256', boolNum).substr(2)
      nodeAbi = web3.eth.abi
        .encodeParameter('uint64', nodeId.substr(2))
        .substr(2)

      abiStr = methodsAbi.slice(0, 8) + nodeAbi + amountAbi + boolNumAbi

      // 将16进制转成字节数组
      bytesArr = Str2Bytes(abiStr)

      arr = getCbor(2, abiStr.length / 2)

      concat = [...arr, ...bytesArr]

      params = arraybufferToBase64(concat)
      return params
      break
  }
}
