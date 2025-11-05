export const SUPPORTED_CHAINS = [
  {
    id: 11155111,
    name: 'Ethereum Sepolia',
    symbol: 'ETH',
    rpc: 'https://eth-sepolia.g.alchemy.com/v2/C6LvWCaOCHnDuTlpmwfD7JQFkdsXCMC-',
    explorer: 'https://sepolia.etherscan.io',
    color: '#627EEA'
  },
  {
    id: 137,
    name: 'Polygon Mainnet',
    symbol: 'MATIC',
    rpc: 'https://polygon-rpc.com/',
    explorer: 'https://polygonscan.com',
    color: '#8247E5'
  },
  {
    id: 8453,
    name: 'Base Mainnet',
    symbol: 'BASE',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    color: '#0052FF'
  }
];



export const STORAGE_KEYS = {
  MNEMONIC: 'wallet_mnemonic',
  HAS_WALLET: 'has_wallet',
  SELECTED_CHAIN: 'selected_chain'
};

