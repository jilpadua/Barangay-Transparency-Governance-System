import Link from "next/link";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { cn } from "@/utils";

type NavItem = {
  href: string;
  label: string;
  permission?: string | string[];
};

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/officials", label: "Officials", permission: PERMISSIONS.OFFICIALS_VIEW },
      { href: "/admin/documents", label: "Documents", permission: PERMISSIONS.DOCUMENTS_VIEW },
      { href: "/admin/meetings", label: "Meetings", permission: PERMISSIONS.MEETINGS_VIEW },
      { href: "/admin/resolutions", label: "Resolutions", permission: PERMISSIONS.RESOLUTIONS_VIEW },
      { href: "/admin/ordinances", label: "Ordinances", permission: PERMISSIONS.ORDINANCES_VIEW },
      { href: "/admin/events", label: "Events", permission: PERMISSIONS.EVENTS_VIEW },
      { href: "/admin/announcements", label: "Announcements", permission: PERMISSIONS.ANNOUNCEMENTS_VIEW },
      { href: "/admin/accomplishments", label: "Accomplishments", permission: PERMISSIONS.ACCOMPLISHMENTS_VIEW },
    ],
  },
  {
    title: "Transparency",
    items: [
      { href: "/admin/budgets", label: "Budgets", permission: PERMISSIONS.BUDGETS_VIEW },
      { href: "/admin/expenses", label: "Expenses", permission: PERMISSIONS.EXPENSES_VIEW },
      { href: "/admin/projects", label: "Projects", permission: PERMISSIONS.PROJECTS_VIEW },
      { href: "/admin/procurement", label: "Procurement", permission: PERMISSIONS.PROCUREMENT_VIEW },
    ],
  },
  {
    title: "Citizen",
    items: [
      { href: "/admin/feedback", label: "Feedback", permission: PERMISSIONS.FEEDBACK_VIEW },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/blockchain", label: "Blockchain", permission: PERMISSIONS.BLOCKCHAIN_VIEW },
      { href: "/admin/users", label: "Users", permission: PERMISSIONS.USERS_VIEW },
      { href: "/admin/audit-logs", label: "Audit logs", permission: PERMISSIONS.AUDIT_VIEW },
      { href: "/admin/settings", label: "Settings", permission: PERMISSIONS.SETTINGS_MANAGE },
    ],
  },
];

function canSee(
  permissions: string[],
  permission?: string | string[],
): boolean {
  if (!permission) return true;
  return hasPermission(
    permissions,
    permission as Parameters<typeof hasPermission>[1],
  );
}

export function AdminSidebar({
  permissions,
  userName,
  userEmail,
}: {
  permissions: string[];
  userName?: string | null;
  userEmail?: string | null;
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-white">
      <div className="border-b border-[var(--color-border)] px-4 py-4">
        <p className="text-xs uppercase tracking-wide text-[var(--color-muted-foreground)]">
          Admin
        </p>
        <p className="font-semibold text-[var(--color-primary)]">BTGS</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Admin">
        {navSections.map((section) => {
          const items = section.items.filter((i) =>
            canSee(permissions, i.permission),
          );
          if (items.length === 0) return null;
          return (
            <div key={section.title} className="mb-4">
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm hover:bg-[var(--color-muted)]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-[var(--color-border)] p-4">
        <p className="truncate text-sm font-medium">{userName ?? "User"}</p>
        <p className="truncate text-xs text-[var(--color-muted-foreground)]">
          {userEmail}
        </p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
          className="mt-3"
        >
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Sign out
          </Button>
        </form>
        <Link
          href="/"
          className="mt-2 block text-center text-xs text-[var(--color-accent)] hover:underline"
        >
          View public site
        </Link>
      </div>
    </aside>
  );
}
