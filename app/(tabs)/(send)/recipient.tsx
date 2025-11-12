// app/(send)/RecipientScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { ethers } from "ethers";

export default function RecipientScreen() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Validate address on change
  useEffect(() => {
    setIsValid(ethers.utils.isAddress(address.trim()));
  }, [address]);

  // Paste from clipboard
  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    setAddress(text.trim());
  };

  // Go to Review screen
  const handleReview = () => {
    router.push({
      pathname: "/(tabs)/(send)/review",
      params: { address },
    });
  };

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter address to send to"
            placeholderTextColor="#999"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
            <Text style={styles.pasteText}>Paste</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.walletLabel}>From</Text>

        <TouchableOpacity style={styles.accountRow}>
          <View style={styles.accountIcon}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.accountName}>Account 1</Text>
            <Text style={styles.accountAddress}>0xc096DeAae62D58AD86A9c3714D1186d7C9b666f0</Text>
          </View>
        </TouchableOpacity>

        {/* Review button appears only when address valid */}
        {isValid && (
          <TouchableOpacity style={styles.reviewBtn} onPress={handleReview}>
            <Text style={styles.reviewText}>Review</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
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
  reviewBtn: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
  },
  reviewText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
