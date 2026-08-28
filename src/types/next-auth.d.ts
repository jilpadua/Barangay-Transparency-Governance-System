import type { PermissionCode } from "@/lib/permissions";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      barangayId?: string | null;
      roles: string[];
      permissions: PermissionCode[];
    } & DefaultSession["user"];
  }

  interface User {
    barangayId?: string | null;
    roles?: string[];
    permissions?: PermissionCode[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    barangayId?: string | null;
    roles?: string[];
    permissions?: PermissionCode[];
  }
}
