import type { AppRole } from '@/lib/auth';

export type DashboardSection =
  | 'overview'
  | 'appointments'
  | 'patients'
  | 'clinics'
  | 'users'
  | 'analytics'
  | 'settings'
  | 'tenants';

const SECTION_ACCESS: Record<DashboardSection, readonly AppRole[]> = {
  overview: ['SUPER_ADMIN', 'TENANT_ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'],
  appointments: ['SUPER_ADMIN', 'TENANT_ADMIN', 'DOCTOR', 'STAFF'],
  patients: ['SUPER_ADMIN', 'TENANT_ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'],
  clinics: ['SUPER_ADMIN', 'TENANT_ADMIN', 'DOCTOR', 'STAFF'],
  users: ['SUPER_ADMIN', 'TENANT_ADMIN'],
  analytics: ['SUPER_ADMIN', 'TENANT_ADMIN', 'DOCTOR', 'STAFF'],
  settings: ['SUPER_ADMIN', 'TENANT_ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'],
  tenants: ['SUPER_ADMIN'],
};

export function canAccessDashboardSection(role: AppRole, section: DashboardSection): boolean {
  return SECTION_ACCESS[section].includes(role);
}

export function canManageAppointments(role: AppRole): boolean {
  return canAccessDashboardSection(role, 'appointments');
}

export function canManagePatients(role: AppRole): boolean {
  return role !== 'PATIENT';
}

export function canViewPatients(role: AppRole): boolean {
  return canAccessDashboardSection(role, 'patients');
}

export function canViewClinics(role: AppRole): boolean {
  return canAccessDashboardSection(role, 'clinics');
}

export function canManageClinics(role: AppRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'TENANT_ADMIN';
}

export function canViewAnalytics(role: AppRole): boolean {
  return canAccessDashboardSection(role, 'analytics');
}

export function canManageUsers(role: AppRole): boolean {
  return canAccessDashboardSection(role, 'users');
}

export function canManageTenants(role: AppRole): boolean {
  return canAccessDashboardSection(role, 'tenants');
}

export const dashboardSectionAccess = SECTION_ACCESS;
