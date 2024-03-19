import { ethers } from 'ethers' // ES6 or TypeScript
import { utils } from 'ethers'
const { formatEther } = utils

import {
  filecoinMpoolGetNonce,
  filecoinGasEstimateMessageGas,
  filecoinEthAddressToFilecoinAddress
} from '@/api/checkIn.js' //接口
import { ElMessage } from 'element-plus'

// 获取f4地址
const getF4 = async walletAddr => {
  // 把钱包地址转成 f4
  const query = {
    jsonrpc: '2.0',
    method: 'Filecoin.EthAddressToFilecoinAddress',
    params: [walletAddr],
    id: Math.floor(Math.random() * 100) //随机向下取整
  }
  const res = await filecoinEthAddressToFilecoinAddress(query)

  if (!res.error) {
    return res.result
  } else {
    console.log('getF4Error')
  }
}

// 获取Nonce值方法
export const getNonceFn = async address => {
  const query = {
    jsonrpc: '2.0',
    method: 'Filecoin.MpoolGetNonce',
    params: [await getF4(address)],
    id: Math.floor(Math.random() * 100) //随机向下取整
  }

  const res = await filecoinMpoolGetNonce(query)
  if (!res.error) {
    return res.result
  } else {
    console.log('nonceError')
  }
}

// 获取gas值法
export const getGasFn = async option => {
  const query = {
    jsonrpc: '2.0',
    method: 'Filecoin.GasEstimateMessageGas', //方法名
    params: [
      option, //传过来的对象
      { MaxFee: '250000000000000000' }, //第二个参数使用gas上限，写死就好
      [] //第三个参数留空
    ],
    id: Math.floor(Math.random() * 100) //随机向下取整
  }

  query.params[0].From = await getF4(option.From)
  query.params[0].To = await getF4(option.To)

  const res = await filecoinGasEstimateMessageGas(query)

  if (!res.error) {
    return res.result
  } else {
    console.log('gasError')
  }
}

// 封装估算链价格方法
export const chainPrice = async rcpURL => {
  const providerETH = new ethers.providers.JsonRpcProvider(rcpURL)
  const nowPrice = (await providerETH.getGasPrice()).toString()
  console.log('\n估算的nowPrice:', nowPrice)
}

// 生成提供成
function getProvider () {
  const calibrationURL = 'https://api.node.glif.io'
  // 连接以太坊: RPC 正式网
  const providerETH = new ethers.providers.JsonRpcProvider(calibrationURL)
  // 连接以太坊: MetaMask
  const providerWEB = new ethers.providers.Web3Provider(window.ethereum)

  return providerWEB
}

// 获取单价的gas费用
export const getGasPriceData = async () => {
  const providers = getProvider()
  const result = await providers.getGasPrice()
  return result.toString()
}

/**
 * 获取完整的gas费用
 * @param abiType 合约对应的abi文件
 * @param funcName 合约中具体的方法
 * @param address 合约地址
 * @returns 预估的gas费用 string类型
 */
export const estimateGasService = async (
  abiType,
  funcName,
  address,
  amount
) => {
  const iface = new utils.Interface(abiType)
  const sigHash = iface.getSighash(funcName)
  // console.log('sigHash...', sigHash)

  const provider = getProvider()
  const gasPrice = await provider.getGasPrice()
  // console.log('gasPrice....', formatEther(gasPrice))

  const gas = await provider.estimateGas({
    to: address,
    data: sigHash,
    value: utils.parseEther(amount)
  })

  console.log('gas...', gas)
  return formatEther(gasPrice.mul(gas))
}
