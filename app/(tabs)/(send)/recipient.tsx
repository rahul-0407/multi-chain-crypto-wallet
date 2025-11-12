// app/(send)/RecipientScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { ethers } from "ethers";
import ChainManager from "../../../services/ChainManager";
import { useLocalSearchParams } from "expo-router";

export default function RecipientScreen() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "invalid" | "validating" | "valid">("idle");

  const params = useLocalSearchParams();
  const amountParam = Array.isArray(params.amount)
    ? params.amount[0]
    : (params.amount as string | undefined);

  const chainId = 11155111; // Sepolia for now
  const provider = ChainManager.getProvider(chainId);

  // 🧠 Address validation function
  const validateAddress = async (addr: string) => {
    if (!ethers.utils.isAddress(addr)) return false;
    try {
      const code = await provider.getCode(addr);
      const balance = await provider.getBalance(addr);
      return code !== "0x" || balance.gt(0);
    } catch {
      return false;
    }
  };

  // 📋 Paste button
  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    setAddress(text.trim());
  };

  // 🕹️ Auto validation logic
  useEffect(() => {
    const checkAddress = async () => {
      if (address.length === 42) {
        setStatus("validating");
        setLoading(true);
        const exists = await validateAddress(address.trim());
        if (exists) {
          setStatus("valid");
          setTimeout(() => {
            router.push({
              pathname: "/(tabs)/(send)/review",
              params: { address, amount: amountParam },
            });

          }, 500);
        } else {
          setStatus("invalid");
        }
        setLoading(false);
      } else if (address.length > 0 && address.length < 42) {
        setStatus("invalid");
      } else {
        setStatus("idle");
      }
    };

    checkAddress();
  }, [address]);

  // 🧭 Button state renderer
  const renderButton = () => {
    if (status === "idle") return null;
    if (status === "invalid") {
      return (
        <View style={[styles.actionBtn, { backgroundColor: "#e11d48" }]}>
          <Text style={styles.btnText}>Invalid Address</Text>
        </View>
      );
    }
    if (status === "validating") {
      return (
        <View style={[styles.actionBtn, { backgroundColor: "#666" }]}>
          <ActivityIndicator color="#fff" />
        </View>
      );
    }
    if (status === "valid") {
      return (
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#000" }]}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(send)/review",
              params: { address, amount: amountParam },
            })
          }
        >
          <Text style={styles.btnText}>Review</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Send</Text>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Input Field */}
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
            <Text style={styles.accountAddress}>
              0xc096DeAae62D58AD86A9c3714D1186d7C9b666f0
            </Text>
          </View>
        </TouchableOpacity>

        {/* Dynamic button at bottom */}
        {renderButton()}
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
  actionBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
