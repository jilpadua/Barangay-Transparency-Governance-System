import { PublicFooter, PublicHeader } from "@/components/public/site-chrome";
import { prisma } from "@/lib/db";

async function getBarangayName() {
  try {
    const barangay = await prisma.barangay.findFirst({
      orderBy: { createdAt: "asc" },
      select: { name: true },
    });
    return barangay?.name ?? "Demo Barangay";
  } catch {
    return "Demo Barangay";
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const name = await getBarangayName();
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader barangayName={name} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <PublicFooter barangayName={name} />
    </div>
  );
}
