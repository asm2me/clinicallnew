import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

const isProd = process.env.NODE_ENV === 'production';
const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

console.log('[auth:init]', {
  nodeEnv: process.env.NODE_ENV,
  hasAuthSecret: Boolean(authSecret),
  hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
  databaseHost: process.env.DATABASE_URL
    ? (() => { try { return new URL(process.env.DATABASE_URL).hostname; } catch { return 'parse-error'; } })()
    : 'missing',
  useSecureCookies: isProd,
});

export type AppRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'DOCTOR' | 'STAFF' | 'PATIENT';

function normalizeString(value: string | null | undefined) {
  return value ?? null;
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  useSecureCookies: isProd,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('[auth:authorize] Starting authentication attempt');

        if (!credentials?.email || !credentials?.password) {
          console.log('[auth:authorize] Missing email or password');
          throw new Error('Email and password required');
        }

        const email = credentials.email.trim().toLowerCase();
        console.log('[auth:authorize] Looking up user:', email);

        let user;
        try {
          user = await db.user.findUnique({
            where: { email }
          });
          console.log('[auth:authorize] User found:', user ? { id: user.id, email: user.email, role: user.role, isActive: user.isActive } : null);
        } catch (err: any) {
          console.error('[auth:authorize] Database query failed:', err?.message || err);
          throw new Error('Service temporarily unavailable. Please try again.');
        }

        if (!user) {
          console.log('[auth:authorize] No user found for email:', email);
          throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
          console.log('[auth:authorize] User account is inactive:', email);
          throw new Error('Account is inactive');
        }

        console.log('[auth:authorize] Comparing password...');
        let passwordValid: boolean;
        try {
          passwordValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        } catch (err: any) {
          console.error('[auth:authorize] Password comparison failed:', err?.message || err);
          throw new Error('Authentication error. Please try again.');
        }

        if (!passwordValid) {
          console.log('[auth:authorize] Invalid password for:', email);
          throw new Error('Invalid credentials');
        }

        console.log('[auth:authorize] Password valid, updating lastLoginAt...');

        try {
          await db.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          });
        } catch (err: any) {
          console.error('[auth:authorize] Failed to update lastLoginAt:', err?.message || err);
          // Non-critical — continue signing in
        }

        console.log('[auth:authorize] Success for:', email, 'role:', user.role);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as AppRole,
          tenantId: normalizeString(user.tenantId),
          clinicId: normalizeString(user.clinicId),
          patientId: normalizeString(user.patientId)
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as AppRole;
        token.tenantId = user.tenantId ?? null;
        token.clinicId = user.clinicId ?? null;
        token.patientId = user.patientId ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.role = token.role as AppRole;
        session.user.tenantId = (token.tenantId as string | null | undefined) ?? null;
        session.user.clinicId = (token.clinicId as string | null | undefined) ?? null;
        session.user.patientId = (token.patientId as string | null | undefined) ?? null;
      }

      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
};
