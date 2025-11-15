import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../../hooks/useWallet';
import WalletService from '../../services/WalletService';

export default function OnboardingScreen() {
  const router = useRouter();
  const { createWallet } = useWallet();

  const [showImportModal, setShowImportModal] = useState(false);

  /** CHIP INPUT STATES */
  const [chipWords, setChipWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');

  /** LOADING OVERLAY */
  const [loading, setLoading] = useState(false);

  /** CREATE WALLET */
  const handleCreateWallet = async () => {
    const mnemonic = await WalletService.generateMnemonic();
    router.push({
      pathname: '/(auth)/backup',
      params: { mnemonic },
    });
  };

  /** ----------------------
   *     CHIP INPUT LOGIC
   *  ---------------------- */
  const handleWordInput = (text: string) => {
    if (text.endsWith(' ')) {
      const clean = text.trim().toLowerCase();
      if (clean.length > 0) {
        setChipWords([...chipWords, clean]);
      }
      setCurrentWord('');
    } else {
      setCurrentWord(text);
    }
  };

  const removeChip = (index: number) => {
    setChipWords(chipWords.filter((_, i) => i !== index));
  };

  /** ----------------------
   *     IMPORT WALLET (with loading)
   *  ---------------------- */
  const handleImportWallet = async () => {
    if (chipWords.length !== 12 && chipWords.length !== 24) {
      Alert.alert('Error', 'Seed phrase must contain 12 or 24 words.');
      return;
    }

    const mnemonic = chipWords.join(' ');

    // close modal immediately
    setShowImportModal(false);

    // show loading overlay
    setLoading(true);

    // run heavy process in background
    setTimeout(async () => {
      const wallet = await createWallet(mnemonic);

      setLoading(false);

      if (wallet) {
        router.replace('/');
      } else {
        Alert.alert('Error', 'Invalid seed phrase');
      }
    }, 50);
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* 🔥 FULLSCREEN LOADING OVERLAY */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingTitle}>Importing Wallet…</Text>
          <ActivityIndicator size="large" color={neon} />
        </View>
      )}

      {/* TOP LOGO BLOCK */}
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
          onPress={() => {
            setChipWords([]);
            setCurrentWord('');
            setShowImportModal(true);
          }}
        >
          <Text style={styles.secondaryButtonText}>
            Import an existing wallet
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>BIBIZ 2024</Text>

      {/* 🔥 IMPORT MODAL WITH CHIP INPUT */}
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
              Type your seed phrase (press space after each word)
            </Text>

            {/* CHIP INPUT FIELD */}
            <View style={styles.chipsWrapper}>
              {chipWords.map((word, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{word}</Text>
                  <TouchableOpacity onPress={() => removeChip(index)}>
                    <Text style={styles.chipClose}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TextInput
                style={styles.chipInput}
                placeholder="Type word..."
                placeholderTextColor="#777"
                value={currentWord}
                onChangeText={handleWordInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* MODAL BUTTONS */}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowImportModal(false)}
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

/* ----------------------------------------------------------------- */

const neon = '#D5FF00';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },

  /* ------------------ LOADING OVERLAY ------------------ */
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 999,
  },
  loadingTitle: {
    color: neon,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },

  /* ------------------ LOGO ------------------ */
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

  /* ------------------ TEXT ------------------ */
  textWrapper: { alignItems: 'center', marginTop: 25 },
  welcomeText: { color: '#fff', fontSize: 22 },
  appName: { color: neon, fontSize: 34, fontWeight: '800', marginTop: 4 },
  subText: { color: '#aaa', fontSize: 15, marginTop: 20 },

  /* ------------------ BUTTONS ------------------ */
  buttonsWrapper: { marginTop: 100, marginBottom: -60 },
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

  footer: {
    textAlign: 'center',
    color: '#555',
    marginTop: 5,
  },

  /* ------------------ MODAL ------------------ */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
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

  /* ------------------ CHIP INPUT ------------------ */
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { color: '#fff', marginRight: 6 },
  chipClose: { color: neon, fontWeight: '700' },

  chipInput: {
    minWidth: 90,
    padding: 5,
    color: '#fff',
    fontSize: 15,
  },

  /* ------------------ MODAL BUTTONS ------------------ */
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
    backgroundColor: neon,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalImportText: {
    color: '#000',
    fontWeight: '700',
  },
});
