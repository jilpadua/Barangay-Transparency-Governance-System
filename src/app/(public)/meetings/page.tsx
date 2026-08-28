import Link from "next/link";
import { listPublishedMeetings } from "@/services/meetings";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const meetings = await listPublishedMeetings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Meetings</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Published meeting records, agendas, and minutes.</p>
      </div>
      {meetings.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">No published meetings.</p>
      ) : (
        <ul className="space-y-3">
          {meetings.map((m) => (
            <li key={m.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
              <div className="mb-1 flex flex-wrap gap-2">
                {m.isDemo && <Badge variant="warning">DEMO</Badge>}
                <Badge variant="default">{m.meetingType}</Badge>
              </div>
              <Link href={`/meetings/${m.id}`} className="font-semibold text-[var(--color-primary)] hover:underline">
                {m.title}
              </Link>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {formatDate(m.meetingDate)}
                {m.location && ` · ${m.location}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
