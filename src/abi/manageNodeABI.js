/* 
重点方法:
getMinersByActorId(uint64) 通过节点号获取节点信息
**/

export const manageNodeAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'int256',
        name: 'errorCode',
        type: 'int256'
      }
    ],
    name: 'ActorError',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ActorNotFound',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FailToCallActor',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FailToCallActor',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'CommonTypes.FilActorId',
        name: 'actorId',
        type: 'uint64'
      }
    ],
    name: 'InvalidActorID',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64'
      }
    ],
    name: 'InvalidCodec',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidResponseLength',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'NotEnoughBalance',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'success',
        type: 'bool'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'Response',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'paramTarget',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'paramWorker',
        type: 'uint256'
      },
      {
        internalType: 'uint256[]',
        name: 'paramControl',
        type: 'uint256[]'
      }
    ],
    name: 'changeWorkerAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'target',
        type: 'uint64'
      }
    ],
    name: 'confirmChangeWorkerAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'debtAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getMiners',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'actorId',
            type: 'uint64'
          },
          {
            internalType: 'address',
            name: 'operator',
            type: 'address'
          },
          {
            internalType: 'uint64',
            name: 'ownerId',
            type: 'uint64'
          },
          {
            internalType: 'int16',
            name: 'mortgageType',
            type: 'int16'
          },
          {
            internalType: 'uint256',
            name: 'height',
            type: 'uint256'
          }
        ],
        internalType: 'struct ManageNode.ActorInfo[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'actorId',
        type: 'uint64'
      }
    ],
    name: 'getMinersByActorId',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'actorId',
            type: 'uint64'
          },
          {
            internalType: 'address',
            name: 'operator',
            type: 'address'
          },
          {
            internalType: 'uint64',
            name: 'ownerId',
            type: 'uint64'
          },
          {
            internalType: 'int16',
            name: 'mortgageType',
            type: 'int16'
          },
          {
            internalType: 'uint256',
            name: 'height',
            type: 'uint256'
          }
        ],
        internalType: 'struct ManageNode.ActorInfo',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'actorID',
        type: 'uint64'
      }
    ],
    name: 'minerExiting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'actorID',
        type: 'uint64'
      }
    ],
    name: 'minerExitingBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'target',
        type: 'uint64'
      },
      {
        internalType: 'address',
        name: 'op',
        type: 'address'
      }
    ],
    name: 'minerJoining',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'target',
        type: 'uint64'
      },
      {
        internalType: 'address',
        name: 'op',
        type: 'address'
      }
    ],
    name: 'minerJoiningBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'minerTotal',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pondAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'setDebtContractAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'actorId',
        type: 'uint64'
      },
      {
        internalType: 'address',
        name: 'op',
        type: 'address'
      }
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'setPondContractAddr',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_admin',
        type: 'address'
      }
    ],
    name: 'updateAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
