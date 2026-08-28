# Services

Domain and business logic for BTGS live here.

**Convention:** UI pages, layouts, and API route handlers stay thin. Create, update, publish, calculate totals, and workflow transitions belong in `src/services/` (for example `services/projects.ts`, `services/budgets.ts`).

Services should:

- Use Prisma via `@/lib/db`
- Enforce permissions via `@/lib/permissions` / server helpers
- Write audit logs via `@/lib/audit` for important mutations
- Keep blockchain anchoring non-blocking (queue jobs; do not fail CMS when the network is down)

Phase 2+ CRUD modules should land in this folder rather than inside React components.
