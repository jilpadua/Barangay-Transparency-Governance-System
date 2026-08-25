import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import type { PermissionCode } from "@/lib/permissions";
import { authConfig } from "@/lib/auth/config";

async function loadUserAuth(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });
  if (!user || !user.isActive) return null;

  const roles = user.userRoles.map((ur) => ur.role.code);
  const permissionSet = new Set<PermissionCode>();
  for (const ur of user.userRoles) {
    for (const rp of ur.role.rolePermissions) {
      permissionSet.add(rp.permission.code as PermissionCode);
    }
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    barangayId: user.barangayId,
    roles,
    permissions: Array.from(permissionSet),
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!user || !user.isActive || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) return null;

        const authUser = await loadUserAuth(user.id);
        if (!authUser) return null;

        return {
          id: authUser.id,
          email: authUser.email,
          name: authUser.name,
          barangayId: authUser.barangayId,
          roles: authUser.roles,
          permissions: authUser.permissions,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.barangayId = user.barangayId ?? null;
        token.roles = user.roles ?? [];
        token.permissions = user.permissions ?? [];
      } else if (typeof token.id === "string") {
        const fresh = await loadUserAuth(token.id);
        if (fresh) {
          token.barangayId = fresh.barangayId;
          token.roles = fresh.roles;
          token.permissions = fresh.permissions;
          token.name = fresh.name;
          token.email = fresh.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.email =
          typeof token.email === "string"
            ? token.email
            : (session.user.email ?? "");
        session.user.name =
          typeof token.name === "string" ? token.name : session.user.name;
        session.user.barangayId =
          typeof token.barangayId === "string" ? token.barangayId : null;
        session.user.roles = Array.isArray(token.roles)
          ? (token.roles as string[])
          : [];
        session.user.permissions = Array.isArray(token.permissions)
          ? (token.permissions as PermissionCode[])
          : [];
      }
      return session;
    },
  },
});
