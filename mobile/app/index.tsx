import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { View, ActivityIndicator } from 'react-native';

export default function IndexScreen() {
  const { isAuthenticated, user, hydrated } = useAuthStore();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/auth/login" />;

  // Route by role
  const role = user?.role ?? '';
  if (role === 'doctor')       return <Redirect href="/(doctor)" />;
  if (role === 'clinic_admin') return <Redirect href="/(admin)" />;

  return <Redirect href="/(patient)" />;
}
