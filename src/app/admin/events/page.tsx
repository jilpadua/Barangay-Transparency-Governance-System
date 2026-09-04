import Link from "next/link";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { listEvents } from "@/services/events";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function EventsAdminPage() {
  await requirePermission(PERMISSIONS.EVENTS_VIEW);
  const session = await auth();
  const events = await listEvents();
  const canManage = hasPermission(session?.user?.permissions, PERMISSIONS.EVENTS_MANAGE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage barangay and SK events."
        actions={canManage ? <Button asChild><Link href="/admin/events/new">Add event</Link></Button> : undefined}
      />
      <DataTable>
        <thead><tr><th>Title</th><th>Date</th><th>Location</th><th>Status</th><th /></tr></thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td><div className="flex flex-wrap gap-2">{e.title}{e.isDemo && <Badge variant="warning">DEMO</Badge>}{e.isSk && <Badge variant="info">SK</Badge>}</div></td>
              <td>{formatDate(e.eventDate)}</td>
              <td>{e.location ?? "—"}</td>
              <td><PublicationStatusBadge status={e.publicationStatus} /></td>
              <td><Link href={`/admin/events/${e.id}/edit`} className="text-sm text-[var(--color-accent)] hover:underline">Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </div>
  );
}
