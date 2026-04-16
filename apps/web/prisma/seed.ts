import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('demo1234', 10);

  await prisma.auditLog.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.tenant.deleteMany();

  const tenant = await prisma.tenant.create({
    data: {
      name: 'Clinicall Demo',
      slug: 'clinicall-demo',
      status: 'ACTIVE',
      websiteName: 'Clinicall Demo Health',
      supportEmail: 'support@clinicall.demo',
      supportPhone: '+1 415 555 0100',
      timezone: 'America/Los_Angeles',
      locale: 'en',
      subscriptionPlan: 'PRO',
      subscriptionStatus: 'active',
      trialEndsAt: new Date('2026-12-31T00:00:00.000Z'),
      clinics: {
        create: [
          {
            name: 'Downtown Clinic',
            slug: 'downtown-clinic',
            city: 'San Francisco',
            addressLine1: '100 Market Street',
            manager: 'Jane Smith',
            phone: '+1 415 555 0111',
            email: 'downtown@clinicall.demo',
            rooms: 8,
            timezone: 'America/Los_Angeles',
            status: 'OPERATIONAL',
            isBookingEnabled: true
          },
          {
            name: 'Midtown Clinic',
            slug: 'midtown-clinic',
            city: 'San Francisco',
            addressLine1: '240 Mission Street',
            manager: 'Bob Johnson',
            phone: '+1 415 555 0222',
            email: 'midtown@clinicall.demo',
            rooms: 6,
            timezone: 'America/Los_Angeles',
            status: 'OPERATIONAL',
            isBookingEnabled: true
          },
          {
            name: 'Uptown Clinic',
            slug: 'uptown-clinic',
            city: 'Oakland',
            addressLine1: '55 Grand Avenue',
            manager: 'Alice Brown',
            phone: '+1 510 555 0333',
            email: 'uptown@clinicall.demo',
            rooms: 5,
            timezone: 'America/Los_Angeles',
            status: 'LAUNCHING',
            isBookingEnabled: true
          }
        ]
      }
    },
    include: { clinics: true }
  });

  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id,
        name: 'Alice Thompson',
        email: 'alice.thompson@example.com',
        phone: '+1 415 555 1001',
        mrn: 'PT-2024-001',
        status: 'STABLE',
        dateOfBirth: new Date('1990-02-14'),
        gender: 'Female',
        emergencyContact: 'Mark Thompson',
        emergencyPhone: '+1 415 555 1999',
        notes: 'Routine follow-up patient',
        team: 'General Medicine',
        lastVisit: new Date('2026-04-10')
      }
    }),
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id,
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        phone: '+1 415 555 1002',
        mrn: 'PT-2024-002',
        status: 'PENDING',
        dateOfBirth: new Date('1984-07-21'),
        gender: 'Male',
        emergencyContact: 'Emily Wilson',
        emergencyPhone: '+1 415 555 1888',
        notes: 'Cardiology intake pending',
        team: 'Cardiology',
        lastVisit: new Date('2026-03-20')
      }
    }),
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[1].id,
        name: 'Carol Davis',
        email: 'carol.davis@example.com',
        phone: '+1 415 555 1003',
        mrn: 'PT-2024-003',
        status: 'URGENT',
        dateOfBirth: new Date('1978-11-03'),
        gender: 'Female',
        emergencyContact: 'Nathan Davis',
        emergencyPhone: '+1 415 555 1777',
        notes: 'Requires priority review',
        team: 'Emergency',
        lastVisit: new Date('2026-04-14')
      }
    }),
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[1].id,
        name: 'David Miller',
        email: 'david.miller@example.com',
        phone: '+1 415 555 1004',
        mrn: 'PT-2024-004',
        status: 'STABLE',
        dateOfBirth: new Date('1992-09-18'),
        gender: 'Male',
        emergencyContact: 'Sarah Miller',
        emergencyPhone: '+1 415 555 1666',
        notes: 'Orthopedics recurring care',
        team: 'Orthopedics',
        lastVisit: new Date('2026-04-05')
      }
    }),
    prisma.patient.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[2].id,
        name: 'Emma Johnson',
        email: 'emma.johnson@example.com',
        phone: '+1 510 555 1005',
        mrn: 'PT-2024-005',
        status: 'NEEDS_FOLLOW_UP',
        dateOfBirth: new Date('1988-01-25'),
        gender: 'Female',
        emergencyContact: 'Chris Johnson',
        emergencyPhone: '+1 510 555 1555',
        notes: 'Needs neurology follow-up',
        team: 'Neurology',
        lastVisit: new Date('2026-02-28')
      }
    })
  ]);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'superadmin@clinicall.demo',
        hashedPassword,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        tenantId: tenant.id,
        title: 'Platform Administrator',
        isActive: true,
        emailVerifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: 'tenantadmin@clinicall.demo',
        hashedPassword,
        name: 'Tenant Admin',
        role: 'TENANT_ADMIN',
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id,
        title: 'Operations Director',
        isActive: true,
        emailVerifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: 'doctor@clinicall.demo',
        hashedPassword,
        name: 'Dr. Sarah Chen',
        role: 'DOCTOR',
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id,
        title: 'Lead Physician',
        isActive: true,
        emailVerifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: 'staff@clinicall.demo',
        hashedPassword,
        name: 'Staff Member',
        role: 'STAFF',
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id,
        title: 'Front Desk Coordinator',
        isActive: true,
        emailVerifiedAt: new Date()
      }
    }),
    prisma.user.create({
      data: {
        email: 'patient@clinicall.demo',
        hashedPassword,
        name: 'John Patient',
        role: 'PATIENT',
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id,
        patientId: patients[0].id,
        title: 'Patient Portal User',
        isActive: true,
        emailVerifiedAt: new Date()
      }
    })
  ]);

  await Promise.all([
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id,
        patientId: patients[0].id,
        doctorId: users[2].id,
        startsAt: new Date('2026-04-17T09:00:00'),
        endsAt: new Date('2026-04-17T09:30:00'),
        status: 'CONFIRMED',
        source: 'STAFF',
        reason: 'Routine check-up'
      }
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id,
        patientId: patients[1].id,
        doctorId: users[2].id,
        startsAt: new Date('2026-04-17T10:30:00'),
        endsAt: new Date('2026-04-17T11:00:00'),
        status: 'CONFIRMED',
        source: 'STAFF',
        reason: 'Cardiology consult'
      }
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[1].id,
        patientId: patients[2].id,
        doctorId: users[2].id,
        startsAt: new Date('2026-04-17T14:00:00'),
        endsAt: new Date('2026-04-17T14:30:00'),
        status: 'PENDING',
        source: 'API',
        reason: 'Urgent review'
      }
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[1].id,
        patientId: patients[3].id,
        doctorId: users[2].id,
        startsAt: new Date('2026-04-18T11:00:00'),
        endsAt: new Date('2026-04-18T11:30:00'),
        status: 'CONFIRMED',
        source: 'STAFF',
        reason: 'Orthopedics follow-up'
      }
    }),
    prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        clinicId: tenant.clinics[2].id,
        patientId: patients[4].id,
        doctorId: users[2].id,
        startsAt: new Date('2026-04-16T15:30:00'),
        endsAt: new Date('2026-04-16T16:00:00'),
        status: 'CANCELLED',
        source: 'PATIENT_PORTAL',
        reason: 'Neurology follow-up',
        cancelledAt: new Date('2026-04-15T12:00:00')
      }
    })
  ]);

  await prisma.auditLog.createMany({
    data: [
      {
        action: 'TENANT_CREATED',
        entityType: 'Tenant',
        entityId: tenant.id,
        actorId: users[0].id,
        tenantId: tenant.id,
        metadata: JSON.stringify({ source: 'seed' })
      },
      {
        action: 'USER_CREATED',
        entityType: 'User',
        entityId: users[2].id,
        actorId: users[0].id,
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id,
        metadata: JSON.stringify({ role: 'DOCTOR' })
      }
    ]
  });

  console.log('✅ Database seeded successfully!');
  console.log('Demo users created:');
  console.log('  - superadmin@clinicall.demo / demo1234');
  console.log('  - tenantadmin@clinicall.demo / demo1234');
  console.log('  - doctor@clinicall.demo / demo1234');
  console.log('  - staff@clinicall.demo / demo1234');
  console.log('  - patient@clinicall.demo / demo1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
