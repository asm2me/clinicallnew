import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, Image,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { appointmentService, doctorService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { Calendar, ChevronRight, Clock, Stethoscope } from 'lucide-react-native';

export default function PatientHome() {
  const { user } = useAuthStore();

  const { data: upcomingData, refetch, isRefetching } = useQuery({
    queryKey: ['patient-upcoming'],
    queryFn:  () => appointmentService.list({ status: 'confirmed', per_page: 3 }).then((r) => r.data),
  });

  const { data: doctorsData } = useQuery({
    queryKey: ['public-doctors'],
    queryFn:  () => doctorService.list({ per_page: 6 }).then((r) => r.data),
  });

  const upcoming    = upcomingData?.data ?? [];
  const doctors     = doctorsData?.data  ?? [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#2563EB" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
          </Text>
          <Text style={styles.subGreeting}>How are you feeling today?</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? 'U'}</Text>
        </View>
      </View>

      {/* Book CTA */}
      <TouchableOpacity
        style={styles.bookCta}
        onPress={() => router.push('/(patient)/search')}
      >
        <View style={styles.bookCtaContent}>
          <Text style={styles.bookCtaTitle}>Book an Appointment</Text>
          <Text style={styles.bookCtaSubtitle}>Find doctors & schedule instantly</Text>
        </View>
        <View style={styles.bookCtaIcon}>
          <Stethoscope size={28} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => router.push('/(patient)/appointments')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {upcoming.length === 0 ? (
          <View style={styles.emptyCard}>
            <Calendar size={40} color="#D1D5DB" />
            <Text style={styles.emptyText}>No upcoming appointments</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(patient)/search')}
            >
              <Text style={styles.emptyButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          upcoming.map((apt: { id: number; appointment_number: string; doctor: { user: { name: string } }; scheduled_at: string; status: string; type: string }) => (
            <TouchableOpacity
              key={apt.id}
              style={styles.appointmentCard}
              onPress={() => router.push(`/(patient)/appointments/${apt.id}`)}
            >
              <View style={styles.doctorAvatar}>
                <Text style={styles.doctorAvatarText}>
                  {apt.doctor?.user?.name?.charAt(0) ?? 'D'}
                </Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.doctorName}>Dr. {apt.doctor?.user?.name}</Text>
                <View style={styles.appointmentMeta}>
                  <Clock size={12} color="#6B7280" />
                  <Text style={styles.appointmentTime}>
                    {format(new Date(apt.scheduled_at), 'EEE, MMM d • h:mm a')}
                  </Text>
                </View>
                <View style={[styles.badge, apt.type === 'online' ? styles.badgeOnline : styles.badgeOffline]}>
                  <Text style={styles.badgeText}>{apt.type === 'online' ? '🎥 Video' : '🏥 In Person'}</Text>
                </View>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Featured Doctors */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Doctors</Text>
          <TouchableOpacity onPress={() => router.push('/(patient)/search')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorsScroll}>
          {doctors.map((doc: { id: number; slug: string; name: string; specialization: Record<string, string>; consultation_fee: number }) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.doctorCard}
              onPress={() => router.push(`/(patient)/book?doctorId=${doc.id}`)}
            >
              <View style={styles.doctorCardAvatar}>
                <Text style={styles.doctorCardAvatarText}>{doc.name.charAt(0)}</Text>
              </View>
              <Text style={styles.doctorCardName} numberOfLines={1}>Dr. {doc.name}</Text>
              <Text style={styles.doctorCardSpec} numberOfLines={1}>
                {typeof doc.specialization === 'object' ? doc.specialization.en : doc.specialization}
              </Text>
              <Text style={styles.doctorCardFee}>${doc.consultation_fee}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#F9FAFB' },
  header:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 24 },
  greeting:            { fontSize: 22, fontWeight: '700', color: '#111827' },
  subGreeting:         { fontSize: 14, color: '#6B7280', marginTop: 2 },
  avatar:              { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  avatarText:          { color: '#fff', fontSize: 18, fontWeight: '700' },
  bookCta:             { margin: 20, marginTop: 0, borderRadius: 16, backgroundColor: '#2563EB', padding: 20, flexDirection: 'row', alignItems: 'center', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  bookCtaContent:      { flex: 1 },
  bookCtaTitle:        { fontSize: 18, fontWeight: '700', color: '#fff' },
  bookCtaSubtitle:     { fontSize: 13, color: '#BFDBFE', marginTop: 3 },
  bookCtaIcon:         { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  section:             { paddingHorizontal: 20, marginBottom: 8 },
  sectionHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:        { fontSize: 17, fontWeight: '700', color: '#111827' },
  seeAll:              { fontSize: 14, color: '#2563EB', fontWeight: '500' },
  emptyCard:           { backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  emptyText:           { color: '#9CA3AF', fontSize: 14 },
  emptyButton:         { paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#2563EB', borderRadius: 10 },
  emptyButtonText:     { color: '#fff', fontWeight: '600', fontSize: 14 },
  appointmentCard:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  doctorAvatar:        { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  doctorAvatarText:    { color: '#2563EB', fontSize: 16, fontWeight: '700' },
  appointmentInfo:     { flex: 1 },
  doctorName:          { fontSize: 15, fontWeight: '600', color: '#111827' },
  appointmentMeta:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  appointmentTime:     { fontSize: 12, color: '#6B7280' },
  badge:               { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 6 },
  badgeOnline:         { backgroundColor: '#EFF6FF' },
  badgeOffline:        { backgroundColor: '#F0FDF4' },
  badgeText:           { fontSize: 11, fontWeight: '500', color: '#374151' },
  doctorsScroll:       { marginHorizontal: -4 },
  doctorCard:          { width: 130, backgroundColor: '#fff', borderRadius: 14, padding: 14, marginHorizontal: 6, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  doctorCardAvatar:    { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  doctorCardAvatarText:{ color: '#2563EB', fontSize: 22, fontWeight: '700' },
  doctorCardName:      { fontSize: 13, fontWeight: '600', color: '#111827', textAlign: 'center' },
  doctorCardSpec:      { fontSize: 11, color: '#6B7280', textAlign: 'center', marginTop: 2 },
  doctorCardFee:       { fontSize: 13, fontWeight: '700', color: '#2563EB', marginTop: 6 },
});
