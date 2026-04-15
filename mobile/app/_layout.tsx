import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '@/store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
});

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

export default function RootLayout() {
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
    registerForPushNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)"    options={{ headerShown: false }} />
            <Stack.Screen name="(patient)" options={{ headerShown: false }} />
            <Stack.Screen name="(doctor)"  options={{ headerShown: false }} />
            <Stack.Screen name="(admin)"   options={{ headerShown: false }} />
          </Stack>
          <Toast />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

async function registerForPushNotifications(): Promise<void> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  if (token) {
    try {
      const { authService } = await import('@/services/api');
      await authService.updateFcm(token);
    } catch {}
  }
}
