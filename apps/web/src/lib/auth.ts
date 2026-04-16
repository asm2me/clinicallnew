import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

const isProd = process.env.NODE_ENV === 'production';
const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const email = credentials.email.trim().toLowerCase();

        const user = await db.user.findUnique({
          where: { email }
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
          throw new Error('Account is inactive');
        }

        const passwordValid = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!passwordValid) {
          throw new Error('Invalid credentials');
        }

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });

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
