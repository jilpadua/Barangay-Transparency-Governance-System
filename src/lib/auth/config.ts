import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no Prisma / Node crypto).
 * Full credentials provider lives in lib/auth/index.ts (Node runtime).
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/admin")) {
        return !!auth?.user;
      }
      return true;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
