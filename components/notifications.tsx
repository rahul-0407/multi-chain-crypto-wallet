import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function NotificationsScreen(): JSX.Element {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: 'Free swaps to mUSD are here',
      message:
        'Swap into mUSD on Ethereum or Linea with zero MetaMask fees until November 17th.',
      date: 'Nov 5',
      read: false,
    },
    {
      id: 2,
      title: 'Multichain accounts are here!',
      message:
        'Trade tokens and track assets across EVM & non-EVM networks from the same account.',
      date: 'Oct 31',
      read: false,
    },
    {
      id: 3,
      title: 'MetaMask Rewards are here!',
      message: 'Level up your trades.',
      date: 'Oct 22',
      read: true,
    },
  ]);

  const handleMarkAllAsRead = (): void => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.map((item) => (
          <View
            key={item.id}
            style={[
              styles.notificationItem,
              { backgroundColor: item.read ? '#fafafa' : '#f4f4ff' },
            ]}
          >
            <Image
              source={{
                uri: 'https://seeklogo.com/images/M/metamask-logo-09EDE53DBD-seeklogo.com.png',
              }}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <View style={styles.row}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleMarkAllAsRead}>
          <Text style={styles.buttonText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  scrollContent: {
    paddingVertical: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 18,
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    flexShrink: 1,
    marginRight: 10,
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  date: {
    fontSize: 13,
    color: '#999',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
