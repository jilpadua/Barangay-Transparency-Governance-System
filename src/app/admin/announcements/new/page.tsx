import Link from "next/link";
import { requirePermission } from "@/lib/permissions/server";
import { PERMISSIONS } from "@/lib/permissions";
import { createAnnouncementAction } from "../actions";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const dynamic = "force-dynamic";

export default async function NewAnnouncementPage() {
  await requirePermission(PERMISSIONS.ANNOUNCEMENTS_MANAGE);
  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/admin/announcements"
        backLabel="Back to announcements"
        title="Add announcement"
      />
      <form action={createAnnouncementAction} className="max-w-2xl space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-6">
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
        <div className="space-y-2"><Label htmlFor="content">Content</Label><Textarea id="content" name="content" rows={8} required /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="publishDate">Publish date</Label><Input id="publishDate" name="publishDate" type="date" /></div>
          <div className="space-y-2"><Label htmlFor="expireDate">Expire date</Label><Input id="expireDate" name="expireDate" type="date" /></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" /> Featured</label>
        <div className="flex gap-2"><Button type="submit">Create</Button><Button type="button" variant="outline" asChild><Link href="/admin/announcements">Cancel</Link></Button></div>
      </form>
    </div>
  );
}
