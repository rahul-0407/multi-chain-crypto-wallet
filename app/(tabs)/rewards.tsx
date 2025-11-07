import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/formatters';

export default function ReceiveScreen() {
  const { wallet, selectedChain } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (wallet?.address) {
      await Clipboard.setStringAsync(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareAddress = async () => {
    try {
      await Share.share({
        message: `My ${selectedChain.name} address: ${wallet?.address}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Receive {selectedChain.symbol}</Text>
          <View style={styles.chainBadge}>
            <View style={[styles.chainDot, { backgroundColor: selectedChain.color }]} />
            <Text style={styles.chainText}>{selectedChain.name}</Text>
          </View>
        </View>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={wallet?.address || ''}
              size={240}
              backgroundColor="white"
              color="#333"
            />
          </View>
          <Text style={styles.qrLabel}>Scan to receive {selectedChain.symbol}</Text>
        </View>

        {/* Address Card */}
        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Your {selectedChain.name} Address</Text>
          <Text style={styles.addressText}>{wallet?.address}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={copyAddress}>
            <View style={styles.actionIconContainer}>
              <Ionicons
                name={copied ? 'checkmark' : 'copy-outline'}
                size={24}
                color="#667eea"
              />
            </View>
            <Text style={styles.actionText}>{copied ? 'Copied!' : 'Copy Address'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={shareAddress}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="share-outline" size={24} color="#667eea" />
            </View>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Warning */}
        <View style={styles.warningCard}>
          <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
          <Text style={styles.warningText}>
            Only send {selectedChain.symbol} and {selectedChain.name} tokens to this address.
            Sending other assets may result in permanent loss.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  chainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  chainDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  chainText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrWrapper: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  qrLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#333',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
});