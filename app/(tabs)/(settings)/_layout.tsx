// app/(tabs)/settings/_layout.tsx
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // you already have custom headers inside your screens
      }}
    />
  );
}
