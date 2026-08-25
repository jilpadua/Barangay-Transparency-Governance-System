import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { PublicationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function OfficialsPage() {
  const officials = await prisma.official.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      isActive: true,
    },
    include: { committee: true },
    orderBy: [{ body: "asc" }, { position: "asc" }],
  });

  const barangayOfficials = officials.filter((o) => o.body === "BARANGAY");
  const skOfficials = officials.filter((o) => o.body === "SK");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Officials
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Public profiles only. Private contact details are not shown.
        </p>
      </div>

      <OfficialSection title="Barangay officials" officials={barangayOfficials} />
      <OfficialSection title="SK officials" officials={skOfficials} />
    </div>
  );
}

function OfficialSection({
  title,
  officials,
}: {
  title: string;
  officials: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    publicBio: string | null;
    isDemo: boolean;
    committee: { name: string } | null;
  }[];
}) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {officials.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">
          No published officials in this section.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {officials.map((o) => (
            <li
              key={o.id}
              className="rounded-lg border border-[var(--color-border)] bg-white p-4"
            >
              <div className="mb-2 flex flex-wrap gap-2">
                {o.isDemo && <Badge variant="warning">DEMO</Badge>}
              </div>
              <p className="font-semibold">
                {o.firstName} {o.lastName}
              </p>
              <p className="text-sm text-[var(--color-accent)]">{o.position}</p>
              {o.committee && (
                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  {o.committee.name}
                </p>
              )}
              {o.publicBio && (
                <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                  {o.publicBio}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
