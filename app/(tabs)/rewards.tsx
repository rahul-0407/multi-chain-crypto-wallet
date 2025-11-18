import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { useWallet } from "../../hooks/useWallet";

// 🔥 Neon Color
const neon = "#D5FF00";

/* ---------------------------------------
   🔥  Mini Logo Component (Centered in QR)
---------------------------------------- */
function MiniLogo() {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoColumn}>
        <View style={styles.logoSquare} />
        <View style={styles.logoTall} />
      </View>

      <View style={styles.logoColumn}>
        <View style={styles.logoTall} />
        <View style={styles.logoSquare} />
      </View>
    </View>
  );
}

/* ---------------------------------------
            MAIN RECEIVE SCREEN
---------------------------------------- */
export default function ReceiveScreen() {
  const { wallet, selectedChain } = useWallet();
  const [copiedPub, setCopiedPub] = useState(false);
  const [copiedPriv, setCopiedPriv] = useState(false);

  const copyPublic = async () => {
    if (!wallet?.address) return;
    await Clipboard.setStringAsync(wallet.address);
    setCopiedPub(true);
    setTimeout(() => setCopiedPub(false), 1500);
  };

  const copyPrivate = async () => {
    if (!wallet?.privateKey) return;
    await Clipboard.setStringAsync(wallet.privateKey);
    setCopiedPriv(true);
    setTimeout(() => setCopiedPriv(false), 1500);
  };

  const shareAddress = async () => {
    if (!wallet?.address) return;

    await Share.share({
      message: `My ${selectedChain.name} address:\n${wallet.address}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Receive {selectedChain.symbol}</Text>
          <View style={styles.chainBadge}>
            <View
              style={[styles.chainDot, { backgroundColor: selectedChain.color }]}
            />
            <Text style={styles.chainText}>{selectedChain.name}</Text>
          </View>
        </View>

        {/* QR Code */}
        <View style={styles.qrWrapper}>
          import logo from "../../assets/logo.png";

          <QRCode
            value={wallet?.address || ""}
            size={240}
            logo={logo}
            logoSize={70}
            logoBackgroundColor="transparent"
          />

        </View>

        <Text style={styles.scanText}>
          Scan to receive {selectedChain.symbol}
        </Text>

        {/* Public Address */}
        <View style={styles.keyCard}>
          <Text style={styles.keyLabel}>Public Address</Text>

          <View style={styles.keyRow}>
            <Text style={styles.keyText}>{wallet?.address}</Text>

            <TouchableOpacity onPress={copyPublic} style={styles.copyBtn}>
              <Ionicons
                name={copiedPub ? "checkmark" : "copy-outline"}
                size={22}
                color={neon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Private Key (Temporary – Unsafe) */}
        <View style={[styles.keyCard, { borderColor: "#ff5252" }]}>
          <Text style={[styles.keyLabel, { color: "#ff5252" }]}>
            Private Key (Do NOT share)
          </Text>

          <View style={styles.keyRow}>
            <Text style={[styles.keyText, { color: "#ff4444" }]}>
              {wallet?.privateKey}
            </Text>

            <TouchableOpacity onPress={copyPrivate} style={styles.copyBtn}>
              <Ionicons
                name={copiedPriv ? "checkmark" : "copy-outline"}
                size={22}
                color="#ff4444"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={shareAddress}>
          <Ionicons name="share-social-outline" size={22} color="#000" />
          <Text style={styles.shareText}>Share Address</Text>
        </TouchableOpacity>

        {/* Warning Box */}
        <View style={styles.warningCard}>
          <Ionicons name="alert-circle-outline" size={20} color="#1e40af" />
          <Text style={styles.warningText}>
            Only send {selectedChain.symbol} & tokens on{" "}
            {selectedChain.name}. Sending other assets may be lost forever.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------------------------------
                STYLES
---------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { flex: 1, padding: 20 },

  /* Header */
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: "bold", color: "#333" },
  chainBadge: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  chainDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  chainText: { fontSize: 14, fontWeight: "600", color: "#555" },

  /* QR */
  qrWrapper: {
    alignSelf: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    marginBottom: 12,
  },
  scanText: { textAlign: "center", marginBottom: 20, color: "#666" },

  /* Logo inside QR */
  logoContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 2,
    backgroundColor: "transparent",
  },
  logoColumn: { flexDirection: "column", gap: 8 },
  logoSquare: {
    width: 20,
    height: 20,
    backgroundColor: neon,
    borderRadius: 4,
  },
  logoTall: {
    width: 20,
    height: 40,
    backgroundColor: neon,
    borderRadius: 4,
  },

  /* Keys Section */
  keyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  keyLabel: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 8 },
  keyRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  keyText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  copyBtn: {
    padding: 6,
    paddingHorizontal: 8,
  },

  /* Share Button */
  shareButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: neon,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  shareText: { fontSize: 16, fontWeight: "700", color: "#000" },

  /* Warning */
  warningCard: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#e6f0ff",
    borderRadius: 14,
  },
  warningText: {
    flex: 1,
    color: "#1e40af",
    fontSize: 13,
  },
});
