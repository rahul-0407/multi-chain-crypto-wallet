export type ScannerConfig = {
  apiBase: string;
  explorerBase: string;
};

export const SCANNERS: Record<number, ScannerConfig> = {
  1: {
    apiBase: "https://api.etherscan.io/v2/api",
    explorerBase: "https://etherscan.io",
  },

  11155111: {
    apiBase: "https://api-sepolia.etherscan.io/v2/api",
    explorerBase: "https://sepolia.etherscan.io",
  },

  137: {
    apiBase: "https://api.polygonscan.com/v2/api",
    explorerBase: "https://polygonscan.com",
  },

  42161: {
    apiBase: "https://api.arbiscan.io/v2/api",
    explorerBase: "https://arbiscan.io",
  },

  8453: {
    apiBase: "https://api.basescan.org/v2/api",
    explorerBase: "https://basescan.org",
  },
};
