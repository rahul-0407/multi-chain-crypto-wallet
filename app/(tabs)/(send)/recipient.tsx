import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RecipientScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Send</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter address to send to"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TouchableOpacity style={styles.pasteButton}>
          <Text style={styles.pasteText}>Paste</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.walletLabel}>Wallet 1</Text>

      <TouchableOpacity style={styles.accountRow}>
        <View style={styles.accountIcon}>
          <Ionicons name="person" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.accountName}>Account 1</Text>
          <Text style={styles.accountAddress}>0x112E4...17f6C</Text>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 44,
    marginVertical: 12,
  },
  input: { flex: 1, fontSize: 15 },
  pasteButton: {
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pasteText: { color: "#000", fontWeight: "600" },
  walletLabel: { color: "#777", fontWeight: "600", marginVertical: 16 },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  accountIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff6600",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  accountName: { fontSize: 15, fontWeight: "600" },
  accountAddress: { color: "#777", fontSize: 13 },
});