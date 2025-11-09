// app/utils/tokenList.ts
export type TokenMeta = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo: string;
  /** Optional: better pricing accuracy than symbol */
  coingeckoId?: string;
};

// ✅ Use Record<number, TokenMeta[]> so indexing by a `number` is allowed
export const TOKEN_LIST: Record<number, TokenMeta[]> = {
  11155111: [
    {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "ETH",
      name: "SepoliaETH",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      coingeckoId: "ethereum",
    },
    {
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      symbol: "LINK",
      name: "Chainlink",
      decimals: 18,
      logo: "https://cryptologos.cc/logos/chainlink-link-logo.png",
      coingeckoId: "chainlink",
    },
    {
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      symbol: "USDC",
      name: "USD Coin",
      decimals: 6,
      logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      coingeckoId: "usd-coin",
    },
  ],
  1: [],
  137: [],
  42161: [],
};
