import { listPublishedAnnouncements } from "@/services/announcements";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const announcements = await listPublishedAnnouncements();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Announcements</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Official barangay announcements.</p>
      </div>
      {announcements.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">No announcements at this time.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((a) => (
            <li key={a.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
              <div className="mb-2 flex flex-wrap gap-2">
                {a.isDemo && <Badge variant="warning">DEMO</Badge>}
                {a.featured && <Badge variant="primary">Featured</Badge>}
              </div>
              <h2 className="text-lg font-semibold">{a.title}</h2>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {formatDate(a.publishedAt ?? a.publishDate)}
              </p>
              <div className="prose prose-sm mt-3 max-w-none whitespace-pre-wrap text-sm">
                {a.content}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
