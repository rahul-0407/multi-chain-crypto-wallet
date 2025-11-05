import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../../hooks/useWallet';
import SecureStorage from '../../services/SecureStorage';

export default function SettingsScreen() {
  const router = useRouter();
  const { wallet, deleteWallet } = useWallet();

  const handleShowSeedPhrase = () => {
    Alert.alert(
      'View Seed Phrase',
      'Your seed phrase will be displayed. Make sure no one is watching your screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Show',
          onPress: async () => {
            const mnemonic = await SecureStorage.getMnemonic();
            if (mnemonic) {
              Alert.alert('Seed Phrase', mnemonic);
            }
          },
        },
      ]
    );
  };

  const handleDeleteWallet = () => {
    Alert.alert(
      'Delete Wallet',
      'Are you sure? Make sure you have backed up your seed phrase. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteWallet();
            router.replace('/(auth)/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
          </View>

          {/* Wallet Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wallet Information</Text>
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {wallet?.address.slice(0, 20)}...
                </Text>
              </View>
            </View>
          </View>

          {/* Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.menuItem} onPress={handleShowSeedPhrase}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: '#fef3c7' }]}>
                    <Ionicons name="key" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.menuText}>View Seed Phrase</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Network */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Network</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: '#dbeafe' }]}>
                    <Ionicons name="globe" size={20} color="#3b82f6" />
                  </View>
                  <Text style={styles.menuText}>Network Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: '#f0f0f0' }]}>
                    <Ionicons name="information-circle" size={20} color="#666" />
                  </View>
                  <Text style={styles.menuText}>Version</Text>
                </View>
                <Text style={styles.versionText}>1.0.0</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: '#f0f0f0' }]}>
                    <Ionicons name="help-circle" size={20} color="#666" />
                  </View>
                  <Text style={styles.menuText}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <View style={styles.card}>
              <TouchableOpacity style={styles.menuItem} onPress={handleDeleteWallet}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: '#fee2e2' }]}>
                    <Ionicons name="trash" size={20} color="#dc2626" />
                  </View>
                  <Text style={[styles.menuText, { color: '#dc2626' }]}>
                    Delete Wallet
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 68,
  },
});