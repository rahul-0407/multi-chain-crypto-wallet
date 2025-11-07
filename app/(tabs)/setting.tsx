// app/(tabs)/settings.tsx
import { Redirect } from "expo-router";

export default function SettingsTab() {
  // Redirect the tab to /settings (the folder that contains the actual stack)
  return <Redirect href="/(settings)" />;
}
