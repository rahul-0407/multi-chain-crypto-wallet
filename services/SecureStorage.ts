import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../utils/constants';

class SecureStorageService {
  async saveMnemonic(mnemonic: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.MNEMONIC, mnemonic);
      await SecureStore.setItemAsync(STORAGE_KEYS.HAS_WALLET, 'true');
      return true;
    } catch (error) {
      console.error('Error saving mnemonic:', error);
      return false;
    }
  }

  async getMnemonic(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.MNEMONIC);
    } catch (error) {
      console.error('Error getting mnemonic:', error);
      return null;
    }
  }

  async hasWallet(): Promise<boolean> {
    try {
      const hasWallet = await SecureStore.getItemAsync(STORAGE_KEYS.HAS_WALLET);
      return hasWallet === 'true';
    } catch (error) {
      return false;
    }
  }

  async deleteWallet(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.MNEMONIC);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.HAS_WALLET);
      return true;
    } catch (error) {
      console.error('Error deleting wallet:', error);
      return false;
    }
  }
}

export default new SecureStorageService();