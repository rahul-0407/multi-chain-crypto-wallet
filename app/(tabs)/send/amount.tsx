import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SendAmountScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");

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

      {/* Amount */}
      <TextInput
        style={styles.amountInput}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor="#bbb"
        value={amount}
        onChangeText={setAmount}
      />
      <Text style={styles.tokenLabel}>SepoliaETH</Text>

      <Text style={styles.availableText}>0.16184 SepoliaETH available</Text>

      {/* Keypad */}
      <View style={styles.keypad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"].map(
          (key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => {
                if (key === "⌫") {
                  setAmount(amount.slice(0, -1));
                } else {
                  setAmount(amount + key);
                }
              }}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.percentRow}>
        {["25%", "50%", "75%", "Max"].map((p) => (
          <TouchableOpacity
            key={p}
            style={styles.percentButton}
            onPress={() => router.push("/(tabs)/send/recipient")}
          >
            <Text style={styles.percentText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  amountInput: {
    fontSize: 46,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 40,
    color: "#333",
  },
  tokenLabel: {
    textAlign: "center",
    fontSize: 20,
    color: "#b3b3b3",
    marginBottom: 20,
  },
  availableText: { textAlign: "center", color: "#777", marginBottom: 40 },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  key: {
    width: "30%",
    marginVertical: 12,
    alignItems: "center",
  },
  keyText: { fontSize: 24, fontWeight: "600" },
  percentRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  percentButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 10,
    width: "20%",
    alignItems: "center",
  },
  percentText: { fontWeight: "600", color: "#555" },
});