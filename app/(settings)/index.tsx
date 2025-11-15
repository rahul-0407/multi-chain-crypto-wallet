import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
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
            if (mnemonic) Alert.alert('Seed Phrase', mnemonic);
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


  // Add below your handleDeleteWallet()
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out? You can log back in anytime using your Secret Recovery Phrase.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await deleteWallet(); // clears from context + SecureStore
            router.replace('/(auth)/onboarding');
          },
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Close Button */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)");
              }
            }}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>

        </View>

        {/* Section Items */}
        <TouchableOpacity style={styles.item}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>General</Text>
            <Text style={styles.itemSubtitle}>
              Currency conversion, language, and search engine.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleShowSeedPhrase}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>Security & Privacy</Text>
            <Text style={styles.itemSubtitle}>
              View private key and Secret Recovery Phrase.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>Advanced</Text>
            <Text style={styles.itemSubtitle}>
              Developer features, reset account, IPFS, custom RPC.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>Backup and Sync</Text>
            <Text style={styles.itemSubtitle}>
              Back up your accounts and sync settings.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/(settings)/notifications')}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>Notifications</Text>
            <Text style={styles.itemSubtitle}>
              Manage your notifications.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>Contacts</Text>
            <Text style={styles.itemSubtitle}>
              Add, edit, and manage your accounts.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>Networks</Text>
            <Text style={styles.itemSubtitle}>
              Add and edit custom RPC networks.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>Buy & Sell Crypto</Text>
            <Text style={styles.itemSubtitle}>Region & more...</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>Experimental</Text>
            <Text style={styles.itemSubtitle}>WalletConnect & more...</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* About & Support */}
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemTitle}>About Wallet</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemTitle}>Request a Feature</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemTitle}>Contact Support</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>

        {/* Danger Section */}
        <TouchableOpacity onPress={handleDeleteWallet}>
          <Text style={styles.dangerText}>Delete Wallet</Text>
        </TouchableOpacity>

        {/* Logout / Lock */}
        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.lockText}>Log Out</Text>
        </TouchableOpacity>


        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 10,
    marginHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    padding: 6,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#f2f2f2',
    marginVertical: 16,
  },
  dangerText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 30,
    marginHorizontal: 20,
  },
  lockText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginHorizontal: 20,
  },
});
