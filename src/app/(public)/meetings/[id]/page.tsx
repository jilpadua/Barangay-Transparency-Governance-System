import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedMeeting } from "@/services/meetings";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let meeting;
  try {
    meeting = await getPublishedMeeting(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/meetings" className="text-sm text-[var(--color-accent)] hover:underline">← Back to meetings</Link>
        <div className="mt-2 flex flex-wrap gap-2">
          {meeting.isDemo && <Badge variant="warning">DEMO</Badge>}
          <Badge variant="default">{meeting.meetingType}</Badge>
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">{meeting.title}</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {formatDate(meeting.meetingDate)}
          {meeting.location && ` · ${meeting.location}`}
        </p>
      </div>
      {meeting.agenda && (
        <section>
          <h2 className="mb-2 font-semibold">Agenda</h2>
          <p className="whitespace-pre-wrap text-sm">{meeting.agenda}</p>
        </section>
      )}
      {meeting.minutes && (
        <section>
          <h2 className="mb-2 font-semibold">Minutes</h2>
          <p className="whitespace-pre-wrap text-sm">{meeting.minutes}</p>
        </section>
      )}
      {meeting.attendances.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Attendance</h2>
          <ul className="space-y-1 text-sm">
            {meeting.attendances.map((a) => (
              <li key={a.id}>
                {a.official.firstName} {a.official.lastName} — {a.status}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
