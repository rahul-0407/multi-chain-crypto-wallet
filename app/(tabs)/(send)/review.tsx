// app/(send)/ReviewScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChainManager from "../../../services/ChainManager";
import WalletService from "../../../services/WalletService";

export default function ReviewScreen() {
  const router = useRouter();
  const { address } = useLocalSearchParams();
  const [gasFee, setGasFee] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const chainId = 11155111; // You can replace this with selectedChain.id
  const network = ChainManager.getChainInfo(chainId);

  useEffect(() => {
    const loadGas = async () => {
      const fee = await ChainManager.getGasPrice(chainId);
      setGasFee(fee);
      setLoading(false);
    };
    loadGas();
  }, []);

  const confirmSend = async () => {
    router.push("/(tabs)/activity"); // you can later integrate TransactionService here
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Review</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Amount */}
      <View style={styles.amountSection}>
        <Text style={styles.amountText}>0.001 {network?.symbol}</Text>
        <Text style={styles.usdText}>≈ $0</Text>
      </View>

      {/* Accounts */}
      <View style={styles.accountRow}>
        <Text style={styles.label}>From</Text>
        <Text style={styles.value}>Account 1</Text>
      </View>

      <View style={styles.accountRow}>
        <Text style={styles.label}>To</Text>
        <Text style={styles.value}>{String(address).slice(0, 8)}...</Text>
      </View>

      {/* Network Info */}
      <View style={styles.networkBox}>
        <Text style={styles.netLabel}>Network</Text>
        <Text style={styles.netValue}>{network?.name}</Text>

        <Text style={styles.netLabel}>Network Fee</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.netValue}>
            {gasFee} {network?.symbol}
          </Text>
        )}
        <Text style={styles.speedText}>Speed: Market ~12 sec</Text>
      </View>

      {/* Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.btn, styles.cancel]}
          onPress={() => router.back()}
        >
          <Text style={styles.btnTextCancel}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.confirm]}
          onPress={confirmSend}
        >
          <Text style={styles.btnTextConfirm}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "700" },
  amountSection: { alignItems: "center", marginBottom: 16 },
  amountText: { fontSize: 24, fontWeight: "700" },
  usdText: { color: "#777" },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: { color: "#555" },
  value: { fontWeight: "600" },
  networkBox: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginVertical: 14,
  },
  netLabel: { color: "#666", marginTop: 6 },
  netValue: { fontWeight: "600" },
  speedText: { color: "#888", fontSize: 13, marginTop: 6 },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    gap: 10,
  },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  cancel: { backgroundColor: "#eee" },
  confirm: { backgroundColor: "#000" },
  btnTextCancel: { color: "#000", fontWeight: "700" },
  btnTextConfirm: { color: "#fff", fontWeight: "700" },
});
