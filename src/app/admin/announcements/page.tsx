import Link from "next/link";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { listAnnouncements } from "@/services/announcements";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function AnnouncementsAdminPage() {
  await requirePermission(PERMISSIONS.ANNOUNCEMENTS_VIEW);
  const session = await auth();
  const announcements = await listAnnouncements();
  const canManage = hasPermission(session?.user?.permissions, PERMISSIONS.ANNOUNCEMENTS_MANAGE);

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Manage public announcements." actions={canManage ? <Button asChild><Link href="/admin/announcements/new">Add announcement</Link></Button> : undefined} />
      <DataTable>
        <thead><tr><th>Title</th><th>Featured</th><th>Status</th><th>Published</th><th /></tr></thead>
        <tbody>
          {announcements.map((a) => (
            <tr key={a.id}>
              <td><div className="flex flex-wrap gap-2">{a.title}{a.isDemo && <Badge variant="warning">DEMO</Badge>}</div></td>
              <td>{a.featured ? "Yes" : "—"}</td>
              <td><PublicationStatusBadge status={a.publicationStatus} /></td>
              <td>{formatDate(a.publishedAt)}</td>
              <td><Link href={`/admin/announcements/${a.id}/edit`} className="text-sm text-[var(--color-accent)] hover:underline">Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </div>
  );
}
