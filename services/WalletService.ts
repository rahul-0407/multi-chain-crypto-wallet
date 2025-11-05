import { ethers } from 'ethers';
import SecureStorage from './SecureStorage';

class WalletService {
  wallet: ethers.Wallet | null = null;

  async generateMnemonic(): Promise<string> {
    // Generate 16 random bytes securely using ethers
    const entropy = ethers.utils.randomBytes(16);
    const mnemonic = ethers.utils.entropyToMnemonic(entropy);
    return mnemonic;
  }

  createFromMnemonic(mnemonic: string) {
    try {
      this.wallet = ethers.Wallet.fromMnemonic(mnemonic);
      return {
        address: this.wallet.address,
        privateKey: this.wallet.privateKey,
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      return null;
    }
  }

  createFromPrivateKey(privateKey: string) {
    try {
      this.wallet = new ethers.Wallet(privateKey);
      return {
        address: this.wallet.address,
        privateKey: this.wallet.privateKey,
      };
    } catch (error) {
      console.error('Error importing wallet:', error);
      return null;
    }
  }

  getAddress(): string | null {
    return this.wallet?.address || null;
  }

  async saveWallet(mnemonic: string): Promise<boolean> {
    return await SecureStorage.saveMnemonic(mnemonic);
  }

  async loadWallet() {
    const mnemonic = await SecureStorage.getMnemonic();
    if (mnemonic) {
      return this.createFromMnemonic(mnemonic);
    }
    return null;
  }

  async signTransaction(transaction: any, provider: ethers.providers.Provider) {
    if (!this.wallet) {
      throw new Error('No wallet loaded');
    }
    const walletWithProvider = this.wallet.connect(provider);
    return await walletWithProvider.signTransaction(transaction);
  }
}

export default new WalletService();
