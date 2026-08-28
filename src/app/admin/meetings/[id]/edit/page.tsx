import Link from "next/link";
import { notFound } from "next/navigation";
import { AttendanceStatus, MeetingStatus } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS, hasPermission } from "@/lib/permissions";
import {
  getMeeting,
  getMeetingPublicationTransitions,
  listActiveOfficialsForAttendance,
} from "@/services/meetings";
import { updateMeetingAction, transitionMeetingAction, saveAttendanceAction } from "../../actions";
import { PageHeader } from "@/components/admin/page-header";
import { PublicationActions } from "@/components/admin/publication-actions";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.MEETINGS_VIEW);
  const session = await auth();
  const { id } = await params;
  let meeting;
  try { meeting = await getMeeting(id); } catch { notFound(); }
  const [transitions, officials] = await Promise.all([
    getMeetingPublicationTransitions(id),
    listActiveOfficialsForAttendance(),
  ]);
  const canManageAttendance = hasPermission(session?.user?.permissions, PERMISSIONS.ATTENDANCE_MANAGE);
  const attendanceMap = new Map(meeting.attendances.map((a) => [a.officialId, a]));

  return (
    <div className="space-y-6">
      <PageHeader title={meeting.title} actions={<div className="flex gap-2">{meeting.isDemo && <Badge variant="warning">DEMO</Badge>}<PublicationStatusBadge status={meeting.publicationStatus} /></div>} />
      <PublicationActions recordId={id} currentStatus={meeting.publicationStatus} availableTransitions={transitions} onTransition={transitionMeetingAction} />
      <form action={updateMeetingAction.bind(null, id)} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="meetingType">Type</Label><Input id="meetingType" name="meetingType" defaultValue={meeting.meetingType} required /></div>
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" defaultValue={meeting.title} required /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="meetingDate">Date</Label><Input id="meetingDate" name="meetingDate" type="date" defaultValue={meeting.meetingDate.toISOString().slice(0, 10)} required /></div>
          <div className="space-y-2"><Label htmlFor="startTime">Start</Label><Input id="startTime" name="startTime" type="time" defaultValue={meeting.startTime ?? ""} /></div>
          <div className="space-y-2"><Label htmlFor="endTime">End</Label><Input id="endTime" name="endTime" type="time" defaultValue={meeting.endTime ?? ""} /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" name="location" defaultValue={meeting.location ?? ""} /></div>
        <div className="space-y-2"><Label htmlFor="agenda">Agenda</Label><Textarea id="agenda" name="agenda" rows={4} defaultValue={meeting.agenda ?? ""} /></div>
        <div className="space-y-2"><Label htmlFor="minutes">Minutes</Label><Textarea id="minutes" name="minutes" rows={6} defaultValue={meeting.minutes ?? ""} /></div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm" defaultValue={meeting.status}>
            {Object.values(MeetingStatus).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Button type="submit">Save meeting</Button>
      </form>

      {canManageAttendance && (
        <form action={saveAttendanceAction.bind(null, id)} className="space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
          <h2 className="font-semibold">Attendance</h2>
          <div className="space-y-3">
            {officials.map((o) => {
              const existing = attendanceMap.get(o.id);
              return (
                <div key={o.id} className="grid gap-2 rounded border border-[var(--color-border)] p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <p className="font-medium">{o.firstName} {o.lastName}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{o.position} · {o.body}</p>
                  </div>
                  <select name={`status_${o.id}`} defaultValue={existing?.status ?? AttendanceStatus.ABSENT} className="h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm">
                    {Object.values(AttendanceStatus).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input name={`remarks_${o.id}`} placeholder="Remarks" defaultValue={existing?.remarks ?? ""} className="h-10 rounded-md border border-[var(--color-border)] bg-white px-3 text-sm" />
                </div>
              );
            })}
          </div>
          <Button type="submit">Save attendance</Button>
        </form>
      )}

      <Button type="button" variant="outline" asChild><Link href="/admin/meetings">Back</Link></Button>
    </div>
  );
}
