import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { createHmac, timingSafeEqual } from "node:crypto";

import { authOptions, type AppRole } from "./auth";
import { db } from "./db";

const IMPERSONATION_COOKIE_NAME = "dashboard-impersonation";

type ImpersonationCookiePayload = {
  impersonatorId: string;
  userId: string;
  issuedAt: string;
};

type DashboardUserRecord = {
  id: string;
  email: string | null;
  name: string | null;
  role: AppRole;
  tenantId: string | null;
  clinicId: string | null;
  patientId: string | null;
};

export type EffectiveDashboardUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: AppRole;
  tenantId: string | null;
  clinicId: string | null;
  patientId: string | null;
  isImpersonating: boolean;
  impersonatorId: string | null;
  impersonatorName: string | null;
  impersonatorEmail: string | null;
};

function getImpersonationSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("Missing NEXTAUTH_SECRET for impersonation.");
  }

  return secret;
}

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", getImpersonationSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function encodePayload(payload: ImpersonationCookiePayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(encodedPayload: string): ImpersonationCookiePayload | null {
  try {
    const rawValue = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const parsedValue = JSON.parse(rawValue) as Partial<ImpersonationCookiePayload>;

    if (
      typeof parsedValue.impersonatorId !== "string" ||
      typeof parsedValue.userId !== "string" ||
      typeof parsedValue.issuedAt !== "string"
    ) {
      return null;
    }

    return {
      impersonatorId: parsedValue.impersonatorId,
      userId: parsedValue.userId,
      issuedAt: parsedValue.issuedAt,
    };
  } catch {
    return null;
  }
}

function serializeImpersonationCookie(payload: ImpersonationCookiePayload): string {
  const encodedPayload = encodePayload(payload);
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function parseImpersonationCookie(value: string | undefined): ImpersonationCookiePayload | null {
  if (!value) {
    return null;
  }

  const [encodedPayload, signature] = value.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  return decodePayload(encodedPayload);
}

async function clearImpersonationCookie(): Promise<void> {
  const cookieStore = cookies();

  try {
    cookieStore.delete(IMPERSONATION_COOKIE_NAME);
    return;
  } catch {}

  try {
    cookieStore.set(IMPERSONATION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  } catch {}
}

async function setImpersonationCookie(payload: ImpersonationCookiePayload): Promise<void> {
  cookies().set(IMPERSONATION_COOKIE_NAME, serializeImpersonationCookie(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

function toEffectiveUser(
  user: DashboardUserRecord,
  impersonation?: {
    impersonatorId: string;
    impersonatorName: string | null;
    impersonatorEmail: string | null;
  },
): EffectiveDashboardUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId,
    clinicId: user.clinicId,
    patientId: user.patientId,
    isImpersonating: Boolean(impersonation),
    impersonatorId: impersonation?.impersonatorId ?? null,
    impersonatorName: impersonation?.impersonatorName ?? null,
    impersonatorEmail: impersonation?.impersonatorEmail ?? null,
  };
}

async function getUserRecordById(userId: string): Promise<DashboardUserRecord | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      tenantId: true,
      clinicId: true,
      patientId: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    role: user.role as AppRole,
  };
}

export async function getEffectiveDashboardUser(): Promise<EffectiveDashboardUser | null> {
  const session = await getServerSession(authOptions);
  const rawCookieValue = cookies().get(IMPERSONATION_COOKIE_NAME)?.value;

  if (!session?.user?.id || !session.user.role) {
    await clearImpersonationCookie();
    return null;
  }

  const realUser = toEffectiveUser({
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
    role: session.user.role,
    tenantId: session.user.tenantId ?? null,
    clinicId: session.user.clinicId ?? null,
    patientId: session.user.patientId ?? null,
  });

  const parsedCookie = parseImpersonationCookie(rawCookieValue);

  if (!parsedCookie) {
    if (rawCookieValue) {
      await clearImpersonationCookie();
    }

    return realUser;
  }

  if (parsedCookie.impersonatorId !== session.user.id || session.user.role !== "SUPER_ADMIN") {
    await clearImpersonationCookie();
    return realUser;
  }

  const [impersonator, impersonatedUser] = await Promise.all([
    getUserRecordById(parsedCookie.impersonatorId),
    getUserRecordById(parsedCookie.userId),
  ]);

  if (
    !impersonator ||
    impersonator.role !== "SUPER_ADMIN" ||
    !impersonatedUser ||
    impersonatedUser.role === "SUPER_ADMIN"
  ) {
    await clearImpersonationCookie();
    return realUser;
  }

  return toEffectiveUser(impersonatedUser, {
    impersonatorId: impersonator.id,
    impersonatorName: impersonator.name,
    impersonatorEmail: impersonator.email,
  });
}

export async function startImpersonation(userId: string): Promise<void> {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    throw new Error("A user must be selected for impersonation.");
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("You must be signed in to impersonate a user.");
  }

  const impersonator = await getUserRecordById(session.user.id);

  if (!impersonator || impersonator.role !== "SUPER_ADMIN") {
    await clearImpersonationCookie();
    throw new Error("Only SUPER_ADMIN users can impersonate another user.");
  }

  if (impersonator.id === normalizedUserId) {
    await clearImpersonationCookie();
    throw new Error("You cannot impersonate your own account.");
  }

  const userToImpersonate = await getUserRecordById(normalizedUserId);

  if (!userToImpersonate) {
    await clearImpersonationCookie();
    throw new Error("The selected user no longer exists.");
  }

  if (userToImpersonate.role === "SUPER_ADMIN") {
    await clearImpersonationCookie();
    throw new Error("SUPER_ADMIN users cannot be impersonated.");
  }

  await setImpersonationCookie({
    impersonatorId: impersonator.id,
    userId: userToImpersonate.id,
    issuedAt: new Date().toISOString(),
  });
}

export async function stopImpersonation(): Promise<void> {
  await clearImpersonationCookie();
}
