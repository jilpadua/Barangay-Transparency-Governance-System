import Link from "next/link";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import { listMeetings } from "@/services/meetings";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { PublicationStatusBadge, MeetingStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function MeetingsAdminPage() {
  await requirePermission(PERMISSIONS.MEETINGS_VIEW);
  const session = await auth();
  const meetings = await listMeetings();
  const canManage = hasPermission(session?.user?.permissions, PERMISSIONS.MEETINGS_MANAGE);

  return (
    <div className="space-y-6">
      <PageHeader title="Meetings" description="Manage meetings and attendance." actions={canManage ? <Button asChild><Link href="/admin/meetings/new">Add meeting</Link></Button> : undefined} />
      <DataTable>
        <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Meeting status</th><th>Publication</th><th /></tr></thead>
        <tbody>
          {meetings.map((m) => (
            <tr key={m.id}>
              <td><div className="flex flex-wrap gap-2">{m.title}{m.isDemo && <Badge variant="warning">DEMO</Badge>}</div></td>
              <td>{m.meetingType}</td>
              <td>{formatDate(m.meetingDate)}</td>
              <td><MeetingStatusBadge status={m.status} /></td>
              <td><PublicationStatusBadge status={m.publicationStatus} /></td>
              <td><Link href={`/admin/meetings/${m.id}/edit`} className="text-sm text-[var(--color-accent)] hover:underline">Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </div>
  );
}
