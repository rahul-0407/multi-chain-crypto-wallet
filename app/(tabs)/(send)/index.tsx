import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SendSelectScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Send</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search tokens and NFTs"
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.sectionTitle}>Tokens</Text>

      <TouchableOpacity
        style={styles.tokenRow}
        onPress={() => router.push("/(tabs)/(send)/amount")}
      >
        <View style={styles.tokenIcon}>
          <Text style={styles.iconText}>S</Text>
        </View>
        <View style={styles.tokenDetails}>
          <Text style={styles.tokenName}>SepoliaETH</Text>
          <Text style={styles.tokenSub}>SepoliaETH</Text>
        </View>
        <View style={styles.tokenAmount}>
          <Text style={styles.amountText}>$0</Text>
          <Text style={styles.amountSub}>0.162 SepoliaETH</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "700" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
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
    backgroundColor: "#e9d8fd",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { fontWeight: "600" },
  tokenDetails: { flex: 1, marginLeft: 10 },
  tokenName: { fontSize: 16, fontWeight: "600" },
  tokenSub: { fontSize: 13, color: "#666" },
  tokenAmount: { alignItems: "flex-end" },
  amountText: { fontWeight: "600" },
  amountSub: { fontSize: 13, color: "#666" },
});

