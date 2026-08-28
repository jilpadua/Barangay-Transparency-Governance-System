# BTGS architecture

## Repository layout

```text
BTGS MVP/
  docs/                 # Plans and architecture (this folder)
  prisma/               # Schema, migrations, seed
  tests/                # Unit tests
  src/
    app/                # Next.js App Router (public, admin, api, login)
    components/         # ui / public / admin / shared / providers
    lib/                # Infrastructure: auth, db, permissions, storage, …
    services/           # Domain / business logic (CRUD, workflows)
    hooks/              # React hooks
    utils/              # Pure helpers (formatting, cn, …)
    types/              # Ambient / shared TypeScript types
    middleware.ts       # Protect /admin; redirect logged-in users from /login
  package.json, next.config.ts, tsconfig.json, docker-compose.yml, …
```

Path alias: `@/*` maps to `src/*` (for example `@/lib/db`, `@/components/ui/button`).

### Folder roles

| Path | Role |
|------|------|
| `src/app` | Routes and layouts only — thin; call services for logic |
| `src/components` | Presentational and shared UI |
| `src/lib` | Cross-cutting infrastructure (Prisma client, Auth.js, RBAC helpers, storage, hashing, blockchain providers) |
| `src/services` | Domain operations (create project, publish document, calculate budget totals) |
| `src/utils` | Pure functions with no I/O |
| `src/hooks` | Client React hooks |
| `prisma` | Database schema and migrations (stays at repo root) |
| `docs` | Product and engineering documentation |

## Auth and RBAC

- **Auth.js** credentials provider; JWT sessions for Edge-friendly middleware.
- Roles: Super Admin, Barangay Admin, Treasurer, Secretary, SK Admin, Staff, Auditor.
- Permission checks via `requirePermission()` on admin pages and API handlers.
- Middleware gates `/admin/*` (login required). Fine-grained checks remain server-side.

## Data flow

```text
Browser → App Router / API → Auth + RBAC → services → Prisma / storage
                                              ↓
                                    audit log (append-only)
                                              ↓
                         (Phase 5) hash → blockchain job queue → proof
```

Financial aggregates (budget, expenditure, utilization) must be computed on the server, not only in the browser.

## Blockchain layering

Blockchain is an **integrity layer**, not the system of record.

- Store on-chain: record id, type, version, content hash, timestamp, tx reference.
- Do **not** store personal data, PDFs, passwords, or sensitive resident data on-chain.
- Provider interface (`BlockchainProvider`) allows swapping networks.
- If the network is down, CMS continues; proofs stay pending/failed for admin retry.

## Multi-barangay

Models include `barangayId`. The MVP UI operates on one configured barangay; the schema supports expansion.

## Privacy

Public pages must not expose resident addresses, phone numbers, government IDs, private complaint details, or internal-only documents.
