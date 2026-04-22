import { db } from '@/lib/db';

type Actor = {
  id: string;
  role: string;
  tenantId: string | null;
  clinicId: string | null;
  email: string | null;
};

function startOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatDate(value: Date | null) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(value);
}

function formatDateInput(value: Date | null) {
  if (!value) {
    return '';
  }

  return value.toISOString().slice(0, 10);
}

function buildPatientWhere(actor: Actor) {
  if (actor.role === 'SUPER_ADMIN') {
    return {};
  }

  if (actor.role === 'TENANT_ADMIN') {
    return actor.tenantId ? { tenantId: actor.tenantId } : { id: '__no_access__' };
  }

  if (actor.role === 'DOCTOR') {
    return actor.clinicId ? { clinicId: actor.clinicId } : { id: '__no_access__' };
  }

  if (actor.role === 'STAFF' || actor.role === 'PATIENT') {
    return { id: '__no_access__' };
  }

  return { id: '__no_access__' };
}

function buildClinicWhere(actor: Actor) {
  if (actor.role === 'SUPER_ADMIN') {
    return {};
  }

  if (actor.role === 'TENANT_ADMIN') {
    return actor.tenantId ? { tenantId: actor.tenantId } : { id: '__no_access__' };
  }

  if (actor.role === 'DOCTOR') {
    return actor.clinicId ? { id: actor.clinicId } : { id: '__no_access__' };
  }

  return { id: '__no_access__' };
}

export async function getPatientsData(userId: string) {
  const actor = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      tenantId: true,
      clinicId: true,
      email: true,
    },
  });

  if (!actor) {
    return {
      role: 'PATIENT',
      canMutate: false,
      stats: {
        totalPatients: 0,
        activePatients: 0,
        inactivePatients: 0,
        seenThisMonth: 0,
      },
      clinicOptions: [] as Array<{ id: string; name: string; city: string; tenantId: string | null }>,
      patients: [] as Array<{
        id: string;
        name: string;
        mrn: string;
        clinicId: string;
        clinicName: string;
        tenantId: string | null;
        status: string;
        email: string | null;
        phone: string | null;
        team: string | null;
        notes: string | null;
        gender: string | null;
        emergencyContact: string | null;
        emergencyPhone: string | null;
        lastVisit: Date | null;
        lastVisitLabel: string;
        lastVisitValue: string;
      }>,
    };
  }

  const patientWhere = buildPatientWhere(actor);
  const clinicWhere = buildClinicWhere(actor);
  const currentMonth = startOfCurrentMonth();

  const [patients, clinicOptions, totalPatients, activePatients, inactivePatients, seenThisMonth] = await Promise.all([
    db.patient.findMany({
      where: patientWhere,
      orderBy: [{ lastVisit: 'desc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        mrn: true,
        clinicId: true,
        tenantId: true,
        status: true,
        email: true,
        phone: true,
        team: true,
        notes: true,
        gender: true,
        emergencyContact: true,
        emergencyPhone: true,
        lastVisit: true,
        clinic: {
          select: {
            name: true,
          },
        },
      },
    }),
    db.clinic.findMany({
      where: clinicWhere,
      orderBy: [{ name: 'asc' }],
      select: {
        id: true,
        name: true,
        city: true,
        tenantId: true,
      },
    }),
    db.patient.count({
      where: patientWhere,
    }),
    db.patient.count({
      where: {
        ...patientWhere,
        status: 'ACTIVE' as never,
      },
    }),
    db.patient.count({
      where: {
        ...patientWhere,
        status: 'INACTIVE' as never,
      },
    }),
    db.patient.count({
      where: {
        ...patientWhere,
        lastVisit: {
          gte: currentMonth,
        },
      },
    }),
  ]);

  return {
    role: actor.role,
    canMutate:
      actor.role === 'SUPER_ADMIN' || actor.role === 'TENANT_ADMIN' || actor.role === 'DOCTOR',
    stats: {
      totalPatients,
      activePatients,
      inactivePatients,
      seenThisMonth,
    },
    clinicOptions: clinicOptions.map((clinic) => ({
      id: clinic.id,
      name: clinic.name,
      city: clinic.city,
      tenantId: clinic.tenantId,
    })),
    patients: patients.map((patient) => ({
      id: patient.id,
      name: patient.name,
      mrn: patient.mrn,
      clinicId: patient.clinicId,
      clinicName: patient.clinic.name,
      tenantId: patient.tenantId,
      status: String(patient.status),
      email: patient.email,
      phone: patient.phone,
      team: patient.team,
      notes: patient.notes,
      gender: patient.gender ? String(patient.gender) : null,
      emergencyContact: patient.emergencyContact,
      emergencyPhone: patient.emergencyPhone,
      lastVisit: patient.lastVisit,
      lastVisitLabel: formatDate(patient.lastVisit),
      lastVisitValue: formatDateInput(patient.lastVisit),
    })),
  };
}
