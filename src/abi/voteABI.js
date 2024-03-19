// 投票abi接口
export const voteAbi = [
  // 获取投票人票数
  // 参数名	必选	类型	说明
  // proposal	是	address	节点合约地址
  {
    inputs: [
      {
        internalType: 'address',
        name: 'proposal',
        type: 'address'
      }
    ],
    name: 'getVoterWeight',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // 投票
  // 参数名	必选	类型	说明
  // proposal	是	address	节点合约地址
  // voteType	是	uint256	投票 1 弃权,2同意,3反对
  {
    inputs: [
      {
        internalType: 'address',
        name: 'proposal',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'voteType',
        type: 'uint256'
      }
    ],
    name: 'takeVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
