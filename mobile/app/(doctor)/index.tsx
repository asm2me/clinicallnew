import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { appointmentService } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, Video } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const { data: todayData, refetch, isRefetching } = useQuery({
    queryKey: ['doctor-today'],
    queryFn:  () => appointmentService.today().then((r) => r.data),
  });

  const confirm = useMutation({
    mutationFn: (id: number) => appointmentService.confirm(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor-today'] });
      Toast.show({ type: 'success', text1: 'Appointment confirmed!' });
    },
  });

  const complete = useMutation({
    mutationFn: (id: number) => appointmentService.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor-today'] });
      Toast.show({ type: 'success', text1: 'Appointment completed!' });
    },
  });

  const todayApts = todayData?.data ?? [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#2563EB" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Dr. {user?.name?.split(' ')[0]}</Text>
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d, yyyy')}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: "Today's", value: todayApts.length, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Pending',  value: todayApts.filter((a: { status: string }) => a.status === 'pending').length,   color: '#D97706', bg: '#FFFBEB' },
          { label: 'Done',     value: todayApts.filter((a: { status: string }) => a.status === 'completed').length, color: '#059669', bg: '#ECFDF5' },
        ].map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: s.color }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Today's Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Queue</Text>
        {todayApts.length === 0 ? (
          <View style={styles.emptyCard}>
            <CheckCircle size={36} color="#D1D5DB" />
            <Text style={styles.emptyText}>No appointments today</Text>
          </View>
        ) : (
          todayApts.map((apt: {
            id: number;
            patient: { user: { name: string } };
            scheduled_at: string;
            status: string;
            type: string;
            service?: { name: Record<string, string> };
          }) => (
            <View key={apt.id} style={styles.aptCard}>
              <View style={styles.aptLeft}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientAvatarText}>{apt.patient?.user?.name?.charAt(0) ?? 'P'}</Text>
                </View>
                <View>
                  <Text style={styles.patientName}>{apt.patient?.user?.name}</Text>
                  <View style={styles.aptMeta}>
                    <Clock size={11} color="#6B7280" />
                    <Text style={styles.aptTime}>{format(new Date(apt.scheduled_at), 'h:mm a')}</Text>
                    {apt.type === 'online' && <Video size={11} color="#6B7280" />}
                  </View>
                  {apt.service && (
                    <Text style={styles.aptService}>{apt.service.name?.en ?? apt.service.name}</Text>
                  )}
                </View>
              </View>

              <View style={styles.aptActions}>
                {apt.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => confirm.mutate(apt.id)}
                    disabled={confirm.isPending}
                  >
                    <CheckCircle size={16} color="#fff" />
                    <Text style={styles.confirmBtnText}>Confirm</Text>
                  </TouchableOpacity>
                )}
                {apt.status === 'confirmed' && (
                  <TouchableOpacity
                    style={styles.completeBtn}
                    onPress={() => complete.mutate(apt.id)}
                    disabled={complete.isPending}
                  >
                    <Text style={styles.completeBtnText}>Done ✓</Text>
                  </TouchableOpacity>
                )}
                {apt.status === 'completed' && (
                  <View style={styles.doneChip}>
                    <Text style={styles.doneChipText}>Completed</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#F9FAFB' },
  header:             { padding: 20 },
  greeting:           { fontSize: 22, fontWeight: '700', color: '#111827' },
  date:               { fontSize: 13, color: '#6B7280', marginTop: 2 },
  statsRow:           { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 20 },
  statCard:           { flex: 1, padding: 14, borderRadius: 14, alignItems: 'center' },
  statValue:          { fontSize: 26, fontWeight: '800' },
  statLabel:          { fontSize: 11, fontWeight: '500', marginTop: 2 },
  section:            { paddingHorizontal: 20 },
  sectionTitle:       { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 12 },
  emptyCard:          { backgroundColor: '#fff', borderRadius: 14, padding: 40, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  emptyText:          { color: '#9CA3AF', fontSize: 14 },
  aptCard:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  aptLeft:            { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  patientAvatar:      { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  patientAvatarText:  { fontWeight: '700', color: '#374151', fontSize: 15 },
  patientName:        { fontSize: 15, fontWeight: '600', color: '#111827' },
  aptMeta:            { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  aptTime:            { fontSize: 12, color: '#6B7280' },
  aptService:         { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  aptActions:         { gap: 6 },
  confirmBtn:         { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  confirmBtnText:     { color: '#fff', fontWeight: '600', fontSize: 12 },
  completeBtn:        { backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  completeBtnText:    { color: '#fff', fontWeight: '600', fontSize: 12 },
  doneChip:           { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  doneChipText:       { color: '#166534', fontWeight: '600', fontSize: 11 },
});
