export type ScannerConfig = {
  apiBase: string;       // Only one V2 API base
  explorerBase: string;  // Each chain has its own explorer
};

export const SCANNERS: Record<number, ScannerConfig> = {
  1: {
    apiBase: "https://api.etherscan.io",
    explorerBase: "https://etherscan.io",
  },

  11155111: {
    apiBase: "https://api.etherscan.io",
    explorerBase: "https://sepolia.etherscan.io",
  },

  137: {
    apiBase: "https://api.etherscan.io",
    explorerBase: "https://polygonscan.com",
  },

  42161: {
    apiBase: "https://api.etherscan.io",
    explorerBase: "https://arbiscan.io",
  },

  8453: {
    apiBase: "https://api.etherscan.io",
    explorerBase: "https://basescan.org",
  },
};
