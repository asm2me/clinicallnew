import { redirect } from "next/navigation";

import type { AppRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { getEffectiveDashboardUser } from "@/lib/impersonation";

const roleOrder: Record<AppRole, number> = {
  SUPER_ADMIN: 0,
  TENANT_ADMIN: 1,
  DOCTOR: 2,
  STAFF: 3,
  PATIENT: 4,
};

function compareUsers(
  left: {
    role: string;
    name: string | null;
    email: string | null;
  },
  right: {
    role: string;
    name: string | null;
    email: string | null;
  },
) {
  const leftOrder = roleOrder[left.role as AppRole] ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = roleOrder[right.role as AppRole] ?? Number.MAX_SAFE_INTEGER;
  const roleDifference = leftOrder - rightOrder;

  if (roleDifference !== 0) {
    return roleDifference;
  }

  const leftLabel = left.name ?? left.email ?? "";
  const rightLabel = right.name ?? right.email ?? "";

  return leftLabel.localeCompare(rightLabel);
}

export async function getUsersPageData() {
  const actor = await getEffectiveDashboardUser();

  if (!actor) {
    redirect("/api/auth/signin");
  }

  if (actor.role !== "SUPER_ADMIN" && actor.role !== "TENANT_ADMIN") {
    redirect(
      "/dashboard?error=You%20do%20not%20have%20permission%20to%20manage%20users.",
    );
  }

  const roleOptions =
    actor.role === "SUPER_ADMIN"
      ? ([
          "SUPER_ADMIN",
          "TENANT_ADMIN",
          "DOCTOR",
          "STAFF",
          "PATIENT",
        ] satisfies AppRole[])
      : (["TENANT_ADMIN", "DOCTOR", "STAFF", "PATIENT"] satisfies AppRole[]);

  if (actor.role === "TENANT_ADMIN" && !actor.tenantId) {
    return {
      actor,
      roleOptions,
      tenants: [],
      clinics: [],
      users: [],
    };
  }

  const userWhere =
    actor.role === "SUPER_ADMIN"
      ? undefined
      : { tenantId: actor.tenantId ?? "__forbidden__" };
  const clinicWhere =
    actor.role === "SUPER_ADMIN"
      ? undefined
      : { tenantId: actor.tenantId ?? "__forbidden__" };

  const [tenants, clinics, users] = await Promise.all([
    actor.role === "SUPER_ADMIN"
      ? db.tenant.findMany({
          orderBy: { name: "asc" },
        })
      : Promise.resolve([]),
    db.clinic.findMany({
      where: clinicWhere,
      include: {
        tenant: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    db.user.findMany({
      where: userWhere,
      include: {
        tenant: {
          select: {
            name: true,
          },
        },
        clinic: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ name: "asc" }, { email: "asc" }],
    }),
  ]);

  return {
    actor,
    roleOptions,
    tenants,
    clinics,
    users: users.sort(compareUsers),
  };
}
