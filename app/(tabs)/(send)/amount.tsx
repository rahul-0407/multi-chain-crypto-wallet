// app/(tabs)/(send)/amount.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AmountScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(false);

  const available = 0.16184;
  const currency = "SepoliaETH";

  const handleContinue = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0 || value > available) {
      setError(true);
      return;
    }
    setError(false);
    router.push("/(tabs)/(send)/recipient");
  };

  const handleInput = (value: string) => {
    // allow only digits and decimal
    if (/^[0-9.]*$/.test(value)) {
      setAmount(value);
      setError(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Amount Input */}
      <View style={styles.amountContainer}>
        <TextInput
          style={[
            styles.amountInput,
            error ? styles.errorText : styles.normalText,
          ]}
          placeholder={`0 ${currency}`}
          placeholderTextColor="#ccc"
          value={amount}
          onChangeText={handleInput}
          keyboardType="decimal-pad"
        />
        <Text
          style={[
            styles.currencyText,
            { color: error ? "#d32f2f" : "#b0b3c0" },
          ]}
        >
          {currency}
        </Text>
      </View>

      {/* Balance Info */}
      <Text style={styles.balanceText}>{available} {currency} available</Text>

      {/* Error or Continue Button */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        {error ? (
          <View style={[styles.actionButton, styles.errorButton]}>
            <Text style={styles.errorButtonText}>Invalid value</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor:
                  amount && parseFloat(amount) > 0 ? "#3B5BFF" : "#e8e8e8",
              },
            ]}
            disabled={!amount || parseFloat(amount) <= 0}
            onPress={handleContinue}
          >
            <Text
              style={[
                styles.continueText,
                {
                  color:
                    amount && parseFloat(amount) > 0 ? "#fff" : "#888",
                },
              ]}
            >
              Continue
            </Text>
          </TouchableOpacity>
        )}

        {/* Keypad Grid */}
        <View style={styles.keypadContainer}>
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            [".", "0", "back"],
          ].map((row, rowIndex) => (
            <View style={styles.keypadRow} key={rowIndex}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.key}
                  onPress={() => {
                    if (key === "back") {
                      setAmount(amount.slice(0, -1));
                    } else {
                      handleInput(amount + key);
                    }
                  }}
                >
                  {key === "back" ? (
                    <Ionicons
                      name="backspace-outline"
                      size={22}
                      color="#000"
                    />
                  ) : (
                    <Text style={styles.keyText}>{key}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  amountContainer: {
    alignItems: "center",
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  amountInput: {
    fontSize: 52,
    fontWeight: "700",
    textAlign: "right",
  },
  currencyText: {
    fontSize: 40,
    fontWeight: "700",
    marginLeft: 6,
  },
  normalText: {
    color: "#b0b3c0",
  },
  errorText: {
    color: "#d32f2f",
  },
  balanceText: {
    textAlign: "center",
    fontSize: 14,
    color: "#8a8a8a",
    marginTop: 12,
  },
  keyboardContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  actionButton: {
    width: "90%",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  continueText: {
    fontSize: 16,
    fontWeight: "600",
  },
  errorButton: {
    backgroundColor: "#d32f2f",
  },
  errorButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  keypadContainer: {
    width: "90%",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  key: {
    width: "30%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  keyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
});
