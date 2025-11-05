import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../../hooks/useWallet';

export default function BackupScreen() {
  const router = useRouter();
  const { mnemonic } = useLocalSearchParams<{ mnemonic: string }>();
  const { createWallet } = useWallet();
  const [revealed, setRevealed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const words = mnemonic?.split(' ') || [];

  const handleContinue = async () => {
    if (!revealed) {
      Alert.alert('Warning', 'Please reveal and write down your seed phrase first');
      return;
    }

    if (!confirmed) {
      Alert.alert(
        'Confirm Backup',
        'Have you safely written down your seed phrase? You will not be able to recover your wallet without it.',
        [
          { text: 'Not Yet', style: 'cancel' },
          {
            text: 'Yes, Continue',
            onPress: async () => {
              if (mnemonic) {
                await createWallet(mnemonic);
                router.replace('/(tabs)');
              }
            },
          },
        ]
      );
    } else {
      if (mnemonic) {
        await createWallet(mnemonic);
        router.replace('/(tabs)');
      }
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Backup Your Wallet</Text>
            <Text style={styles.subtitle}>
              Write down these 12 words in order and keep them safe
            </Text>
          </View>

          {/* Seed Phrase Display */}
          <View style={styles.seedContainer}>
            {!revealed ? (
              <View style={styles.blurContainer}>
                <Text style={styles.blurText}>Tap to reveal seed phrase</Text>
                <TouchableOpacity
                  style={styles.revealButton}
                  onPress={() => setRevealed(true)}
                >
                  <Text style={styles.revealButtonText}>👁️ Reveal</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.wordsGrid}>
                {words.map((word, index) => (
                  <View key={index} style={styles.wordCard}>
                    <Text style={styles.wordNumber}>{index + 1}</Text>
                    <Text style={styles.wordText}>{word}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Warnings */}
          {revealed && (
            <>
              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>🔒 Security Tips</Text>
                <Text style={styles.warningText}>
                  • Write these words on paper{'\n'}
                  • Never share with anyone{'\n'}
                  • Store in a safe place{'\n'}
                  • Never take screenshots
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.checkbox, confirmed && styles.checkboxChecked]}
                onPress={() => setConfirmed(!confirmed)}
              >
                <View style={styles.checkboxInner}>
                  {confirmed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>
                  I have written down my seed phrase
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, (!revealed || !confirmed) && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!revealed || !confirmed}
          >
            <Text style={styles.continueButtonText}>Continue to Wallet</Text>
          </TouchableOpacity>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  seedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  blurContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  blurText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  revealButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  revealButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  wordCard: {
    width: '30%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  wordNumber: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  warningBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  checkboxChecked: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
});