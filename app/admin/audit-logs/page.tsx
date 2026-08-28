import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  await requirePermission(PERMISSIONS.AUDIT_VIEW);

  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Audit logs
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Append-only trail of administrative actions. Entries cannot be edited
          or deleted from this interface.
        </p>
      </div>
      <div className="table-wrap rounded-lg border border-[var(--color-border)] bg-white">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Role</th>
              <th>Action</th>
              <th>Module</th>
              <th>Record</th>
              <th>Field</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8}>No audit entries.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap">
                    {log.createdAt.toLocaleString("en-PH")}
                  </td>
                  <td>{log.userEmail ?? "—"}</td>
                  <td>{log.userRole ?? "—"}</td>
                  <td>{log.action}</td>
                  <td>{log.module}</td>
                  <td>{log.recordId ?? "—"}</td>
                  <td>{log.fieldName ?? "—"}</td>
                  <td className="max-w-xs truncate">
                    {log.oldValue || log.newValue
                      ? `${log.oldValue ?? "—"} → ${log.newValue ?? "—"}`
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
