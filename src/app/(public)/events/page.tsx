import { listPublishedEvents } from "@/services/events";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await listPublishedEvents();
  const now = new Date();
  const upcoming = events.filter((e) => e.eventDate >= now);
  const past = events.filter((e) => e.eventDate < now);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Events</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Published barangay and SK events.</p>
      </div>
      <EventSection title="Upcoming" events={upcoming} empty="No upcoming events." />
      <EventSection title="Past events" events={past} empty="No past events." />
    </div>
  );
}

function EventSection({
  title,
  events,
  empty,
}: {
  title: string;
  events: Awaited<ReturnType<typeof listPublishedEvents>>;
  empty: string;
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {events.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {events.map((e) => (
            <li key={e.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
              <div className="mb-1 flex flex-wrap gap-2">
                {e.isDemo && <Badge variant="warning">DEMO</Badge>}
                {e.isSk && <Badge variant="info">SK</Badge>}
              </div>
              <p className="font-semibold">{e.title}</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {formatDate(e.eventDate)}
                {e.startTime && ` · ${e.startTime}`}
                {e.location && ` · ${e.location}`}
              </p>
              {e.description && <p className="mt-2 text-sm">{e.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
