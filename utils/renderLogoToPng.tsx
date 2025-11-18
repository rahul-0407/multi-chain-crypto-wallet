import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import LogoArt from "../components/LogoArt";

export function renderLogoToPng() {
  return new Promise<string>((resolve, reject) => {
    let viewRef: any = null;

    const TempShot = () => {
      const shotRef = useRef(null);
      viewRef = shotRef;

      useEffect(() => {
        setTimeout(async () => {
          try {
            const uri = await captureRef(shotRef, {
              format: "png",
              quality: 1,
            });
            resolve(uri);
          } catch (err) {
            reject(err);
          }
        }, 200);
      }, []);

      return (
        <ViewShot ref={shotRef} options={{ format: "png", quality: 1 }}>
          <View style={{ backgroundColor: "transparent" }}>
            <LogoArt />
          </View>
        </ViewShot>
      );
    };

    mountTemp(TempShot);
  });
}

// Invisible DOM renderer (works in Expo too)
let root: any = null;
function mountTemp(Component: any) {
  const { createRoot } = require("react-dom/client");
  if (!root) {
    const div = document.createElement("div");
    div.style.display = "none";
    document.body.appendChild(div);
    root = createRoot(div);
  }
  root.render(<Component />);
}
