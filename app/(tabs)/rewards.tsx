import React, { useState, useEffect } from "react";
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
import { renderLogoToPng } from "../../utils/renderLogoToPng";

const neon = "#D5FF00";

export default function ReceiveScreen() {
  const { wallet, selectedChain } = useWallet();
  const [logoUri, setLogoUri] = useState<string | null>(null);

  // Load PNG version of logo
  useEffect(() => {
    async function load() {
      const uri = await renderLogoToPng();
      setLogoUri(uri);
    }
    load();
  }, []);

  // Handle wallet null state
  if (!wallet) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ marginTop: 40, textAlign: "center" }}>
          Loading wallet...
        </Text>
      </SafeAreaView>
    );
  }

  const [copiedPub, setCopiedPub] = useState(false);
  const [copiedPriv, setCopiedPriv] = useState(false);

  const copyPublic = async () => {
    await Clipboard.setStringAsync(wallet.address);
    setCopiedPub(true);
    setTimeout(() => setCopiedPub(false), 1500);
  };

  const copyPrivate = async () => {
    await Clipboard.setStringAsync(wallet.privateKey);
    setCopiedPriv(true);
    setTimeout(() => setCopiedPriv(false), 1500);
  };

  const shareAddress = async () => {
    await Share.share({
      message: `My ${selectedChain.name} Address:\n${wallet.address}`,
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
          <QRCode
            value={wallet.address}
            size={240}
            logo={logoUri ? { uri: logoUri } : undefined}
            logoSize={70}
            logoBackgroundColor="transparent"
          />
        </View>

        <Text style={styles.scanText}>Scan to receive {selectedChain.symbol}</Text>

        {/* Public key */}
        <View style={styles.keyCard}>
          <Text style={styles.keyLabel}>Public Address</Text>
          <View style={styles.keyRow}>
            <Text style={styles.keyText}>{wallet.address}</Text>
            <TouchableOpacity onPress={copyPublic} style={styles.copyBtn}>
              <Ionicons
                name={copiedPub ? "checkmark" : "copy-outline"}
                size={22}
                color={neon}
              />
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
            Only send {selectedChain.symbol} on {selectedChain.name}.  
            Sending assets on other chains may be lost forever.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { flex: 1, padding: 20 },
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

  qrWrapper: {
    alignSelf: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 4,
    marginBottom: 12,
  },
  scanText: { textAlign: "center", marginBottom: 20, color: "#666" },

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
  copyBtn: { padding: 6 },

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

  warningCard: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#e6f0ff",
    borderRadius: 14,
  },
  warningText: { flex: 1, color: "#1e40af", fontSize: 13 },
});
