import { Stack } from 'expo-router';
import 'react-native-get-random-values';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="backup" />
    </Stack>
  );
}