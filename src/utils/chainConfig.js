const ChainConfig = {
  1: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io']
  },
  314: {
    chainId: '0x13a',
    chainName: 'Filecoin',
    nativeCurrency: {
      name: 'FIL',
      symbol: 'FIL',
      decimals: 18
    },
    rpcUrls: ['https://api.node.glif.io'],
    blockExplorerUrls: ['https://filfox.info/en']
  },
  314159: {
    chainId: '0x4cb2f',
    chainName: 'Filecoin - calibration',
    nativeCurrency: {
      name: 'FIL',
      symbol: 'FIL',
      decimals: 18
    },
    rpcUrls: ['https://api.calibration.node.glif.io/rpc/v1'],
    blockExplorerUrls: ['https://filfox.info/en']
  }
}

export default ChainConfig
