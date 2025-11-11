import { ethers } from "ethers";
import { SCANNERS } from "../utils/scanners";

async function getJSON(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log("Etherscan HTTP error:", res.status);
      return { status: "0", message: "error", result: [] };
    }
    return await res.json();
  } catch (e) {
    console.log("getJSON failed:", e);
    return { status: "0", message: "error", result: [] };
  }
}

/* -----------------------------------------
   FETCH NATIVE (CHAIN COIN) TRANSACTIONS
-------------------------------------------- */
export async function fetchNativeTxs(
  address: string,
  chainId: number,
  page: number = 1,
  offset: number = 25
) {
  const conf = SCANNERS[chainId];
  if (!conf) return [];

  const url =
    `${conf.apiBase}/v2/api` +
    `?apikey=${process.env.EXPO_PUBLIC_ETHERSCAN_KEY}` +
    `&chainid=${chainId}` +
    `&module=account` +
    `&action=txlist` +
    `&address=${address}` +
    `&startblock=0` +
    `&endblock=9999999999` +
    `&page=${page}` +
    `&offset=${offset}` +
    `&sort=desc`;

  console.log("FETCH NATIVE:", url);

  const data = await getJSON(url);
  const list = Array.isArray(data.result) ? data.result : [];

  return list.map((t: any) => ({
    hash: t.hash,
    from: t.from,
    to: t.to,
    time: Number(t.timeStamp),
    valueEth: ethers.utils.formatEther(t.value ?? "0"),
    status: t.isError === "1" ? "Failed" : "Confirmed",
  }));
}

/* -----------------------------------------
   FETCH ERC-20 TOKEN TRANSFERS
-------------------------------------------- */
export async function fetchTokenTxs(
  address: string,
  chainId: number,
  page: number = 1,
  offset: number = 25
) {
  const conf = SCANNERS[chainId];
  if (!conf) return [];

  const url =
    `${conf.apiBase}/v2/api` +
    `?apikey=${process.env.EXPO_PUBLIC_ETHERSCAN_KEY}` +
    `&chainid=${chainId}` +
    `&module=account` +
    `&action=tokentx` +
    `&address=${address}` +
    `&startblock=0` +
    `&endblock=9999999999` +
    `&page=${page}` +
    `&offset=${offset}` +
    `&sort=desc`;

  console.log("FETCH TOKENS:", url);

  const data = await getJSON(url);
  const list = Array.isArray(data.result) ? data.result : [];

  return list.map((t: any) => {
    const dec = Number(t.tokenDecimal || 18);
    return {
      hash: t.hash,
      contract: t.contractAddress,
      from: t.from,
      to: t.to,
      time: Number(t.timeStamp),
      value: ethers.utils.formatUnits(t.value ?? "0", dec),
      symbol: t.tokenSymbol,
      name: t.tokenName,
      status: "Confirmed",
    };
  });
}

/* -----------------------------------------
   EXPLORER LINKS
-------------------------------------------- */
export function explorerTxUrl(hash: string, chainId: number) {
  const conf = SCANNERS[chainId];
  return conf ? `${conf.explorerBase}/tx/${hash}` : "#";
}

export function explorerAddressUrl(addr: string, chainId: number) {
  const conf = SCANNERS[chainId];
  return conf ? `${conf.explorerBase}/address/${addr}` : "#";
}
