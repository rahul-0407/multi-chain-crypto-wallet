import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../../hooks/useWallet';
import TransactionService from '../../services/TransactionService';
import ChainManager from '../../services/ChainManager';
import { formatBalance, formatUSD } from '../../utils/formatters';

export default function SendScreen() {
  const { wallet, selectedChain, balances } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState('0');

  const availableBalance = balances[selectedChain.id] || '0';

  const estimateGas = async () => {
    if (!recipientAddress || !amount || parseFloat(amount) <= 0) {
      return;
    }

    try {
      const gas = await ChainManager.estimateGas(
        {
          to: recipientAddress,
          value: amount,
        },
        selectedChain.id
      );
      setEstimatedGas(gas);
    } catch (error) {
      console.error('Gas estimation error:', error);
    }
  };

  React.useEffect(() => {
    if (recipientAddress && amount) {
      estimateGas();
    }
  }, [recipientAddress, amount]);

  const handleSend = async () => {
    if (!recipientAddress || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    if (parseFloat(amount) > parseFloat(availableBalance)) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert(
      'Confirm Transaction',
      `Send ${amount} ${selectedChain.symbol} to ${recipientAddress.slice(0, 10)}...?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            setLoading(true);
            const result = await TransactionService.sendTransaction(
              recipientAddress,
              amount,
              selectedChain.id
            );
            setLoading(false);

            if (result.success) {
              Alert.alert('Success', `Transaction sent!\nHash: ${result.hash}`);
              setRecipientAddress('');
              setAmount('');
            } else {
              Alert.alert('Error', result.error || 'Transaction failed');
            }
          },
        },
      ]
    );
  };

  const setMaxAmount = () => {
    const max = parseFloat(availableBalance);
    if (max > 0) {
      setAmount((max * 0.99).toString()); // Leave some for gas
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Send {selectedChain.symbol}</Text>
            <View style={styles.chainBadge}>
              <View style={[styles.chainDot, { backgroundColor: selectedChain.color }]} />
              <Text style={styles.chainText}>{selectedChain.name}</Text>
            </View>
          </View>

          {/* Balance Display */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              {formatBalance(availableBalance)} {selectedChain.symbol}
            </Text>
            <Text style={styles.balanceUsd}>
              ≈ {formatUSD(parseFloat(availableBalance) * 2000)}
            </Text>
          </View>

          {/* Recipient Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Recipient Address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0x..."
                value={recipientAddress}
                onChangeText={setRecipientAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.inputButton}>
                <Ionicons name="qr-code-outline" size={24} color="#667eea" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabelRow}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TouchableOpacity onPress={setMaxAmount}>
                <Text style={styles.maxButton}>MAX</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <Text style={styles.currencyText}>{selectedChain.symbol}</Text>
            </View>
            {amount && (
              <Text style={styles.inputHelperText}>
                ≈ {formatUSD(parseFloat(amount || '0') * 2000)}
              </Text>
            )}
          </View>

          {/* Gas Estimate */}
          {estimatedGas !== '0' && (
            <View style={styles.gasCard}>
              <View style={styles.gasRow}>
                <Text style={styles.gasLabel}>Network Fee</Text>
                <View style={styles.gasRight}>
                  <Text style={styles.gasAmount}>
                    {formatBalance(estimatedGas)} {selectedChain.symbol}
                  </Text>
                  <Text style={styles.gasUsd}>
                    ≈ {formatUSD(parseFloat(estimatedGas) * 2000)}
                  </Text>
                </View>
              </View>
              <View style={[styles.gasRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  {formatBalance((parseFloat(amount || '0') + parseFloat(estimatedGas)).toString())}{' '}
                  {selectedChain.symbol}
                </Text>
              </View>
            </View>
          )}

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={loading || !recipientAddress || !amount}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.sendButtonText}>Send Transaction</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Warning */}
          <View style={styles.warningCard}>
            <Ionicons name="warning-outline" size={20} color="#f59e0b" />
            <Text style={styles.warningText}>
              Double-check the recipient address. Transactions cannot be reversed.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
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
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  balanceUsd: {
    fontSize: 16,
    color: '#999',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maxButton: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  inputButton: {
    padding: 8,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  inputHelperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginLeft: 4,
  },
  gasCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  gasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gasLabel: {
    fontSize: 14,
    color: '#666',
  },
  gasRight: {
    alignItems: 'flex-end',
  },
  gasAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  gasUsd: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#fff9e6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
});