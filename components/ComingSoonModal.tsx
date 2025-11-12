import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ComingSoonModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function ComingSoonModal({
  visible,
  onClose,
  title = "Coming Soon",
  message = "This feature is under development. Stay tuned!",
}: ComingSoonModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Ionicons name="time-outline" size={36} color="#4b6ef5" />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginTop: 12,
  },
  message: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 12,
  },
  button: {
    backgroundColor: "#4b6ef5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
