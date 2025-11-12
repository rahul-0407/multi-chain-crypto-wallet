// app/(activity)/index.tsx
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWallet } from "../../hooks/useWallet";
import { SUPPORTED_CHAINS } from "../../utils/constants";
import {
  fetchNativeTxs,
  fetchTokenTxs,
  explorerTxUrl,
  explorerAddressUrl,
} from "../../services/HistoryServices";

type TabKey = "Transactions" | "Transfers" | "Perps";

export default function ActivityScreen() {
  const { wallet, selectedChain, setSelectedChain } = useWallet();
  const [activeTab, setActiveTab] = useState<TabKey>("Transactions");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [nativeTxs, setNativeTxs] = useState<any[]>([]);
  const [tokenTxs, setTokenTxs] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const onEndReachedCalledDuringMomentum = useRef(false);
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
    return [];
  }, [activeTab, nativeTxs, tokenTxs]);

  const loadMore = async () => {
    if (loading || !address) return;
    setLoading(true);
    const next = page + 1;
    try {
      if (activeTab === "Transactions") {
        const more = await fetchNativeTxs(address, selectedChain.id, next, 25);
        if (more.length > 0) setNativeTxs((prev) => [...prev, ...more]);
      } else if (activeTab === "Transfers") {
        const more = await fetchTokenTxs(address, selectedChain.id, next, 25);
        if (more.length > 0) setTokenTxs((prev) => [...prev, ...more]);
      }
      setPage(next);
    } finally {
      setLoading(false);
    }
  };

  const openExplorerForAddress = () =>
    Linking.openURL(explorerAddressUrl(address, selectedChain.id));

  const renderRow = ({ item }: { item: any }) => {
    const isSend = item.from?.toLowerCase() === address.toLowerCase();
    const title = isSend
      ? `Sent ${selectedChain.symbol}`
      : `Received ${selectedChain.symbol}`;
    const amount = `${item.valueEth} ${selectedChain.symbol}`;

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          Linking.openURL(explorerTxUrl(item.hash, selectedChain.id))
        }
      >
        <View style={styles.rowLeft}>
          <View style={styles.avatar}>
            <Ionicons
              name={isSend ? "arrow-up" : "arrow-down"}
              size={16}
              color={isSend ? "#ef4444" : "#16a34a"}
            />
          </View>
          <View>
            <Text style={styles.rowTitle}>{title}</Text>
            <Text style={styles.rowSub}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.rowAmount}>{amount}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity
          style={styles.chainPicker}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="ellipse" size={10} color={selectedChain.color} />
          <Text style={styles.chainText}>{selectedChain.name}</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(["Transactions", "Transfers", "Perps"] as TabKey[]).map((k) => (
          <TouchableOpacity key={k} onPress={() => setActiveTab(k)}>
            <Text style={[styles.tab, activeTab === k && styles.tabActive]}>
              {k}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading && data.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(it: any, i) => it.hash || String(i)}
          renderItem={renderRow}
          onEndReachedThreshold={0.6}
          onEndReached={() => {
            if (!onEndReachedCalledDuringMomentum.current) {
              loadMore();
              onEndReachedCalledDuringMomentum.current = true;
            }
          }}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          ListEmptyComponent={
            <View style={{ padding: 20 }}>
              <Text style={{ color: "#666" }}>No activity yet.</Text>
            </View>
          }
        />
      )}

      {/* Account info */}
      <View style={styles.infoSection}>
        <Ionicons name="information-circle-outline" size={16} color="#666" />
        <View>
          <Text style={styles.infoTitle}>Account added to this device</Text>
          <Text style={styles.infoDate}>Sept 20 at 8:18 pm</Text>
        </View>
      </View>

      {/* Explorer link */}
      <TouchableOpacity style={styles.explorer} onPress={openExplorerForAddress}>
        <Text style={styles.explorerText}>View full history on Etherscan</Text>
      </TouchableOpacity>

      {/* Legal footnote */}
      <View style={styles.footnote}>
        <Text style={styles.footTxt}>
          Market data is provided by one or more third-party data sources,
          including CoinGecko. Such content is for informational purposes and
          should not be treated as advice.
        </Text>
      </View>

      {/* ✅ Network Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Networks</Text>
          <FlatList
            data={SUPPORTED_CHAINS}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.chainItem,
                  item.id === selectedChain.id && styles.chainItemActive,
                ]}
                onPress={() => {
                  setSelectedChain(item);
                  setModalVisible(false);
                }}
              >
                <Ionicons name="ellipse" size={14} color={item.color} />
                <Text style={styles.chainItemText}>{item.name}</Text>
                {item.id === selectedChain.id && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color="#4b6ef5"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 21,
    paddingBottom: 12,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  chainPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chainText: { fontWeight: "600" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  tab: { color: "#888", fontWeight: "600" },
  tabActive: {
    color: "#000",
    borderBottomWidth: 2,
    borderColor: "#4b6ef5",
    paddingBottom: 6,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontWeight: "700" },
  rowSub: { color: "#16a34a", marginTop: 2 },
  rowAmount: { fontWeight: "600" },
  infoSection: {
    backgroundColor: "#f8f8f8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoTitle: { color: "#444", fontWeight: "600" },
  infoDate: { color: "#666", fontSize: 13 },
  explorer: { alignItems: "center", paddingVertical: 16 },
  explorerText: { color: "#2563eb", fontWeight: "600" },
  footnote: { paddingHorizontal: 16, paddingBottom: 20 },
  footTxt: { color: "#666", fontSize: 12, lineHeight: 18 },

  // ✅ Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginVertical: 8,
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },
  chainItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  chainItemActive: {
    backgroundColor: "#f1f5ff",
  },
  chainItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#000",
  },
});
