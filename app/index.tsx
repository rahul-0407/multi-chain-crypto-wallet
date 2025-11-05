import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useWallet } from '../hooks/useWallet';

export default function Index() {
  const { wallet, isInitialized } = useWallet();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!wallet && !inAuthGroup) {
      // Not logged in, redirect to onboarding
      router.replace('/(auth)/onboarding');
    } else if (wallet && !inTabsGroup) {
      // Logged in, redirect to dashboard
      router.replace('/(tabs)');
    }
  }, [wallet, isInitialized, segments]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}