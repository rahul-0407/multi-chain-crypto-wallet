// App.js
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.accountSection}>
            <Text style={styles.accountText}>Account 2</Text>
            <Ionicons name="chevron-down" size={18} color="#000" />
          </View>

          <View style={styles.iconsRight}>
            <Ionicons name="copy-outline" size={22} color="#444" />
            <Ionicons name="qr-code-outline" size={22} color="#444" />
            <Ionicons name="notifications-outline" size={22} color="#444" />
            <Ionicons name="menu-outline" size={24} color="#444" />
          </View>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceValue}>$0.00</Text>
          <Text style={styles.balanceChange}>+$0 (+0.00%)</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <ActionButton icon="cash-outline" label="Buy" />
          <ActionButton icon="swap-vertical-outline" label="Swap" />
          <ActionButton icon="send-outline" label="Send" />
          <ActionButton icon="arrow-down-outline" label="Receive" />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <Text style={[styles.tabText, styles.activeTab]}>Tokens</Text>
          <Text style={styles.tabText}>Perps</Text>
          <Text style={styles.tabText}>DeFi</Text>
          <Text style={styles.tabText}>NFTs</Text>
        </View>

        {/* Token Section */}
        <View style={styles.tokenSection}>
          <TouchableOpacity style={styles.networkSelector}>
            <View style={styles.tokenIcon1}>
                <MaterialCommunityIcons name="ethereum" size={12} color="#fff" />
              </View>
            <Text style={styles.networkText}>Ethereum</Text>
            <Ionicons name="chevron-down" size={16} color="#000" />
          </TouchableOpacity>

          <View style={styles.tokenCard}>
            <View style={styles.tokenLeft}>
              <View style={styles.tokenIcon}>
                <MaterialCommunityIcons name="ethereum" size={26} color="#fff" />
              </View>
              <View>
                <Text style={styles.tokenName}>Ethereum</Text>
                <Text style={styles.tokenSub}>
                  0 ETH • <Text style={styles.tokenEarn}>Earn 3.2%</Text>
                </Text>
              </View>
            </View>
            <View style={styles.tokenRight}>
              <Text style={styles.tokenValue}>$0.00</Text>
              <Text style={styles.tokenChange}>-5.90%</Text>
            </View>
          </View>
        </View>

        {/* Fund Section */}
        <View style={styles.fundBox}>
          <Text style={styles.fundText}>
            Fund your wallet to get started in web3
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add funds</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


type ActionButtonProps = {
  icon: keyof typeof Ionicons.glyphMap; // ✅ Dynamically infers all valid icon names
  label: string;
};

const ActionButton = ({ icon, label }: ActionButtonProps) => (
  <TouchableOpacity style={styles.actionButton}>
    <Ionicons name={icon} size={22} color="#000" />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    paddingBottom: 18
    // borderBottom: "2px"
  },
  accountSection: {
    flexDirection: "row",
    alignItems: "center",
    // paddingHorizontal:16
  },
  accountText: {
    fontSize: 18,
    fontWeight: "500",
  },
  iconsRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  balanceContainer: {
    marginTop: 24,
    paddingHorizontal:16,
    // backgroundColor:"brown"
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: "bold",
  },
  balanceChange: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    paddingHorizontal:16,
    // backgroundColor:"blue"
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 13,
    paddingVertical: 14,
    width: "23%",
  },
  actionLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap:20,
    marginTop: 20,
    paddingBottom: 8,
    paddingHorizontal:16,
    // backgroundColor:"red"
  },
  tabText: {
    fontSize: 15,
    color: "#777",
  },
  activeTab: {
    color: "#000",
    fontWeight: "600",
    borderBottomWidth: 2,
    borderColor: "#000",
    paddingBottom: 6,
  },
  tokenSection: {
    marginTop: 15,
    paddingHorizontal:16,
    // backgroundColor:"green"
  },
  networkSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  networkText: {
    fontSize: 14,
    marginRight: 6,
  },
  tokenCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  tokenLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#627EEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tokenIcon1: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: "#627EEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: "600",
  },
  tokenSub: {
    fontSize: 13,
    color: "#666",
  },
  tokenEarn: {
    color: "#2563eb",
  },
  tokenRight: {
    alignItems: "flex-end",
  },
  tokenValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  tokenChange: {
    fontSize: 13,
    color: "red",
  },
  fundBox: {
    marginTop: 30,
    alignItems: "center",
  },
  fundText: {
    color: "#000",
    fontSize: 14,
    marginBottom: 10,
    fontWeight:800
  },
  addButton: {
    backgroundColor: "#000",
    borderRadius: 14,
    paddingVertical: 14,
    width: "90%",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
