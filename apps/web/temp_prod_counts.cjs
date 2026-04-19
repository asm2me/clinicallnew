const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();

  try {
    const [
      tenantCount,
      clinicCount,
      patientCount,
      userCount,
      appointmentCount,
      auditLogCount,
      users,
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.clinic.count(),
      prisma.patient.count(),
      prisma.user.count(),
      prisma.appointment.count(),
      prisma.auditLog.count(),
      prisma.user.findMany({
        select: { email: true, role: true, isActive: true },
        take: 10,
        orderBy: { email: "asc" },
      }),
    ]);

    console.log(
      JSON.stringify(
        {
          counts: {
            tenants: tenantCount,
            clinics: clinicCount,
            patients: patientCount,
            users: userCount,
            appointments: appointmentCount,
            auditLogs: auditLogCount,
          },
          sampleUsers: users,
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
