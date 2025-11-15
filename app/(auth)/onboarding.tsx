import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../../hooks/useWallet';
import WalletService from '../../services/WalletService';

export default function OnboardingScreen() {
  const router = useRouter();
  const { createWallet } = useWallet();

  const [showImportModal, setShowImportModal] = useState(false);
  const [importMnemonic, setImportMnemonic] = useState('');

  const handleCreateWallet = async () => {
    const mnemonic = await WalletService.generateMnemonic();
    router.push({
      pathname: '/(auth)/backup',
      params: { mnemonic },
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
    <SafeAreaView style={styles.container}>
      {/* TOP LOGO BLOCK (Bibiz Layout) */}
      <View style={styles.topLogoContainer}>
        <View style={styles.logoBlockRow}>
          <View style={styles.logoBlock} />
          <View style={styles.logoBlockTall} />
        </View>

        <View style={styles.logoBlockRow}>
          <View style={styles.logoBlockTall} />
          <View style={styles.logoBlock} />
        </View>
      </View>

      {/* TEXT SECTION */}
      <View style={styles.textWrapper}>
        <Text style={styles.welcomeText}>Welcome To</Text>
        <Text style={styles.appName}>Multi Wallet!</Text>
        <Text style={styles.subText}>Let's get started!</Text>
      </View>

      {/* BUTTONS */}
      <View style={styles.buttonsWrapper}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCreateWallet}
        >
          <Text style={styles.primaryButtonText}>Create a new wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowImportModal(true)}
        >
          <Text style={styles.secondaryButtonText}>
            Import an existing wallet
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>BIBIZ 2024</Text>

      {/* IMPORT MODAL */}
      <Modal
        visible={showImportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Import Wallet</Text>
            <Text style={styles.modalSubtitle}>
              Enter your 12 or 24 word seed phrase
            </Text>

            <TextInput
              style={styles.input}
              placeholder="word1 word2 word3 ..."
              placeholderTextColor="#888"
              value={importMnemonic}
              onChangeText={setImportMnemonic}
              multiline
              numberOfLines={4}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtonsRow}>
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
  );
}

const neon = '#D5FF00';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },

  /** ----------------------------
   *   TOP LOGO LAYOUT (EXACT)
   *  ---------------------------- */
  topLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
    gap: 14,
  },

  logoBlockRow: {
    flexDirection: 'column',
    gap: 14,
  },

  logoBlock: {
    width: 70,
    height: 70,
    backgroundColor: neon,
    borderRadius: 8,
  },

  logoBlockTall: {
    width: 70,
    height: 150,
    backgroundColor: neon,
    borderRadius: 8,
  },

  /** ----------------------------
   *        TEXT BLOCK
   *  ---------------------------- */
  textWrapper: {
    alignItems: 'center',
    marginTop: 25,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 22,
  },
  appName: {
    color: neon,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 4,
  },
  subText: {
    color: '#aaa',
    fontSize: 15,
    marginTop: 20,
  },

  /** ----------------------------
   *        BUTTONS
   *  ---------------------------- */
  buttonsWrapper: {
    marginTop: 100,
    marginBottom: -60
  },

  primaryButton: {
    backgroundColor: neon,
    paddingVertical: 16,
    borderRadius: 21,
    alignItems: 'center',
    marginBottom: 14,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },

  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 21,
    borderColor: '#333',
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },

  /** ----------------------------
   *         FOOTER
   *  ---------------------------- */
  // footer: {
  //   textAlign: 'center',
  //   marginBottom: 30,
  //   color: '#444',
  //   fontSize: 14,
  //   letterSpacing: 2,
  // },

  bottomArea: {
    marginBottom: 35,
  },

  createBtn: {
    backgroundColor: neon,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },
  createBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  importBtn: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  importBtnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    textAlign: "center",
    color: "#555",
    marginTop: 5,
  },

  /** ----------------------------
   *         IMPORT MODAL
   *  ---------------------------- */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 22,
  },
  modalTitle: {
    color: neon,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#aaa',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 15,
    minHeight: 120,
    color: '#fff',
    marginBottom: 20,
  },

  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: neon,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: neon,
    fontWeight: '700',
  },
  modalImportButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: neon,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalImportText: {
    color: '#000',
    fontWeight: '700',
  },
});
