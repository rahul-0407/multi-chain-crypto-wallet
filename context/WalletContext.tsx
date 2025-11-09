// app/context/WalletContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import WalletService from '../services/WalletService';
import ChainManager from '../services/ChainManager';
import SecureStorage from '../services/SecureStorage';
import { SUPPORTED_CHAINS } from '../utils/constants';
import { getTokenData, attachUsdPrices, TokenWithPrice } from '../services/TokenService';

interface WalletContextType {
  wallet: { address: string; privateKey: string } | null;
  selectedChain: typeof SUPPORTED_CHAINS[0];
  setSelectedChain: (chain: typeof SUPPORTED_CHAINS[0]) => void;
  balances: Record<number, string>;
  tokenList: TokenWithPrice[];         // ✅ NEW
  loading: boolean;
  isInitialized: boolean;
  createWallet: (mnemonic: string) => Promise<any>;
  importWallet: (mnemonic: string) => Promise<any>;
  refreshBalances: () => Promise<void>;
  refreshTokens: () => Promise<void>;  // ✅ NEW
  deleteWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null);
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
  const [balances, setBalances] = useState<Record<number, string>>({});
  const [tokenList, setTokenList] = useState<TokenWithPrice[]>([]); // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeWallet();
  }, []);

  useEffect(() => {
    // Refresh tokens when wallet/chain changes
    if (wallet) refreshTokens();
  }, [wallet, selectedChain]);

  const initializeWallet = async () => {
    const hasWallet = await SecureStorage.hasWallet();
    if (hasWallet) {
      const walletData = await WalletService.loadWallet();
      if (walletData) {
        setWallet(walletData);
        await loadBalances(walletData.address);
      }
    }
    setIsInitialized(true);
  };

  const createWallet = async (mnemonic: string) => {
    const walletData = WalletService.createFromMnemonic(mnemonic);
    if (walletData) {
      await WalletService.saveWallet(mnemonic);
      setWallet(walletData);
      await loadBalances(walletData.address);
      return walletData;
    }
    return null;
  };

  const importWallet = async (mnemonic: string) => {
    const walletData = WalletService.createFromMnemonic(mnemonic);
    if (walletData) {
      await WalletService.saveWallet(mnemonic);
      setWallet(walletData);
      await loadBalances(walletData.address);
      return walletData;
    }
    return null;
  };

  const loadBalances = async (address: string) => {
    setLoading(true);
    const newBalances: Record<number, string> = {};
    for (const chain of SUPPORTED_CHAINS) {
      const balance = await ChainManager.getBalance(address, chain.id);
      newBalances[chain.id] = balance;
    }
    setBalances(newBalances);
    setLoading(false);
  };

  const refreshBalances = async () => {
    if (wallet) await loadBalances(wallet.address);
  };

  const refreshTokens = async () => {
    if (!wallet) return;
    const rpc = selectedChain.rpc;
    const chainId = selectedChain.id;
    const base = await getTokenData(chainId, wallet.address, rpc);
    const withPrices = await attachUsdPrices(base);
    setTokenList(withPrices);
  };

  const deleteWallet = async () => {
    await SecureStorage.deleteWallet();
    setWallet(null);
    setBalances({});
    setTokenList([]); // clear tokens
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        selectedChain,
        setSelectedChain,
        balances,
        tokenList,        // ✅ include in value
        loading,
        isInitialized,
        createWallet,
        importWallet,
        refreshBalances,
        refreshTokens,     // ✅ include in value
        deleteWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
