// utils/scanners.ts
export type ScannerConfig = {
  apiBase: string;
  explorerBase: string;
  apiKey: string; // placeholder now
};

export const SCANNERS: Record<number, ScannerConfig> = {
  1: {
    apiBase: "https://api.etherscan.io/api",
    explorerBase: "https://etherscan.io",
    apiKey: "JT7BC61WEBSJUR59BK77D9HIXRJB5SDFM5",
  },
  11155111: {
    apiBase: "https://api-sepolia.etherscan.io/api",
    explorerBase: "https://sepolia.etherscan.io",
    apiKey: "JT7BC61WEBSJUR59BK77D9HIXRJB5SDFM5",
  },
//   137: {
//     apiBase: "https://api.polygonscan.com/api",
//     explorerBase: "https://polygonscan.com",
//     apiKey: "JT7BC61WEBSJUR59BK77D9HIXRJB5SDFM5",
//   },
//   42161: {
//     apiBase: "https://api.arbiscan.io/api",
//     explorerBase: "https://arbiscan.io",
//     apiKey: "JT7BC61WEBSJUR59BK77D9HIXRJB5SDFM5",
//   },
//   8453: {
//     apiBase: "https://api.basescan.org/api",
//     explorerBase: "https://basescan.org",
//     apiKey: "JT7BC61WEBSJUR59BK77D9HIXRJB5SDFM5",
//   },
};
