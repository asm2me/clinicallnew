import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('demo1234', 10);

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Clinicall Demo',
      clinics: {
        create: [
          {
            name: 'Downtown Clinic',
            city: 'San Francisco',
            manager: 'Jane Smith',
            rooms: 8,
            status: 'OPERATIONAL'
          },
          {
            name: 'Midtown Clinic',
            city: 'San Francisco',
            manager: 'Bob Johnson',
            rooms: 6,
            status: 'OPERATIONAL'
          },
          {
            name: 'Uptown Clinic',
            city: 'Oakland',
            manager: 'Alice Brown',
            rooms: 5,
            status: 'LAUNCHING'
          }
        ]
      }
    },
    include: { clinics: true }
  });

  // Create users (one per role)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'superadmin@clinicall.demo',
        hashedPassword,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        tenantId: tenant.id
      }
    }),
    prisma.user.create({
      data: {
        email: 'tenantadmin@clinicall.demo',
        hashedPassword,
        name: 'Tenant Admin',
        role: 'TENANT_ADMIN',
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id
      }
    }),
    prisma.user.create({
      data: {
        email: 'doctor@clinicall.demo',
        hashedPassword,
        name: 'Dr. Sarah Chen',
        role: 'DOCTOR',
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id
      }
    }),
    prisma.user.create({
      data: {
        email: 'staff@clinicall.demo',
        hashedPassword,
        name: 'Staff Member',
        role: 'STAFF',
        tenantId: tenant.id,
        clinicId: tenant.clinics[0].id
      }
    }),
    prisma.user.create({
      data: {
        email: 'patient@clinicall.demo',
        hashedPassword,
        name: 'John Patient',
        role: 'PATIENT',
        tenantId: tenant.id
      }
    })
  ]);

  // Create patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: 'Alice Thompson',
        mrn: 'PT-2024-001',
        status: 'STABLE',
        team: 'General Medicine',
        clinicId: tenant.clinics[0].id,
        lastVisit: new Date('2026-04-10')
      }
    }),
    prisma.patient.create({
      data: {
        name: 'Bob Wilson',
        mrn: 'PT-2024-002',
        status: 'PENDING',
        team: 'Cardiology',
        clinicId: tenant.clinics[0].id,
        lastVisit: new Date('2026-03-20')
      }
    }),
    prisma.patient.create({
      data: {
        name: 'Carol Davis',
        mrn: 'PT-2024-003',
        status: 'URGENT',
        team: 'Emergency',
        clinicId: tenant.clinics[1].id,
        lastVisit: new Date('2026-04-14')
      }
    }),
    prisma.patient.create({
      data: {
        name: 'David Miller',
        mrn: 'PT-2024-004',
        status: 'STABLE',
        team: 'Orthopedics',
        clinicId: tenant.clinics[1].id,
        lastVisit: new Date('2026-04-05')
      }
    }),
    prisma.patient.create({
      data: {
        name: 'Emma Johnson',
        mrn: 'PT-2024-005',
        status: 'NEEDS_FOLLOW_UP',
        team: 'Neurology',
        clinicId: tenant.clinics[2].id,
        lastVisit: new Date('2026-02-28')
      }
    })
  ]);

  // Create appointments
  await Promise.all([
    prisma.appointment.create({
      data: {
        time: new Date('2026-04-17T09:00:00'),
        status: 'CONFIRMED',
        patientId: patients[0].id,
        clinicId: tenant.clinics[0].id,
        doctorId: users[2].id
      }
    }),
    prisma.appointment.create({
      data: {
        time: new Date('2026-04-17T10:30:00'),
        status: 'CONFIRMED',
        patientId: patients[1].id,
        clinicId: tenant.clinics[0].id,
        doctorId: users[2].id
      }
    }),
    prisma.appointment.create({
      data: {
        time: new Date('2026-04-17T14:00:00'),
        status: 'PENDING',
        patientId: patients[2].id,
        clinicId: tenant.clinics[1].id,
        doctorId: users[2].id
      }
    }),
    prisma.appointment.create({
      data: {
        time: new Date('2026-04-18T11:00:00'),
        status: 'CONFIRMED',
        patientId: patients[3].id,
        clinicId: tenant.clinics[1].id,
        doctorId: users[2].id
      }
    }),
    prisma.appointment.create({
      data: {
        time: new Date('2026-04-16T15:30:00'),
        status: 'CANCELLED',
        patientId: patients[4].id,
        clinicId: tenant.clinics[2].id,
        doctorId: users[2].id
      }
    })
  ]);

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
