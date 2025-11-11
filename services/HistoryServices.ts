import { ethers } from "ethers";
import { SCANNERS } from "../utils/scanners";

export type TxNative = {
  hash: string;
  from: string;
  to: string;
  time: number;
  valueEth: string;
  status: "Confirmed" | "Failed" | "Pending";
};

export type TxToken = {
  hash: string;
  contract: string;
  from: string;
  to: string;
  time: number;
  value: string;
  symbol: string;
  name?: string;
  status: "Confirmed" | "Failed" | "Pending";
};



// Safe fetch wrapper
async function getJSON(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log("Etherscan HTTP error:", res.status);
      return { status: "0", message: "error", result: [] };
    }
    return await res.json();
  } catch (err) {
    console.log("getJSON failed:", err);
    return { status: "0", message: "error", result: [] };
  }
}

/** NATIVE CHAIN TXS */
export async function fetchNativeTxs(address: string, chainId: number) {
  const conf = SCANNERS[chainId];
  if (!conf) return [];

  const url =
    `${conf.apiBase}?apikey=${process.env.EXPO_PUBLIC_ETHERSCAN_KEY}` +
    `&module=account&action=txlist` +
    `&address=${address}` +
    `&chainid=${chainId}`;

  const data = await getJSON(url);
  console.log(data)
  if (!data?.result) return [];

  const list = Array.isArray(data.result) ? data.result : [];

  return list.map((t: any) => ({
    hash: t.hash,
    from: t.from,
    to: t.to,
    time: Number(t.timeStamp),
    valueEth: ethers.utils.formatEther(t.value),
    status: t.isError === "1" ? "Failed" : "Confirmed"
  }));
}





/** ERC-20 TOKEN TRANSFERS */
// export async function fetchTokenTxs(
//   address: string,
//   chainId: number,
//   page = 1,
//   offset = 25
// ): Promise<TxToken[]> {
//   try {
//     const conf = SCANNERS[chainId];
//     if (!conf) return [];

//     const url =
//       `${conf.apiBase}?module=account&action=tokentx` +
//       `&address=${address}&startblock=0&endblock=99999999` +
//       `&page=${page}&offset=${offset}&sort=desc&apikey=${conf.apiKey}`;

//     const data = await getJSON(url);

//     // ALWAYS ensure result is an array
//     const list = Array.isArray(data.result) ? data.result : [];

//     return list.map((t: any) => {
//       const dec = Number(t.tokenDecimal || 18);
//       return {
//         hash: t.hash,
//         contract: t.contractAddress,
//         from: t.from,
//         to: t.to,
//         time: Number(t.timeStamp),
//         value: ethers.utils.formatUnits(t.value ?? "0", dec),
//         symbol: t.tokenSymbol,
//         name: t.tokenName,
//         status: "Confirmed",
//       };
//     });
//   } catch (e) {
//     console.log("fetchTokenTxs error:", e);
//     return [];
//   }
// }

export function explorerTxUrl(hash: string, chainId: number) {
  const conf = SCANNERS[chainId];
  return conf ? `${conf.explorerBase}/tx/${hash}` : "#";
}

export function explorerAddressUrl(addr: string, chainId: number) {
  const conf = SCANNERS[chainId];
  return conf ? `${conf.explorerBase}/address/${addr}` : "#";
}
