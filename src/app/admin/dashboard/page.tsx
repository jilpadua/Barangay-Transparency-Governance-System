import Link from "next/link";
import { requireSession } from "@/lib/permissions/server";
import { prisma } from "@/lib/db";
import { getBlockchainProvider } from "@/lib/blockchain";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireSession();

  const [
    draftProjects,
    pendingReviews,
    feedbackPending,
    blockchainPending,
    blockchainFailed,
    recentAudit,
  ] = await Promise.all([
    prisma.project.count({ where: { publicationStatus: "DRAFT" } }),
    prisma.project.count({ where: { publicationStatus: "FOR_REVIEW" } }),
    prisma.feedback.count({
      where: { status: { in: ["RECEIVED", "UNDER_REVIEW"] } },
    }),
    prisma.blockchainProof.count({ where: { status: "PENDING" } }),
    prisma.blockchainProof.count({ where: { status: "FAILED" } }),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const chain = await getBlockchainProvider().getStatus();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Welcome, {session.user.name ?? session.user.email}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Kpi title="Draft records (projects)" value={draftProjects} />
        <Kpi title="Pending reviews" value={pendingReviews} />
        <Kpi title="Feedback pending" value={feedbackPending} />
        <Kpi title="Blockchain pending" value={blockchainPending} />
        <Kpi title="Blockchain failed" value={blockchainFailed} />
        <Card>
          <CardHeader>
            <CardDescription>Blockchain service</CardDescription>
            <CardTitle className="flex items-center gap-2 text-base">
              {chain.available ? "Available" : "Unavailable"}
              <Badge variant={chain.available ? "success" : "warning"}>
                {chain.network}
              </Badge>
            </CardTitle>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {chain.message}
            </p>
          </CardHeader>
        </Card>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <Link
            href="/admin/audit-logs"
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            Audit logs
          </Link>
        </div>
        {recentAudit.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)]">
            No audit entries yet.
          </p>
        ) : (
          <div className="table-wrap rounded-lg border border-[var(--color-border)] bg-white">
            <table className="data-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Record</th>
                </tr>
              </thead>
              <tbody>
                {recentAudit.map((log) => (
                  <tr key={log.id}>
                    <td>{log.createdAt.toLocaleString("en-PH")}</td>
                    <td>{log.userEmail ?? "—"}</td>
                    <td>{log.action}</td>
                    <td>{log.module}</td>
                    <td>{log.recordId ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle>{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
