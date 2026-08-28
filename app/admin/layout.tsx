import { requireSession } from "@/lib/permissions/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AdminSidebar
        permissions={session.user.permissions}
        userName={session.user.name}
        userEmail={session.user.email}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-[var(--color-border)] bg-white px-6 py-3">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Roles: {session.user.roles.join(", ") || "None"}
          </p>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
