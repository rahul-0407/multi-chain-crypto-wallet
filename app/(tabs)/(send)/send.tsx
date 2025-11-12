// app/(tabs)/(send)/index.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useWallet } from "../../../hooks/useWallet";
import type { TokenWithPrice } from "../../../services/TokenService";
import { getUsdValue } from "../../../utils/pricing";

export default function SendSelectScreen() {
  const router = useRouter();
  const { tokenList, refreshTokens, selectedChain, wallet } = useWallet();

  useEffect(() => {
    if (wallet) refreshTokens();
  }, [selectedChain, wallet]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Send</Text>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#000" />
        <TextInput
          placeholder="Search tokens and NFTs"
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.sectionTitle}>Tokens</Text>

      {tokenList.map((token: TokenWithPrice) => (
        <TouchableOpacity
          key={`${selectedChain.id}-${token.address}`}
          style={styles.tokenRow}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(send)/amount",
              params: { symbol: token.symbol },
            })
          }
        >
          <Image
            source={{ uri: token.logo }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />

          <View style={styles.tokenDetails}>
            <Text style={styles.tokenName}>{token.name}</Text>
            <Text style={styles.tokenSub}>{token.symbol}</Text>
          </View>

          <View style={styles.tokenAmount}>
            <Text style={styles.amountText}>${token.usdValue.toFixed(2)}</Text>
            <Text style={styles.amountSub}>
              {token.balance} {token.symbol}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
  },
  title: { fontSize: 22, fontWeight: "700" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 49,
  },

  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },

  sectionTitle: {
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 10,
  },

  tokenRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  tokenIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  tokenDetails: { flex: 1, marginLeft: 10 },

  tokenName: { fontSize: 16, fontWeight: "600" },
  tokenSub: { fontSize: 13, color: "#666" },

  tokenAmount: { alignItems: "flex-end" },
  amountText: { fontWeight: "600" },
  amountSub: { fontSize: 13, color: "#666" },
});
