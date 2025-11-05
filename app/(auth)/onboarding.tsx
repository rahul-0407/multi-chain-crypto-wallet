import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../../hooks/useWallet';
import WalletService from '../../services/WalletService';

export default function OnboardingScreen() {
  const router = useRouter();
  const { createWallet } = useWallet();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMnemonic, setImportMnemonic] = useState('');

  // In app/(auth)/onboarding.tsx
const handleCreateWallet = async () => {
  const mnemonic = await WalletService.generateMnemonic(); // Now async
  router.push({
    pathname: '/(auth)/backup',
    params: { mnemonic }
  });
};

  const handleImportWallet = async () => {
    if (!importMnemonic.trim()) {
      Alert.alert('Error', 'Please enter your seed phrase');
      return;
    }

    const words = importMnemonic.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      Alert.alert('Error', 'Seed phrase must be 12 or 24 words');
      return;
    }

    const wallet = await createWallet(importMnemonic.trim());
    if (wallet) {
      setShowImportModal(false);
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Invalid seed phrase');
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>💎</Text>
            </View>
            <Text style={styles.title}>Multi-Chain Wallet</Text>
            <Text style={styles.subtitle}>
              Secure wallet for Ethereum, Polygon & BSC
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCreateWallet}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Create New Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowImportModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Import Existing Wallet</Text>
            </TouchableOpacity>
          </View>

          {/* Warning */}
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              ⚠️ Never share your seed phrase with anyone. Keep it safe and secure!
            </Text>
          </View>
        </View>

        {/* Import Modal */}
        <Modal
          visible={showImportModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowImportModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Import Wallet</Text>
              <Text style={styles.modalSubtitle}>
                Enter your 12 or 24 word seed phrase
              </Text>

              <TextInput
                style={styles.textArea}
                placeholder="word1 word2 word3 ..."
                value={importMnemonic}
                onChangeText={setImportMnemonic}
                multiline
                numberOfLines={4}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowImportModal(false);
                    setImportMnemonic('');
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalImportButton}
                  onPress={handleImportWallet}
                >
                  <Text style={styles.modalImportText}>Import</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warning: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  warningText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#667eea',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  modalImportButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  modalImportText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});