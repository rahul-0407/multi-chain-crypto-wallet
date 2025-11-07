// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// export default function SendSelectScreen() {
//   const router = useRouter();

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Send</Text>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="close" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={18} color="#888" />
//         <TextInput
//           placeholder="Search tokens and NFTs"
//           style={styles.searchInput}
//           placeholderTextColor="#999"
//         />
//       </View>

//       <Text style={styles.sectionTitle}>Tokens</Text>

//       <TouchableOpacity
//         style={styles.tokenRow}
//         onPress={() => router.push("/(tabs)/send/amount")}
//       >
//         <View style={styles.tokenIcon}>
//           <Text style={styles.iconText}>S</Text>
//         </View>
//         <View style={styles.tokenDetails}>
//           <Text style={styles.tokenName}>SepoliaETH</Text>
//           <Text style={styles.tokenSub}>SepoliaETH</Text>
//         </View>
//         <View style={styles.tokenAmount}>
//           <Text style={styles.amountText}>$0</Text>
//           <Text style={styles.amountSub}>0.162 SepoliaETH</Text>
//         </View>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 16 },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   title: { fontSize: 22, fontWeight: "700" },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     height: 42,
//   },
//   searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
//   sectionTitle: {
//     fontWeight: "600",
//     color: "#666",
//     marginTop: 16,
//     marginBottom: 10,
//   },
//   tokenRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 12,
//   },
//   tokenIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#e9d8fd",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iconText: { fontWeight: "600" },
//   tokenDetails: { flex: 1, marginLeft: 10 },
//   tokenName: { fontSize: 16, fontWeight: "600" },
//   tokenSub: { fontSize: 13, color: "#666" },
//   tokenAmount: { alignItems: "flex-end" },
//   amountText: { fontWeight: "600" },
//   amountSub: { fontSize: 13, color: "#666" },
// });










// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   TextInput,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// export default function SendAmountScreen() {
//   const router = useRouter();
//   const [amount, setAmount] = useState("");

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Send</Text>
//         <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
//           <Ionicons name="close" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>

//       {/* Amount */}
//       <TextInput
//         style={styles.amountInput}
//         keyboardType="numeric"
//         placeholder="0"
//         placeholderTextColor="#bbb"
//         value={amount}
//         onChangeText={setAmount}
//       />
//       <Text style={styles.tokenLabel}>SepoliaETH</Text>

//       <Text style={styles.availableText}>0.16184 SepoliaETH available</Text>

//       {/* Keypad */}
//       <View style={styles.keypad}>
//         {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"].map(
//           (key) => (
//             <TouchableOpacity
//               key={key}
//               style={styles.key}
//               onPress={() => {
//                 if (key === "⌫") {
//                   setAmount(amount.slice(0, -1));
//                 } else {
//                   setAmount(amount + key);
//                 }
//               }}
//             >
//               <Text style={styles.keyText}>{key}</Text>
//             </TouchableOpacity>
//           )
//         )}
//       </View>

//       <View style={styles.percentRow}>
//         {["25%", "50%", "75%", "Max"].map((p) => (
//           <TouchableOpacity
//             key={p}
//             style={styles.percentButton}
//             onPress={() => router.push("/(tabs)/send/recipient")}
//           >
//             <Text style={styles.percentText}>{p}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 16 },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   title: { fontSize: 22, fontWeight: "700" },
//   amountInput: {
//     fontSize: 46,
//     fontWeight: "700",
//     textAlign: "center",
//     marginTop: 40,
//     color: "#333",
//   },
//   tokenLabel: {
//     textAlign: "center",
//     fontSize: 20,
//     color: "#b3b3b3",
//     marginBottom: 20,
//   },
//   availableText: { textAlign: "center", color: "#777", marginBottom: 40 },
//   keypad: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   key: {
//     width: "30%",
//     marginVertical: 12,
//     alignItems: "center",
//   },
//   keyText: { fontSize: 24, fontWeight: "600" },
//   percentRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginTop: 10,
//   },
//   percentButton: {
//     backgroundColor: "#f5f5f5",
//     borderRadius: 8,
//     paddingVertical: 10,
//     width: "20%",
//     alignItems: "center",
//   },
//   percentText: { fontWeight: "600", color: "#555" },
// });











// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// export default function RecipientScreen() {
//   const router = useRouter();

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Send</Text>
//         <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
//           <Ionicons name="close" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>

//       {/* Input */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           placeholder="Enter address to send to"
//           placeholderTextColor="#999"
//           style={styles.input}
//         />
//         <TouchableOpacity style={styles.pasteButton}>
//           <Text style={styles.pasteText}>Paste</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.walletLabel}>Wallet 1</Text>

//       <TouchableOpacity style={styles.accountRow}>
//         <View style={styles.accountIcon}>
//           <Ionicons name="person" size={20} color="#fff" />
//         </View>
//         <View>
//           <Text style={styles.accountName}>Account 1</Text>
//           <Text style={styles.accountAddress}>0x112E4...17f6C</Text>
//         </View>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 16 },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   title: { fontSize: 22, fontWeight: "700" },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     height: 44,
//     marginVertical: 12,
//   },
//   input: { flex: 1, fontSize: 15 },
//   pasteButton: {
//     backgroundColor: "#eee",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   pasteText: { color: "#000", fontWeight: "600" },
//   walletLabel: { color: "#777", fontWeight: "600", marginVertical: 16 },
//   accountRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   accountIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#ff6600",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   accountName: { fontSize: 15, fontWeight: "600" },
//   accountAddress: { color: "#777", fontSize: 13 },
// });
