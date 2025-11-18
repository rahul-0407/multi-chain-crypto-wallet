import React from "react";
import { View, StyleSheet } from "react-native";

const neon = "#D5FF00";

export default function LogoArt() {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.row}>
        <View style={styles.block} />
        <View style={styles.blockTall} />
      </View>

      <View style={styles.row}>
        <View style={styles.blockTall} />
        <View style={styles.block} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 20,
  },
  row: {
    flexDirection: "column",
    gap: 14,
  },
  block: {
    width: 70,
    height: 70,
    backgroundColor: neon,
    borderRadius: 8,
  },
  blockTall: {
    width: 70,
    height: 150,
    backgroundColor: neon,
    borderRadius: 8,
  },
});
