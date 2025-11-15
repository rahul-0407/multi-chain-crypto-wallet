import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useWallet } from "../../hooks/useWallet";

export default function BackupScreen() {
  const router = useRouter();
  const { mnemonic } = useLocalSearchParams<{ mnemonic: string }>();
  const { createWallet } = useWallet();

  const [revealed, setRevealed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const words = mnemonic?.split(" ") || [];

  const handleContinue = async () => {
    // 1️⃣ Must reveal first
    if (!revealed) {
      Alert.alert(
        "Warning",
        "Please reveal and write down your seed phrase first."
      );
      return;
    }

    // 2️⃣ If not confirmed → show alert
    if (!confirmed) {
      Alert.alert(
        "Confirm Backup",
        "Have you safely written down your seed phrase?",
        [
          { text: "Not Yet", style: "cancel" },
          {
            text: "Yes, Continue",
            onPress: () => {
              setLoading(true); // show loading screen

              // heavy wallet creation in background
              setTimeout(async () => {
                await createWallet(mnemonic!);
                setLoading(false);
                router.replace("/");
              }, 50);
            },
          },
        ]
      );

      return;
    }

    // 3️⃣ If confirmed before → skip alert
    setLoading(true);

    setTimeout(async () => {
      await createWallet(mnemonic!);
      setLoading(false);
      router.replace("/");
    }, 50);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* LOADING OVERLAY */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#D5FF00" />
          <Text style={styles.loadingText}>Creating your wallet...</Text>
        </View>
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* TITLE */}
        <View style={styles.header}>
          <Text style={styles.title}>Backup Your Wallet</Text>
          <Text style={styles.subtitle}>
            Write down these 12 words in order and keep them safe
          </Text>
        </View>

        {/* SEED PHRASE BOX */}
        <View style={styles.card}>
          {!revealed ? (
            <View style={styles.revealContainer}>
              <Text style={styles.revealText}>Tap to reveal seed phrase</Text>

              <TouchableOpacity
                style={styles.revealBtn}
                onPress={() => setRevealed(true)}
              >
                <Text style={styles.revealBtnText}>👁 Reveal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.wordsGrid}>
              {words.map((word, index) => (
                <View key={index} style={styles.wordBox}>
                  <Text style={styles.wordNumber}>{index + 1}</Text>
                  <Text style={styles.word}>{word}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* WARNINGS */}
        {revealed && (
          <>
            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>Security Tips</Text>
              <Text style={styles.warningText}>
                • Write these words on paper{"\n"}
                • Never share with anyone{"\n"}
                • Never take screenshots{"\n"}
                • Store in a safe place
              </Text>
            </View>

            {/* CONFIRM CHECKBOX */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setConfirmed(!confirmed)}
            >
              <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
                {confirmed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>
                I have written down my seed phrase
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* CONTINUE BUTTON */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue to Wallet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const neon = "#D5FF00";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    padding: 22,
    paddingBottom: 50,
  },

  /* LOADING OVERLAY */
  loadingOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
  },

  /* HEADER */
  header: {
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 15,
    lineHeight: 20,
  },

  /* MAIN CARD */
  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 24,
  },

  /* REVEAL SECTION */
  revealContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  revealText: {
    color: "#888",
    fontSize: 16,
    marginBottom: 20,
  },
  revealBtn: {
    backgroundColor: neon,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  revealBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  /* WORD GRID */
  wordsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  wordBox: {
    width: "32%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 12,
    alignItems: "center",
  },
  wordNumber: {
    fontSize: 11,
    color: "#777",
    marginBottom: 4,
  },
  word: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },

  /* WARNINGS */
  warningCard: {
    backgroundColor: "#111",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#222",
    padding: 16,
    marginBottom: 20,
  },
  warningTitle: {
    color: neon,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  warningText: {
    color: "#ccc",
    lineHeight: 20,
  },

  /* CHECKBOX */
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: neon,
    borderRadius: 6,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: neon,
  },
  checkmark: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
  },
  checkboxText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  /* CONTINUE BUTTON */
  continueBtn: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  continueText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
  },
});
