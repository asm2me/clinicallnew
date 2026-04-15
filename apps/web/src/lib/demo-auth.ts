export const DEMO_ROLES = ['Super Admin', 'Tenant Admin', 'Doctor', 'Staff', 'Patient'] as const;

export type DemoRole = (typeof DEMO_ROLES)[number];

export type DemoCredentials = {
  role: DemoRole;
  label: string;
  email: string;
  password: string;
  description: string;
};

export const DEMO_CREDENTIALS: DemoCredentials[] = [
  {
    role: 'Super Admin',
    label: 'Super Admin',
    email: 'superadmin@clinicall.demo',
    password: 'demo1234',
    description: 'Full system access across tenants, clinics, analytics, and settings.',
  },
  {
    role: 'Tenant Admin',
    label: 'Tenant Admin',
    email: 'tenantadmin@clinicall.demo',
    password: 'demo1234',
    description: 'Manages a single tenant, clinics, staff, and operational dashboards.',
  },
  {
    role: 'Doctor',
    label: 'Doctor',
    email: 'doctor@clinicall.demo',
    password: 'demo1234',
    description: 'Sees clinical workload, appointments, patient charts, and practice metrics.',
  },
  {
    role: 'Staff',
    label: 'Staff',
    email: 'staff@clinicall.demo',
    password: 'demo1234',
    description: 'Handles front-desk workflows, scheduling, and patient coordination.',
  },
  {
    role: 'Patient',
    label: 'Patient',
    email: 'patient@clinicall.demo',
    password: 'demo1234',
    description: 'Views own upcoming appointments, care plan, and account summary.',
  },
];

export type DemoSession = {
  role: DemoRole;
  email: string;
};

const DEMO_SESSION_KEY = 'clinicall-demo-session';

export function normalizeDemoRole(value: string | null | undefined): DemoRole | null {
  if (!value) return null;
  const match = DEMO_ROLES.find((role) => role.toLowerCase() === value.toLowerCase());
  return match ?? null;
}

export function getDemoCredentialsByEmail(email: string): DemoCredentials | null {
  const normalized = email.trim().toLowerCase();
  return DEMO_CREDENTIALS.find((credentials) => credentials.email.toLowerCase() === normalized) ?? null;
}

export function getDemoCredentialsByRole(role: DemoRole): DemoCredentials {
  return DEMO_CREDENTIALS.find((credentials) => credentials.role === role) ?? DEMO_CREDENTIALS[0];
}

export function buildDemoLoginUrl(role: DemoRole): string {
  return `/dashboard?role=${encodeURIComponent(role)}`;
}

export function createDemoSession(role: DemoRole, email: string): DemoSession {
  return { role, email };
}

export function serializeDemoSession(session: DemoSession): string {
  return JSON.stringify(session);
}

export function deserializeDemoSession(value: string | null | undefined): DemoSession | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<DemoSession>;
    const role = normalizeDemoRole(typeof parsed.role === 'string' ? parsed.role : null);
    const email = typeof parsed.email === 'string' ? parsed.email : '';
    if (!role || !email) return null;
    return { role, email };
  } catch {
    return null;
  }
}

export function getDemoSessionKey(): string {
  return DEMO_SESSION_KEY;
}

export function getDemoSession(roleParam?: string | null): DemoSession | null {
  const role = normalizeDemoRole(roleParam);
  if (!role) return null;

  const credentials = getDemoCredentialsByRole(role);
  return createDemoSession(role, credentials.email);
}
