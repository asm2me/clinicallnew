import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { appointmentService } from '@/services/api';
import { format } from 'date-fns';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Video } from 'lucide-react-native';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending:   { bg: '#FEF9C3', text: '#854D0E', label: 'Pending' },
  confirmed: { bg: '#DBEAFE', text: '#1E40AF', label: 'Confirmed' },
  completed: { bg: '#DCFCE7', text: '#166534', label: 'Completed' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
  no_show:   { bg: '#F3F4F6', text: '#6B7280', label: 'No Show' },
};

export default function PatientAppointments() {
  const { data, refetch, isRefetching, isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn:  () => appointmentService.list({ per_page: 30 }).then((r) => r.data),
  });

  const appointments = data?.data ?? [];

  const renderItem = ({ item: apt }: { item: Record<string, unknown> }) => {
    const status = STATUS_STYLES[(apt.status as string)] ?? STATUS_STYLES.pending;
    const doctor = apt.doctor as { user: { name: string } };
    const scheduledAt = apt.scheduled_at as string;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(patient)/appointments/${apt.id as number}`)}
      >
        <View style={styles.cardTop}>
          <View style={styles.docInfo}>
            <View style={styles.docAvatar}>
              <Text style={styles.docAvatarText}>{doctor?.user?.name?.charAt(0) ?? 'D'}</Text>
            </View>
            <View>
              <Text style={styles.docName}>Dr. {doctor?.user?.name}</Text>
              <Text style={styles.aptNum}>{apt.appointment_number as string}</Text>
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Calendar size={13} color="#6B7280" />
            <Text style={styles.metaText}>{format(new Date(scheduledAt), 'EEE, MMM d, yyyy')}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={13} color="#6B7280" />
            <Text style={styles.metaText}>{format(new Date(scheduledAt), 'h:mm a')}</Text>
          </View>
          {(apt.type as string) === 'online' && (
            <View style={styles.metaItem}>
              <Video size={13} color="#6B7280" />
              <Text style={styles.metaText}>Video Call</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push('/(patient)/search')}
        >
          <Text style={styles.bookBtnText}>+ Book</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#2563EB" />}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Calendar size={52} color="#D1D5DB" />
              <Text style={styles.emptyText}>No appointments yet</Text>
              <Text style={styles.emptySubText}>Book your first appointment to get started</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F9FAFB' },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title:          { fontSize: 22, fontWeight: '700', color: '#111827' },
  bookBtn:        { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#2563EB', borderRadius: 10 },
  bookBtnText:    { color: '#fff', fontWeight: '600', fontSize: 13 },
  list:           { padding: 16, paddingTop: 0, gap: 10 },
  card:           { backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  docInfo:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  docAvatar:      { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  docAvatarText:  { color: '#2563EB', fontWeight: '700', fontSize: 15 },
  docName:        { fontSize: 15, fontWeight: '600', color: '#111827' },
  aptNum:         { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  badge:          { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText:      { fontSize: 11, fontWeight: '600' },
  cardMeta:       { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metaItem:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText:       { fontSize: 12, color: '#6B7280' },
  empty:          { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyText:      { fontSize: 17, fontWeight: '600', color: '#9CA3AF' },
  emptySubText:   { fontSize: 13, color: '#D1D5DB', textAlign: 'center' },
});
