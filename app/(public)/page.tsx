import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { PublicationStatus, ProjectStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const barangay = await prisma.barangay.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (!barangay) return null;

    const fiscalYear = new Date().getFullYear();
    const [budgets, expenses, activeProjects, completedProjects, documents, events, announcements, officials] =
      await Promise.all([
        prisma.budget.findMany({
          where: {
            barangayId: barangay.id,
            fiscalYear,
            publicationStatus: PublicationStatus.PUBLISHED,
          },
        }),
        prisma.expense.findMany({
          where: {
            barangayId: barangay.id,
            publicationStatus: PublicationStatus.PUBLISHED,
            expenseDate: {
              gte: new Date(`${fiscalYear}-01-01`),
              lte: new Date(`${fiscalYear}-12-31`),
            },
          },
        }),
        prisma.project.findMany({
          where: {
            barangayId: barangay.id,
            publicationStatus: PublicationStatus.PUBLISHED,
            status: { in: [ProjectStatus.ONGOING, ProjectStatus.APPROVED, ProjectStatus.PROCUREMENT] },
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
        }),
        prisma.project.findMany({
          where: {
            barangayId: barangay.id,
            publicationStatus: PublicationStatus.PUBLISHED,
            status: ProjectStatus.COMPLETED,
          },
          take: 5,
          orderBy: { updatedAt: "desc" },
        }),
        prisma.document.findMany({
          where: {
            barangayId: barangay.id,
            publicationStatus: PublicationStatus.PUBLISHED,
            visibility: "PUBLIC",
          },
          take: 5,
          orderBy: { publishedAt: "desc" },
        }),
        prisma.event.findMany({
          where: {
            barangayId: barangay.id,
            publicationStatus: PublicationStatus.PUBLISHED,
            eventDate: { gte: new Date() },
          },
          take: 5,
          orderBy: { eventDate: "asc" },
        }),
        prisma.announcement.findMany({
          where: {
            barangayId: barangay.id,
            publicationStatus: PublicationStatus.PUBLISHED,
          },
          take: 5,
          orderBy: { publishedAt: "desc" },
        }),
        prisma.official.findMany({
          where: {
            barangayId: barangay.id,
            publicationStatus: PublicationStatus.PUBLISHED,
            isActive: true,
            body: "BARANGAY",
          },
          take: 6,
          orderBy: { position: "asc" },
        }),
      ]);

    const totalBudget = budgets.reduce(
      (sum, b) => sum + Number(b.approvedAmount),
      0,
    );
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const remaining = totalBudget - totalExpense;
    const utilization =
      totalBudget > 0 ? (totalExpense / totalBudget) * 100 : 0;

    return {
      barangay,
      fiscalYear,
      totalBudget,
      totalExpense,
      remaining,
      utilization,
      activeProjects,
      completedProjects,
      documents,
      events,
      announcements,
      officials,
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  if (!data) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
          Barangay Transparency & Governance System
        </h1>
        <p className="text-[var(--color-muted-foreground)]">
          Database is not initialized yet. Run migrations and seed to load demo
          data.
        </p>
      </div>
    );
  }

  const {
    barangay,
    fiscalYear,
    totalBudget,
    totalExpense,
    remaining,
    utilization,
    activeProjects,
    completedProjects,
    documents,
    events,
    announcements,
    officials,
  } = data;

  return (
    <div className="space-y-10">
      <section className="space-y-3 border-b border-[var(--color-border)] pb-8">
        <Badge variant="warning">DEMO</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-primary)]">
          {barangay.name}
        </h1>
        {barangay.tagline && (
          <p className="text-lg text-[var(--color-muted-foreground)]">
            {barangay.tagline}
          </p>
        )}
        <p className="max-w-3xl text-[var(--color-foreground)]">
          {barangay.generalInfo ??
            "Public access to barangay and SK transparency information."}
        </p>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {barangay.municipality}, {barangay.province}
        </p>
      </section>

      <section aria-labelledby="transparency-summary">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              id="transparency-summary"
              className="text-xl font-semibold text-[var(--color-primary)]"
            >
              Transparency summary ({fiscalYear})
            </h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Figures are calculated server-side from published records.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/transparency">Full dashboard</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Annual budget</CardDescription>
              <CardTitle>{formatCurrency(totalBudget)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total expenditure</CardDescription>
              <CardTitle>{formatCurrency(totalExpense)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Remaining balance</CardDescription>
              <CardTitle>{formatCurrency(remaining)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Budget utilization</CardDescription>
              <CardTitle>{utilization.toFixed(1)}%</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <SectionList
          title="Active projects"
          href="/projects"
          empty="No active published projects."
          items={activeProjects.map((p) => ({
            id: p.id,
            title: p.title,
            meta: `${p.projectCode} · ${p.status}`,
          }))}
        />
        <SectionList
          title="Completed projects"
          href="/projects"
          empty="No completed published projects."
          items={completedProjects.map((p) => ({
            id: p.id,
            title: p.title,
            meta: p.projectCode,
          }))}
        />
        <SectionList
          title="Recent documents"
          href="/documents"
          empty="No published documents."
          items={documents.map((d) => ({
            id: d.id,
            title: d.title,
            meta: d.category,
          }))}
        />
        <SectionList
          title="Upcoming events"
          href="/events"
          empty="No upcoming events."
          items={events.map((e) => ({
            id: e.id,
            title: e.title,
            meta: e.eventDate.toLocaleDateString("en-PH"),
          }))}
        />
        <SectionList
          title="Announcements"
          href="/announcements"
          empty="No announcements."
          items={announcements.map((a) => ({
            id: a.id,
            title: a.title,
            meta: a.featured ? "Featured" : "Announcement",
          }))}
        />
        <SectionList
          title="Officials"
          href="/officials"
          empty="No published officials."
          items={officials.map((o) => ({
            id: o.id,
            title: `${o.firstName} ${o.lastName}`,
            meta: o.position,
          }))}
        />
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Citizen feedback</CardTitle>
            <CardDescription>
              Submit suggestions, complaints, or information requests. Track
              status with your reference number.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/feedback">Submit feedback</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verify a record</CardTitle>
            <CardDescription>
              Check whether a published document or project matches its
              blockchain verification proof.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary">
              <Link href="/verify">Open verification</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function SectionList({
  title,
  href,
  items,
  empty,
}: {
  title: string;
  href: string;
  empty: string;
  items: { id: string; title: string; meta: string }[];
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">
          {title}
        </h2>
        <Link
          href={href}
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          View all
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">{empty}</p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-white">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-3">
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {item.meta}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
