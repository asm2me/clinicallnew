import { DefaultSession } from 'next-auth';
import type { AppRole } from '@/lib/auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: AppRole;
      tenantId: string | null;
      clinicId: string | null;
      patientId: string | null;
    isImpersonating?: boolean;
    impersonatorId?: string | null;
    impersonatorName?: string | null;
    impersonatorEmail?: string | null;
      isImpersonating?: boolean;
      impersonatorId?: string | null;
      impersonatorName?: string | null;
      impersonatorEmail?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    role: AppRole;
    tenantId: string | null;
    clinicId: string | null;
    patientId: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: AppRole;
    tenantId?: string | null;
    clinicId?: string | null;
    patientId?: string | null;
    isImpersonating?: boolean;
    impersonatorId?: string | null;
    impersonatorName?: string | null;
    impersonatorEmail?: string | null;
  }
}
