import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { getEvent, getEventPublicationTransitions } from "@/services/events";
import { updateEventAction, transitionEventAction } from "../../actions";
import { PageHeader } from "@/components/admin/page-header";
import { PublicationActions } from "@/components/admin/publication-actions";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.EVENTS_VIEW);
  const { id } = await params;
  let event;
  try { event = await getEvent(id); } catch { notFound(); }
  const transitions = await getEventPublicationTransitions(id);
  const eventDate = event.eventDate.toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/admin/events"
        backLabel="Back to events"
        title={event.title}
        actions={<div className="flex gap-2">{event.isDemo && <Badge variant="warning">DEMO</Badge>}<PublicationStatusBadge status={event.publicationStatus} /></div>}
      />
      <PublicationActions recordId={id} currentStatus={event.publicationStatus} availableTransitions={transitions} onTransition={transitionEventAction} />
      <form action={updateEventAction.bind(null, id)} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" defaultValue={event.title} required /></div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={4} defaultValue={event.description ?? ""} /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="eventDate">Date</Label><Input id="eventDate" name="eventDate" type="date" defaultValue={eventDate} required /></div>
          <div className="space-y-2"><Label htmlFor="startTime">Start</Label><Input id="startTime" name="startTime" type="time" defaultValue={event.startTime ?? ""} /></div>
          <div className="space-y-2"><Label htmlFor="endTime">End</Label><Input id="endTime" name="endTime" type="time" defaultValue={event.endTime ?? ""} /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" name="location" defaultValue={event.location ?? ""} /></div>
        <div className="space-y-2"><Label htmlFor="organizer">Organizer</Label><Input id="organizer" name="organizer" defaultValue={event.organizer ?? ""} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isSk" defaultChecked={event.isSk} /> SK event</label>
        <div className="flex gap-2"><Button type="submit">Save</Button></div>
      </form>
    </div>
  );
}
