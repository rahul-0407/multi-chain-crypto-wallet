// app/(activity)/index.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWallet } from "../../hooks/useWallet";
import { SUPPORTED_CHAINS } from "../../utils/constants";
import { fetchNativeTxs, fetchTokenTxs, explorerTxUrl, explorerAddressUrl } from "../../services/HistoryServices";
import { formatAddress } from "../../utils/formatters";

type TabKey = "Transactions" | "Transfers" | "Perps";

export default function ActivityScreen() {
  const { wallet, selectedChain, setSelectedChain } = useWallet();

  const [activeTab, setActiveTab] = useState<TabKey>("Transactions");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nativeTxs, setNativeTxs] = useState<any[]>([]);
  const [tokenTxs, setTokenTxs] = useState<any[]>([]);

  const address = wallet?.address || "";

  const reload = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setPage(1);
    try {
      const [n, t] = await Promise.all([
        fetchNativeTxs(address, selectedChain.id, 1, 25),
        fetchTokenTxs(address, selectedChain.id, 1, 25),
      ]);
      setNativeTxs(n);
      setTokenTxs(t);
    } finally {
      setLoading(false);
    }
  }, [address, selectedChain.id]);

  useEffect(() => {
  reload();
}, [address, selectedChain.id]);


  const data = useMemo(() => {
    if (activeTab === "Transactions") return nativeTxs;
    if (activeTab === "Transfers") return tokenTxs;
    return []; // Perps placeholder
  }, [activeTab, nativeTxs, tokenTxs]);

  const loadMore = async () => {
  if (loading || !address) return;

  setLoading(true);
  const next = page + 1;

  try {
    if (activeTab === "Transactions") {
      const more = await fetchNativeTxs(address, selectedChain.id, next, 25);
      if (more.length === 0) return;
      setNativeTxs(prev => [...prev, ...more]);
    } else if (activeTab === "Transfers") {
      const more = await fetchTokenTxs(address, selectedChain.id, next, 25);
      if (more.length === 0) return;
      setTokenTxs(prev => [...prev, ...more]);
    }

    setPage(next);
  } finally {
    setLoading(false);
  }
};


  const openExplorerForAddress = () =>
    Linking.openURL(explorerAddressUrl(address, selectedChain.id));

  const renderRow = ({ item }: { item: any }) => {
    if (activeTab === "Transactions") {
      const isSend = item.from?.toLowerCase() === address.toLowerCase();
      const title = isSend ? `Sent ${selectedChain.symbol}` : `Received ${selectedChain.symbol}`;
      const amount = `${item.valueEth} ${selectedChain.symbol}`;
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL(explorerTxUrl(item.hash, selectedChain.id))}
        >
          <View style={styles.rowLeft}>
            <View style={styles.avatar}><Ionicons name={isSend ? "arrow-up" : "arrow-down"} size={14} /></View>
            <View>
              <Text style={styles.rowTitle}>{title}</Text>
              <Text style={styles.rowSub}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.rowAmount}>{amount}</Text>
        </TouchableOpacity>
      );
    } else {
      // Transfers (ERC-20)
      const isSend = item.from?.toLowerCase() === address.toLowerCase();
      const title = isSend ? `Sent ${item.symbol}` : `Received ${item.symbol}`;
      const amount = `${item.value} ${item.symbol}`;
      return (
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL(explorerTxUrl(item.hash, selectedChain.id))}
        >
          <View style={styles.rowLeft}>
            <View style={styles.avatar}><Ionicons name={isSend ? "arrow-up" : "arrow-down"} size={14} /></View>
            <View>
              <Text style={styles.rowTitle}>{title}</Text>
              <Text style={styles.rowSub}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.rowAmount}>{amount}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>

        {/* Network selector like the screenshot */}
        <View style={styles.chainPicker}>
          <Ionicons name="ellipse" size={10} color={selectedChain.color} />
          <Text style={styles.chainText}>{selectedChain.name}</Text>
          <Ionicons name="chevron-down" size={16} />
          {/* Simple sheet: cycle chains on tap (keep it lightweight) */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => {
              const idx = SUPPORTED_CHAINS.findIndex(c => c.id === selectedChain.id);
              const next = SUPPORTED_CHAINS[(idx + 1) % SUPPORTED_CHAINS.length];
              setSelectedChain(next);
            }}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(["Transactions", "Transfers", "Perps"] as TabKey[]).map((k) => (
          <TouchableOpacity key={k} onPress={() => setActiveTab(k)}>
            <Text style={[styles.tab, activeTab === k && styles.tabActive]}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading && data.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(it: any, i) => it.hash ? it.hash : String(i)}
          renderItem={renderRow}
          onEndReachedThreshold={0.6}
          onEndReached={loadMore}
          ListHeaderComponent={
            data.length > 0 ? (
              <Text style={styles.timeNote}>
                {/** Example top note like MetaMask */}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={{ padding: 20 }}>
              <Text style={{ color: "#666" }}>No activity yet.</Text>
            </View>
          }
        />
      )}

      {/* Explorer link */}
      <TouchableOpacity style={styles.explorer} onPress={openExplorerForAddress}>
        <Text style={styles.explorerText}>View full history on Etherscan</Text>
      </TouchableOpacity>

      {/* Legal footnote like screenshot */}
      <View style={styles.footnote}>
        <Text style={styles.footTxt}>
          Market data is provided by third-party sources, including CoinGecko.
          Such content is for informational purposes and should not be treated as advice.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    timeNote: { 
  paddingHorizontal: 16, 
  paddingTop: 10,
  paddingBottom: 4,
  color: "#666",
  fontSize: 12 
},

  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  chainPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1, borderColor: "#e9e9e9",
    borderRadius: 10,
  },
  chainText: { fontWeight: "600" },

  tabs: {
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 24,
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#f2f2f2",
  },
  tab: { color: "#6b7280", fontWeight: "600" },
  tabActive: { color: "#000", borderBottomWidth: 2, borderColor: "#000", paddingBottom: 6 },

  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1, borderBottomColor: "#f5f5f5",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "#eef2ff", alignItems: "center", justifyContent: "center",
  },
  rowTitle: { fontWeight: "700" },
  rowSub: { color: "#16a34a", marginTop: 2 },
  rowAmount: { fontWeight: "600" },

  explorer: { alignItems: "center", paddingVertical: 16 },
  explorerText: { color: "#2563eb", fontWeight: "600" },

  footnote: { paddingHorizontal: 16, paddingBottom: 20 },
  footTxt: { color: "#666", fontSize: 12, lineHeight: 18 },
});
