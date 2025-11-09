// app/services/TokenService.ts
import { ethers } from "ethers";
import axios from "axios";
import { TOKEN_LIST, TokenMeta } from "../utils/tokenList";

const erc20ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export type TokenWithBalance = TokenMeta & { balance: number };
export type TokenWithPrice = TokenWithBalance & { usdValue: number };

export async function getTokenData(
  chainId: number,
  wallet: string,
  rpcUrl: string
): Promise<TokenWithBalance[]> {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const tokens: TokenMeta[] = TOKEN_LIST[chainId] || [];
  const result: TokenWithBalance[] = [];

  for (const token of tokens) {
    if (token.address.toLowerCase() === "0x0000000000000000000000000000000000000000") {
      const bal = await provider.getBalance(wallet);
      result.push({
        ...token,
        balance: Number(ethers.utils.formatUnits(bal, 18)),
      });
    } else {
      const contract = new ethers.Contract(token.address, erc20ABI, provider);
      const bal = await contract.balanceOf(wallet);
      result.push({
        ...token,
        balance: Number(ethers.utils.formatUnits(bal, token.decimals)),
      });
    }
  }

  return result;
}

export async function attachUsdPrices(tokens: TokenWithBalance[]): Promise<TokenWithPrice[]> {
  if (tokens.length === 0) return [];

  const ids = tokens
    .map((t) => t.coingeckoId || t.symbol.toLowerCase())
    .join(",");

  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      { params: { ids, vs_currencies: "usd" } }
    );

    return tokens.map((t) => {
      const key = (t.coingeckoId || t.symbol.toLowerCase()) as keyof typeof data;
      const usd = (data as any)?.[key]?.usd ?? 0;
      return { ...t, usdValue: usd * t.balance };
    });
  } catch {
    // Fallback: no prices
    return tokens.map((t) => ({ ...t, usdValue: 0 }));
  }
}
