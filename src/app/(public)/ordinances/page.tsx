import { listPublishedOrdinances } from "@/services/ordinances";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function OrdinancesPage() {
  const ordinances = await listPublishedOrdinances();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Ordinances</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Published barangay ordinances.</p>
      </div>
      {ordinances.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">No published ordinances.</p>
      ) : (
        <ul className="space-y-3">
          {ordinances.map((o) => (
            <li key={o.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
              <div className="mb-1 flex flex-wrap gap-2">
                {o.isDemo && <Badge variant="warning">DEMO</Badge>}
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)]">{o.referenceNumber}</p>
              <p className="font-semibold">{o.title}</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">{formatDate(o.ordinanceDate)}</p>
              {o.description && <p className="mt-2 text-sm">{o.description}</p>}
              {o.documentUrl && (
                <a href={o.documentUrl} className="mt-2 inline-block text-sm text-[var(--color-accent)] hover:underline" target="_blank" rel="noopener noreferrer">
                  View document
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
