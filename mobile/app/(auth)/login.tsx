import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '', tenantId: '' });

  const handleLogin = async () => {
    if (!form.email || !form.password || !form.tenantId) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields.' });
      return;
    }
    try {
      await login(form.email, form.password, form.tenantId);
      router.replace('/');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed. Check your credentials.';
      Toast.show({ type: 'error', text1: message });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🏥</Text>
          </View>
          <Text style={styles.title}>ClinicPro</Text>
          <Text style={styles.subtitle}>Sign in to your clinic account</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Clinic ID</Text>
            <TextInput
              style={styles.input}
              placeholder="your-clinic-id"
              value={form.tenantId}
              onChangeText={(v) => setForm((f) => ({ ...f, tenantId: v }))}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="doctor@clinic.com"
              value={form.email}
              onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={form.password}
              onChangeText={(v) => setForm((f) => ({ ...f, password: v }))}
              secureTextEntry
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? 'Signing in…' : 'Sign In'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.linkText}>Don't have an account? <Text style={styles.link}>Register</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#F9FAFB' },
  scroll:          { flexGrow: 1, padding: 24, justifyContent: 'center' },
  logoContainer:   { alignItems: 'center', marginBottom: 40 },
  logo:            { width: 72, height: 72, borderRadius: 20, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  logoText:        { fontSize: 32 },
  title:           { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle:        { fontSize: 14, color: '#6B7280' },
  form:            { gap: 16 },
  inputGroup:      { gap: 6 },
  label:           { fontSize: 14, fontWeight: '500', color: '#374151' },
  input:           { height: 48, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 16, backgroundColor: '#fff', fontSize: 15, color: '#111827' },
  button:          { height: 52, backgroundColor: '#2563EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 6 },
  buttonDisabled:  { opacity: 0.7 },
  buttonText:      { color: '#fff', fontSize: 16, fontWeight: '600' },
  linkButton:      { alignItems: 'center', marginTop: 8 },
  linkText:        { fontSize: 14, color: '#6B7280' },
  link:            { color: '#2563EB', fontWeight: '600' },
});
