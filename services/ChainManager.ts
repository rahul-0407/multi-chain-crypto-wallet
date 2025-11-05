import { ethers } from 'ethers';
import { SUPPORTED_CHAINS } from '../utils/constants';

class ChainManager {
  providers: Record<number, ethers.providers.JsonRpcProvider> = {};

  constructor() {
    this.initializeProviders();
  }

  initializeProviders() {
    SUPPORTED_CHAINS.forEach(chain => {
      this.providers[chain.id] = new ethers.providers.JsonRpcProvider(chain.rpc);
    });
  }

  getProvider(chainId: number): ethers.providers.JsonRpcProvider {
    return this.providers[chainId];
  }

  async getBalance(address: string, chainId: number): Promise<string> {
    try {
      const provider = this.getProvider(chainId);
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  }

  async getGasPrice(chainId: number): Promise<string> {
    try {
      const provider = this.getProvider(chainId);
      const gasPrice = await provider.getGasPrice();
      return ethers.utils.formatUnits(gasPrice, 'gwei');
    } catch (error) {
      console.error('Error fetching gas price:', error);
      return '0';
    }
  }

  async estimateGas(transaction: any, chainId: number): Promise<string> {
    try {
      const provider = this.getProvider(chainId);
      const gasEstimate = await provider.estimateGas(transaction);
      const gasPrice = await provider.getGasPrice();
      const totalGas = gasEstimate.mul(gasPrice);
      return ethers.utils.formatEther(totalGas);
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '0';
    }
  }

  

  getChainInfo(chainId: number) {
    return SUPPORTED_CHAINS.find(chain => chain.id === chainId);
  }
}

export default new ChainManager();


