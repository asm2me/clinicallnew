import { db } from '@/lib/db';

export async function getSettingsData(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  return {
    profile: [
      { label: 'Full Name', value: user.name, note: 'Your display name' },
      { label: 'Email', value: user.email, note: 'Account email' },
      { label: 'Role', value: user.role, note: 'Permission level' },
      { label: 'Member Since', value: user.createdAt.toLocaleDateString(), note: 'Account creation date' }
    ],
    preferences: [
      { label: 'Email Notifications', value: 'Enabled', note: 'Receive appointment reminders' },
      { label: 'Two-Factor Auth', value: 'Disabled', note: 'Enhance account security' },
      { label: 'Dark Mode', value: 'System', note: 'Follow system preference' },
      { label: 'Appointment Reminders', value: 'Enabled', note: '24 hours before' }
    ]
  };
}
