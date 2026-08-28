import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { getAnnouncement, getAnnouncementPublicationTransitions } from "@/services/announcements";
import { updateAnnouncementAction, transitionAnnouncementAction } from "../../actions";
import { PageHeader } from "@/components/admin/page-header";
import { PublicationActions } from "@/components/admin/publication-actions";
import { PublicationStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.ANNOUNCEMENTS_VIEW);
  const { id } = await params;
  let announcement;
  try { announcement = await getAnnouncement(id); } catch { notFound(); }
  const transitions = await getAnnouncementPublicationTransitions(id);

  return (
    <div className="space-y-6">
      <PageHeader title={announcement.title} actions={<div className="flex gap-2">{announcement.isDemo && <Badge variant="warning">DEMO</Badge>}<PublicationStatusBadge status={announcement.publicationStatus} /></div>} />
      <PublicationActions recordId={id} currentStatus={announcement.publicationStatus} availableTransitions={transitions} onTransition={transitionAnnouncementAction} />
      <form action={updateAnnouncementAction.bind(null, id)} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" defaultValue={announcement.title} required /></div>
        <div className="space-y-2"><Label htmlFor="content">Content</Label><Textarea id="content" name="content" rows={8} defaultValue={announcement.content} required /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="publishDate">Publish date</Label><Input id="publishDate" name="publishDate" type="date" defaultValue={announcement.publishDate?.toISOString().slice(0, 10) ?? ""} /></div>
          <div className="space-y-2"><Label htmlFor="expireDate">Expire date</Label><Input id="expireDate" name="expireDate" type="date" defaultValue={announcement.expireDate?.toISOString().slice(0, 10) ?? ""} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={announcement.featured} /> Featured</label>
        <div className="flex gap-2"><Button type="submit">Save</Button><Button type="button" variant="outline" asChild><Link href="/admin/announcements">Back</Link></Button></div>
      </form>
    </div>
  );
}
