import { listPublishedResolutions } from "@/services/resolutions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

export const dynamic = "force-dynamic";

export default async function ResolutionsPage() {
  const resolutions = await listPublishedResolutions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Resolutions</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Published barangay and SK resolutions.</p>
      </div>
      {resolutions.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">No published resolutions.</p>
      ) : (
        <ul className="space-y-3">
          {resolutions.map((r) => (
            <li key={r.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
              <div className="mb-1 flex flex-wrap gap-2">
                {r.isDemo && <Badge variant="warning">DEMO</Badge>}
                {r.isSk && <Badge variant="info">SK</Badge>}
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)]">{r.referenceNumber}</p>
              <p className="font-semibold">{r.title}</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">{formatDate(r.resolutionDate)}</p>
              {r.description && <p className="mt-2 text-sm">{r.description}</p>}
              {r.documentUrl && (
                <a href={r.documentUrl} className="mt-2 inline-block text-sm text-[var(--color-accent)] hover:underline" target="_blank" rel="noopener noreferrer">
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
