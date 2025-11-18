import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";

import { useWallet } from "../../hooks/useWallet";

// Your PNG logo
import logo from "../../assets/images/logo.png";

const neon = "#D5FF00";

export default function ReceiveScreen() {
  const router = useRouter();
  const { wallet, selectedChain } = useWallet();

  if (!wallet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </SafeAreaView>
    );
  }

  const copyPublic = async () => {
    await Clipboard.setStringAsync(wallet.address);
  };

  const copyPrivate = async () => {
    await Clipboard.setStringAsync(wallet.privateKey);
  };

  const shareAddress = async () => {
    Share.share({
      message: `My ${selectedChain.name} address:\n${wallet.address}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Receive</Text>

        {/* Close Button */}
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Ionicons name="close" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* SUB HEADER */}
      <View style={styles.subHeader}>
        <View style={styles.chainBadge}>
          <View
            style={[
              styles.chainDot,
              { backgroundColor: selectedChain.color },
            ]}
          />
          <Text style={styles.chainText}>{selectedChain.name}</Text>
        </View>
      </View>

      {/* QR Code */}
      <View style={styles.qrWrapper}>
        <QRCode
          value={wallet.address}
          size={240}
          logo={logo}
          logoSize={50}
          logoBackgroundColor="transparent"
        />
      </View>

      <Text style={styles.scanText}>Scan to receive {selectedChain.symbol}</Text>

      {/* Public Address */}
      <View style={styles.keyCard}>
        <Text style={styles.keyLabel}>Public Address</Text>

        <View style={styles.keyRow}>
          <Text style={styles.keyText}>{wallet.address}</Text>

          <TouchableOpacity onPress={copyPublic}>
            <Ionicons name="copy-outline" size={22} color={neon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Private Key */}
      <View style={[styles.keyCard, { borderColor: "#ff5252" }]}>
        <Text style={[styles.keyLabel, { color: "#ff5252" }]}>
          Private Key (Do NOT share)
        </Text>

        <View style={styles.keyRow}>
          <Text style={[styles.keyText, { color: "#ff4444" }]}>
            {wallet.privateKey}
          </Text>

          <TouchableOpacity onPress={copyPrivate}>
            <Ionicons name="copy-outline" size={22} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Share */}
      <TouchableOpacity style={styles.shareButton} onPress={shareAddress}>
        <Ionicons name="share-social-outline" size={22} color="#000" />
        <Text style={styles.shareText}>Share Address</Text>
      </TouchableOpacity>

      {/* Warning */}
      <View style={styles.warningCard}>
        <Ionicons name="alert-circle-outline" size={20} color="#1e40af" />
        <Text style={styles.warningText}>
          Only send {selectedChain.symbol}. Sending assets on other chains may be lost forever.
        </Text>
      </View>
    </SafeAreaView>
  );
}

/* ------------------- STYLES ------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  loadingText: {
    color: "#333",
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
  },

  /* Header = Same Style As SEND Screen */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
  },

  title: { fontSize: 22, fontWeight: "700" },

  /* Sub Header */
  subHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },

  chainBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  chainDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  chainText: { fontSize: 14, fontWeight: "600" },

  /* QR */
  qrWrapper: {
    alignSelf: "center",
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 12,
  },

  scanText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },

  /* Cards */
  keyCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  keyLabel: {
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
  },

  keyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  keyText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    marginRight: 10,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },

  /* Share Button */
  shareButton: {
    flexDirection: "row",
    backgroundColor: neon,
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  shareText: { color: "#000", fontWeight: "700", marginLeft: 8 },

  /* Warning Box */
  warningCard: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: "#e6f0ff",
    borderRadius: 14,
  },

  warningText: {
    flex: 1,
    color: "#1e40af",
    fontSize: 13,
    marginLeft: 10,
  },
});
