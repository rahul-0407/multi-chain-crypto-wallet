import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import LogoArt from "../../components/LogoArt";

export default function ExportLogo() {
  const shotRef = useRef(null);
  const [uri, setUri] = React.useState<string | null>(null);

  const captureLogo = async () => {
    try {
      const result = await captureRef(shotRef, {
        format: "png",
        quality: 1,
      });

      setUri(result);

      console.log("Image saved at:", result);
      alert("Logo exported successfully!");
    } catch (error) {
      console.log("Error capturing:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Export Your Logo</Text>

      <ViewShot ref={shotRef} style={styles.logoWrapper}>
        <LogoArt />
      </ViewShot>

      <TouchableOpacity style={styles.button} onPress={captureLogo}>
        <Text style={styles.buttonText}>Export as PNG</Text>
      </TouchableOpacity>

      {uri && (
        <View style={{ marginTop: 30 }}>
          <Text style={{ color: "#fff" }}>Preview:</Text>
          <Image
            source={{ uri }}
            style={{ width: 200, height: 200, marginTop: 10, borderRadius: 10 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 30,
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  logoWrapper: {
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#D5FF00",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
  },
});
