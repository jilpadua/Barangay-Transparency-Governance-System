import Link from "next/link";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { createEventAction } from "../actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  await requirePermission(PERMISSIONS.EVENTS_MANAGE);
  return (
    <div className="space-y-6">
      <PageHeader title="Add event" description="Create a new event." />
      <form action={createEventAction} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={4} /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="eventDate">Date</Label><Input id="eventDate" name="eventDate" type="date" required /></div>
          <div className="space-y-2"><Label htmlFor="startTime">Start</Label><Input id="startTime" name="startTime" type="time" /></div>
          <div className="space-y-2"><Label htmlFor="endTime">End</Label><Input id="endTime" name="endTime" type="time" /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" name="location" /></div>
        <div className="space-y-2"><Label htmlFor="organizer">Organizer</Label><Input id="organizer" name="organizer" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isSk" /> SK event</label>
        <div className="flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="outline" asChild><Link href="/admin/events">Cancel</Link></Button></div>
      </form>
    </div>
  );
}
