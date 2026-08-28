import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  PERMISSIONS,
  ROLE_CODES,
  ROLE_PERMISSION_MAP,
} from "../../src/lib/permissions";

export async function seedAuth(
  prisma: PrismaClient,
  barangayId: string,
) {
  const permissionRecords = await Promise.all(
    Object.values(PERMISSIONS).map((code) => {
      const [module] = code.split(":");
      return prisma.permission.create({
        data: {
          code,
          name: code,
          module,
          description: `Permission ${code}`,
        },
      });
    }),
  );
  const permByCode = Object.fromEntries(
    permissionRecords.map((p) => [p.code, p.id]),
  );

  const roleRecords: Record<string, string> = {};
  for (const [code, perms] of Object.entries(ROLE_PERMISSION_MAP)) {
    const role = await prisma.role.create({
      data: {
        code,
        name: code
          .split("_")
          .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
          .join(" "),
        description: `Role ${code}`,
        rolePermissions: {
          create: perms.map((p) => ({
            permissionId: permByCode[p],
          })),
        },
      },
    });
    roleRecords[code] = role.id;
  }

  const passwordHash = await bcrypt.hash("DemoAdmin123!", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@demo.barangay.gov.ph",
      username: "superadmin",
      name: "Demo Super Admin",
      passwordHash,
      barangayId,
      mfaEnabled: false,
      userRoles: {
        create: [{ roleId: roleRecords[ROLE_CODES.SUPER_ADMIN] }],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "treasurer@demo.barangay.gov.ph",
      name: "Demo Treasurer",
      passwordHash,
      barangayId,
      userRoles: {
        create: [{ roleId: roleRecords[ROLE_CODES.TREASURER] }],
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "secretary@demo.barangay.gov.ph",
      name: "Demo Secretary",
      passwordHash,
      barangayId,
      userRoles: {
        create: [{ roleId: roleRecords[ROLE_CODES.SECRETARY] }],
      },
    },
  });

  return { admin, roleRecords };
}
