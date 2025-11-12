// App.js - Updated with Dynamic Data and Modals
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import { useWallet } from '../../hooks/useWallet';
import { SUPPORTED_CHAINS } from '../../utils/constants';
import { formatAddress, formatBalance, formatUSD } from '../../utils/formatters';
import { getUsdValue } from "../../utils/pricing";
import { router } from "expo-router";
import ComingSoonModal from "../../components/ComingSoonModal";

export default function App() {
  const { wallet, balances, loading, refreshBalances, selectedChain, setSelectedChain, tokenList } = useWallet();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

 useFocusEffect(
  React.useCallback(() => {
    refreshBalances();
  }, [])
);

  const copyAddress = async () => {
    if (wallet?.address) {
      await Clipboard.setStringAsync(wallet.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // Calculate total balance across all chains
  const totalBalance = Object.entries(balances).reduce((sum, [chainId, balance]) => {
    return sum + parseFloat(balance || '0');
  }, 0);

  // TOTAL USD VALUE (MATCH SEND PAGE)
const totalUsdValue = tokenList.reduce(
  (sum, token) => sum + (token.usdValue || 0),
  0
);
 // Mock price - you can add real price API later

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.accountSection}
            onPress={() => setShowAccountModal(true)}
          >
            <Text style={styles.accountText}>Account 1</Text>
            <Ionicons name="chevron-down" size={18} color="#000" />
          </TouchableOpacity>

          <View style={styles.iconsRight}>
            <TouchableOpacity onPress={copyAddress}>
              <Ionicons
                name={copiedAddress ? "checkmark" : "copy-outline"}
                size={22}
                color="#444"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="qr-code-outline" size={22} color="#444" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons onPress={() => router.push('../(settings)/notifications')} name="notifications-outline" size={22} color="#444" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="menu-outline" size={24} color="#444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Section - Dynamic */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceValue}>{formatUSD(totalUsdValue)}</Text>
          <Text style={styles.balanceChange}>+$0 (+0.00%)</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <ActionButton onPress={() => setShowComingSoon(true)} icon="cash-outline" label="Buy" />
          <ActionButton onPress={() => router.push("/(tabs)/swap")} icon="swap-vertical-outline" label="Swap" />
          <ActionButton onPress={() => router.push("/(tabs)/(send)/send")} icon="send-outline" label="Send" />
          <ActionButton onPress={() => router.push("/(tabs)/rewards")} icon="arrow-down-outline" label="Receive" />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <Text style={[styles.tabText, styles.activeTab]}>Tokens</Text>
          <Text style={styles.tabText}>Perps</Text>
          <Text style={styles.tabText}>DeFi</Text>
          <Text style={styles.tabText}>NFTs</Text>
        </View>

        {/* Token Section - Dynamic */}
        <View style={styles.tokenSection}>
          <TouchableOpacity
            style={styles.networkSelector}
            onPress={() => setShowNetworkModal(true)}
          >
            <View style={[styles.tokenIcon1, { backgroundColor: selectedChain.color }]}>
              <MaterialCommunityIcons name="ethereum" size={12} color="#fff" />
            </View>
            <Text style={styles.networkText}>{selectedChain.name}</Text>
            <Ionicons name="chevron-down" size={16} color="#000" />
          </TouchableOpacity>

          {/* Dynamic Token Cards */}
          {loading ? (
            <ActivityIndicator size="large" color="#627EEA" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.tokenCard}>
              <View style={styles.tokenLeft}>
                <View style={[styles.tokenIcon, { backgroundColor: selectedChain.color }]}>
                  <MaterialCommunityIcons name="ethereum" size={26} color="#fff" />
                </View>
                <View>
                  <Text style={styles.tokenName}>{selectedChain.name}</Text>
                  <Text style={styles.tokenSub}>
                    {formatBalance(balances[selectedChain.id] || '0')} {selectedChain.symbol} •{' '}
                    <Text style={styles.tokenEarn}>Earn 3.2%</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.tokenRight}>
                <Text style={styles.tokenValue}>
                  {formatUSD(parseFloat(balances[selectedChain.id] || '0') * 2000)}
                </Text>
                <Text style={styles.tokenChange}>-5.90%</Text>
              </View>
            </View>
          )}

        </View>

        {/* Fund Section */}
        {totalBalance === 0 && (
          <View style={styles.fundBox}>
            <Text style={styles.fundText}>
              Fund your wallet to get started in web3
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add funds</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Account Modal */}
      <Modal
        visible={showAccountModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAccountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Accounts</Text>
              <TouchableOpacity onPress={() => setShowAccountModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search your accounts"
              placeholderTextColor="#999"
            />

            <View style={styles.accountList}>
              <Text style={styles.sectionTitle}>Wallet 1</Text>

              <TouchableOpacity style={styles.accountItem}>
                <View style={styles.accountItemLeft}>
                  <View style={styles.accountAvatar}>
                    <Ionicons name="wallet" size={20} color="#ff6b35" />
                  </View>
                  <View>
                    <Text style={styles.accountName}>Account 1</Text>
                    <Text style={styles.accountAddress}>{formatAddress(wallet?.address || '')}</Text>
                  </View>
                </View>
                <Ionicons name="ellipsis-vertical" size={20} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.createButton}>
                <Ionicons name="add-circle-outline" size={20} color="#667eea" />
                <Text style={styles.createButtonText}>Create account</Text>
              </TouchableOpacity>

              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Imported accounts</Text>

              <TouchableOpacity style={styles.accountItem}>
                <View style={styles.accountItemLeft}>
                  <View style={[styles.accountAvatar, { backgroundColor: '#fef3c7' }]}>
                    <Ionicons name="download-outline" size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.accountName}>Account 2</Text>
                </View>
                <Ionicons name="ellipsis-vertical" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addWalletButton}>
              <Text style={styles.addWalletText}>Add wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Network Modal */}
      <Modal
        visible={showNetworkModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNetworkModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Networks</Text>
              <TouchableOpacity onPress={() => setShowNetworkModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity style={styles.tabButton}>
                <Text style={styles.tabButtonText}>Popular</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabButton, styles.tabButtonInactive]}>
                <Text style={[styles.tabButtonText, styles.tabButtonTextInactive]}>Custom</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.allNetworksOption}>
              <View style={styles.networkOptionLeft}>
                <View style={styles.allNetworksIcon}>
                  <Ionicons name="globe-outline" size={20} color="#667eea" />
                </View>
                <Text style={styles.networkOptionText}>All popular networks</Text>
              </View>
            </TouchableOpacity>

            <ScrollView style={styles.networkList}>
              {SUPPORTED_CHAINS.map((chain) => (
                <TouchableOpacity
                  key={chain.id}
                  style={styles.networkItem}
                  onPress={() => {
                    setSelectedChain(chain);
                    setShowNetworkModal(false);
                  }}
                >
                  <View style={styles.networkItemLeft}>
                    <View style={[styles.networkIcon, { backgroundColor: chain.color }]}>
                      <MaterialCommunityIcons name="ethereum" size={20} color="#fff" />
                    </View>
                    <Text style={styles.networkName}>{chain.name}</Text>
                  </View>
                  {selectedChain.id === chain.id && (
                    <Ionicons name="checkmark" size={20} color="#667eea" />
                  )}
                  <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                </TouchableOpacity>
              ))}

              <Text style={styles.additionalTitle}>Additional networks</Text>

              {/* You can add more networks here */}
              <TouchableOpacity style={styles.networkItem}>
                <View style={styles.networkItemLeft}>
                  <View style={[styles.networkIcon, { backgroundColor: '#e84142' }]}>
                    <MaterialCommunityIcons name="triangle" size={20} color="#fff" />
                  </View>
                  <Text style={styles.networkName}>Avalanche</Text>
                </View>
                <Ionicons name="add" size={20} color="#667eea" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.networkItem}>
                <View style={styles.networkItemLeft}>
                  <View style={[styles.networkIcon, { backgroundColor: '#28a0f0' }]}>
                    <MaterialCommunityIcons name="alpha-a-circle" size={20} color="#fff" />
                  </View>
                  <Text style={styles.networkName}>Arbitrum</Text>
                </View>
                <Ionicons name="add" size={20} color="#667eea" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.networkItem}>
                <View style={styles.networkItemLeft}>
                  <View style={[styles.networkIcon, { backgroundColor: '#f3ba2f' }]}>
                    <MaterialCommunityIcons name="circle" size={20} color="#fff" />
                  </View>
                  <Text style={styles.networkName}>BNB Chain</Text>
                </View>
                <Ionicons name="add" size={20} color="#667eea" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ComingSoonModal
        visible={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="Buy Feature"
        message="Buying crypto will be available soon!"
      />
    </SafeAreaView>
  );
}


type ActionButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

const ActionButton = ({ icon, label, onPress }: ActionButtonProps) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#000" />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    paddingBottom: 18
  },
  accountSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountText: {
    fontSize: 18,
    fontWeight: "500",
    marginRight: 4,
  },
  iconsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  balanceContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: "bold",
  },
  balanceChange: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 13,
    paddingVertical: 14,
    width: "23%",
  },
  actionLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
    marginTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  tabText: {
    fontSize: 15,
    color: "#777",
  },
  activeTab: {
    color: "#000",
    fontWeight: "600",
    borderBottomWidth: 2,
    borderColor: "#000",
    paddingBottom: 6,
  },
  tokenSection: {
    marginTop: 15,
    paddingHorizontal: 16,
  },
  networkSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  networkText: {
    fontSize: 14,
    marginRight: 6,
  },
  tokenCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  tokenLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#627EEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tokenIcon1: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: "#627EEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: "600",
  },
  tokenSub: {
    fontSize: 13,
    color: "#666",
  },
  tokenEarn: {
    color: "#2563eb",
  },
  tokenRight: {
    alignItems: "flex-end",
  },
  tokenValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  tokenChange: {
    fontSize: 13,
    color: "red",
  },
  fundBox: {
    marginTop: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  fundText: {
    color: "#000",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "800",
  },
  addButton: {
    backgroundColor: "#000",
    borderRadius: 14,
    paddingVertical: 14,
    width: "90%",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 14,
  },
  accountList: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 12,
    fontWeight: '600',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffe5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountAddress: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  createButtonText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  addWalletButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addWalletText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  tabButtonTextInactive: {
    color: '#999',
  },
  allNetworksOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  networkOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allNetworksIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  networkOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  networkList: {
    maxHeight: 400,
  },
  networkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  networkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  networkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '500',
  },
  additionalTitle: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 12,
    fontWeight: '600',
  },
});