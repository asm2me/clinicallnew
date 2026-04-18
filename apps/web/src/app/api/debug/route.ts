import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      databaseHost: 'unknown',
      hasAuthSecret: Boolean(process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET),
      nextauthUrl: process.env.NEXTAUTH_URL || 'missing',
    },
    database: {
      status: 'pending',
      userCount: null as number | null,
      error: null as string | null,
    },
  };

  // Parse database host from URL
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      const url = new URL(dbUrl);
      diagnostics.env.databaseHost = url.hostname;
      diagnostics.env.databasePort = url.port || '5432';
    }
  } catch {
    diagnostics.env.databaseHost = 'parse-error';
  }

  // Test database connection
  try {
    const userCount = await db.user.count();
    diagnostics.database.status = 'connected';
    diagnostics.database.userCount = userCount;

    // Try to find a specific user
    const testUser = await db.user.findUnique({
      where: { email: 'superadmin@clinicall.demo' },
      select: { id: true, email: true, role: true, isActive: true }
    });
    diagnostics.database.testUser = testUser || 'not found';
  } catch (err: any) {
    diagnostics.database.status = 'error';
    diagnostics.database.error = err?.message || String(err);
    diagnostics.database.errorCode = err?.code || null;
  }

  return NextResponse.json(diagnostics, { status: 200 });
}