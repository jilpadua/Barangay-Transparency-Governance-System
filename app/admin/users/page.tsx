import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  await requirePermission([PERMISSIONS.USERS_VIEW]);

  const users = await prisma.user.findMany({
    include: {
      userRoles: { include: { role: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Users
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Role-based staff accounts. User management actions expand in later
          phases.
        </p>
      </div>
      <div className="table-wrap rounded-lg border border-[var(--color-border)] bg-white">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Status</th>
              <th>MFA</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name ?? "—"}</td>
                <td>{user.email}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {user.userRoles.map((ur) => (
                      <Badge key={ur.id} variant="primary">
                        {ur.role.name}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td>
                  <Badge variant={user.isActive ? "success" : "danger"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td>{user.mfaEnabled ? "Enabled" : "Ready (off)"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
