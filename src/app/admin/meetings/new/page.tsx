import Link from "next/link";
import { MeetingStatus } from "@prisma/client";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { createMeetingAction } from "../actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function NewMeetingPage() {
  await requirePermission(PERMISSIONS.MEETINGS_MANAGE);
  return (
    <div className="space-y-6">
      <PageHeader title="Add meeting" />
      <form action={createMeetingAction} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="meetingType">Type</Label><Input id="meetingType" name="meetingType" required placeholder="e.g. Regular Session" /></div>
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="meetingDate">Date</Label><Input id="meetingDate" name="meetingDate" type="date" required /></div>
          <div className="space-y-2"><Label htmlFor="startTime">Start</Label><Input id="startTime" name="startTime" type="time" /></div>
          <div className="space-y-2"><Label htmlFor="endTime">End</Label><Input id="endTime" name="endTime" type="time" /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" name="location" /></div>
        <div className="space-y-2"><Label htmlFor="agenda">Agenda</Label><Textarea id="agenda" name="agenda" rows={4} /></div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" className="flex h-10 w-full rounded-md border border-[var(--color-border)] bg-white px-3 text-sm" defaultValue={MeetingStatus.SCHEDULED}>
            {Object.values(MeetingStatus).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="outline" asChild><Link href="/admin/meetings">Cancel</Link></Button></div>
      </form>
    </div>
  );
}
