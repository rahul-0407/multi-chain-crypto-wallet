// app/(send)/ReviewScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ethers } from "ethers";

import ChainManager from "../../../services/ChainManager";
import WalletService from "../../../services/WalletService";
import TransactionService from "../../../services/TransactionService";

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const address = Array.isArray(params.address)
    ? params.address[0]
    : (params.address as string);
  const amount = Array.isArray(params.amount)
    ? params.amount[0]
    : (params.amount as string | undefined);

  const [gasFee, setGasFee] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sender, setSender] = useState<string>("");
  const [receiver, setReceiver] = useState<string>(address || "");
  const [usdValue, setUsdValue] = useState<string>("~$0");

  const chainId = 11155111;
  const network = ChainManager.getChainInfo(chainId);

  // 🔹 Fetch details on mount
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const walletAddress = WalletService.getAddress();
        if (walletAddress) setSender(walletAddress);

        const provider = ChainManager.getProvider(chainId);
        if (walletAddress) {
          const bal = await provider.getBalance(walletAddress);
          setBalance(ethers.utils.formatEther(bal));
        }

        const gas = await ChainManager.getGasPrice(chainId);
        setGasFee(gas);

        const ethToUsd = 3500;
        const ethAmount = parseFloat(amount || "0.001");
        const usd = (ethAmount * ethToUsd).toFixed(2);
        setUsdValue(`≈ $${usd}`);
      } catch (e) {
        console.error("Error loading review data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  // ✅ Send transaction
  const confirmSend = async () => {
    if (!receiver || !amount) {
      Alert.alert("Error", "Missing recipient or amount");
      return;
    }

    try {
      setSending(true);

      const result = await TransactionService.sendTransaction(
        receiver,
        amount,
        chainId
      );

      if (result.success) {
        Alert.alert("Transaction Sent", `Hash: ${result.hash}`);
        // Wait 2 sec for UX before redirect
        setTimeout(() => {
          router.push({
            pathname: "/(tabs)/activity",
            params: { txHash: result.hash },
          });
        }, 2000);
      } else {
        Alert.alert("Transaction Failed", result.error);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert("Transaction Error", err.message);
      } else {
        Alert.alert("Unknown Error", String(err));
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Review</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* Amount Section */}
        <View style={styles.amountSection}>
          <View style={styles.iconContainer}>
            <View style={styles.mainIcon}>
              <Text style={styles.iconText}>S</Text>
            </View>
            <View style={styles.badgeIcon}>
              <Text style={styles.badgeText}>s</Text>
            </View>
          </View>

          <Text style={styles.amountText}>
            {amount || "0.001"} {network?.symbol || "SepoliaETH"}
          </Text>
          <Text style={styles.usdText}>{usdValue}</Text>
        </View>

        {/* Account Cards */}
        <View style={styles.accountsContainer}>
          <View style={styles.accountCard}>
            <View style={styles.accountLeft}>
              <View style={[styles.accountIcon, { backgroundColor: "#FF9B71" }]}>
                <Ionicons name="repeat" size={20} color="#FFF" />
              </View>
              <View>
                <Text style={styles.accountTitle}>From</Text>
                <Text style={styles.accountSubtitle}>
                  {sender ? `${sender.slice(0, 8)}...${sender.slice(-6)}` : "Loading..."}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>

          <View style={styles.accountCard}>
            <View style={styles.accountLeft}>
              <View style={[styles.accountIcon, { backgroundColor: "#A8E6A3" }]}>
                <Ionicons name="wallet" size={20} color="#FFF" />
              </View>
              <View>
                <Text style={styles.accountTitle}>To</Text>
                <Text style={styles.accountSubtitle}>
                  {receiver
                    ? `${receiver.slice(0, 8)}...${receiver.slice(-6)}`
                    : "Loading..."}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Network Info */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Network</Text>
            <View style={styles.networkBadge}>
              <View style={styles.networkIconSmall}>
                <Text style={styles.networkIconText}>s</Text>
              </View>
              <Text style={styles.detailValue}>{network?.name || "Sepolia"}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.labelWithIcon}>
              <Text style={styles.detailLabel}>Network Fee</Text>
              <Ionicons name="information-circle-outline" size={16} color="#999" />
            </View>
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <View style={styles.feeContainer}>
                <Ionicons name="create-outline" size={16} color="#6B7EFF" />
                <Text style={styles.detailValue}>
                  {gasFee} {network?.symbol || "SepoliaETH"}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Speed</Text>
            <View style={styles.speedContainer}>
              <Text style={styles.speedIcon}>🦊</Text>
              <Text style={styles.detailValue}>Market ~ 12 sec</Text>
            </View>
          </View>
        </View>

        {/* Advanced Details */}
        <TouchableOpacity style={styles.advancedButton}>
          <Text style={styles.advancedText}>Advanced details</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Footer Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.btn, styles.cancelBtn]}
          onPress={() => router.back()}
          disabled={sending}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.confirmBtn]}
          onPress={confirmSend}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Confirm</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles (same as before)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
  },
  backButton: { padding: 4 },
  title: { fontSize: 18, fontWeight: "600", color: "#000" },
  content: { flex: 1, paddingHorizontal: 16 },
  amountSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFF",
    marginTop: 8,
    borderRadius: 16,
  },
  iconContainer: { position: "relative", marginBottom: 16 },
  mainIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { fontSize: 28, fontWeight: "700", color: "#000" },
  badgeIcon: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#B8A4E8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  badgeText: { fontSize: 14, fontWeight: "600", color: "#FFF" },
  amountText: { fontSize: 24, fontWeight: "700", color: "#000", marginBottom: 4 },
  usdText: { fontSize: 16, color: "#999" },
  accountsContainer: { marginTop: 16, gap: 8 },
  accountCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
  },
  accountLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  accountTitle: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 2 },
  accountSubtitle: { fontSize: 13, color: "#999" },
  detailsCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: { fontSize: 15, color: "#666" },
  labelWithIcon: { flexDirection: "row", alignItems: "center", gap: 4 },
  detailValue: { fontSize: 15, fontWeight: "600", color: "#000" },
  networkBadge: { flexDirection: "row", alignItems: "center", gap: 8 },
  networkIconSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#B8A4E8",
    justifyContent: "center",
    alignItems: "center",
  },
  networkIconText: { fontSize: 11, fontWeight: "600", color: "#FFF" },
  feeContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  speedContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  speedIcon: { fontSize: 16 },
  advancedButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  advancedText: { fontSize: 15, color: "#000" },
  bottomButtons: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  btn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: { backgroundColor: "#F0F0F0" },
  confirmBtn: { backgroundColor: "#000" },
  cancelText: { fontSize: 16, fontWeight: "600", color: "#000" },
  confirmText: { fontSize: 16, fontWeight: "600", color: "#FFF" },
});
