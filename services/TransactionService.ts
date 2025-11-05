import { ethers } from 'ethers';
import ChainManager from './ChainManager';
import WalletService from './WalletService';

class TransactionService {
  async sendTransaction(to: string, amount: string, chainId: number) {
    try {
      const provider = ChainManager.getProvider(chainId);
      if (!WalletService.wallet) {
        throw new Error('No wallet connected');
      }
      const wallet = WalletService.wallet.connect(provider);

      const transaction = {
        to,
        value: ethers.utils.parseEther(amount)
      };

      const gasLimit = await provider.estimateGas(transaction);
      const gasPrice = await provider.getGasPrice();

      const tx = await wallet.sendTransaction({
        ...transaction,
        gasLimit,
        gasPrice
      });
      
      const receipt = await tx.wait();

      return {
        success: true,
        hash: receipt.transactionHash,
        receipt
      };
    } catch (error: any) {
      console.error('Transaction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTransactionReceipt(txHash: string, chainId: number) {
    try {
      const provider = ChainManager.getProvider(chainId);
      return await provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Error fetching receipt:', error);
      return null;
    }
  }
}

export default new TransactionService();