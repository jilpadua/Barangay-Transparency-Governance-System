# BTGS development plan

Production-oriented web application for barangay residents and staff: transparent, searchable, mobile-friendly access to officials, budgets, expenditures, projects, procurement, meetings, resolutions, ordinances, events, accomplishments, documents, and citizen feedback — with a **blockchain-backed verification** layer used as a tamper-evident publication proof (not as the primary database).

## Primary goals

- Publicly accessible transparency information
- Easy for ordinary residents and non-technical barangay staff
- Secure role-based access
- Responsive (mobile, tablet, desktop)
- Searchable, document-oriented, audit-friendly
- Blockchain-verifiable
- Ready for future multi-barangay expansion

**UI priority:** Clarity → Trust → Readability → Transparency → Usability (civic/government style, not marketing flash).

## Stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | Next.js server actions / API routes |
| Database | PostgreSQL + Prisma |
| Auth | Auth.js (credentials), sessions, RBAC, MFA-ready fields |
| Files | Object storage abstraction (local disk in dev, S3-compatible in prod) |
| Blockchain | Provider abstraction; EVM-compatible network later |

## Implementation phases

### Phase 1 — Foundation (complete)

- Next.js, TypeScript, Tailwind, Prisma, PostgreSQL
- Authentication and RBAC
- Public and admin layout shells
- Shared UI / design tokens
- Full domain schema + DEMO seed
- Hashing and blockchain **interfaces** (stubs)

See [phase-1-foundation.md](./phase-1-foundation.md).

### Phase 2 — CMS

- Officials (barangay and SK)
- Documents (upload, versioning, publish)
- Events and announcements
- Meetings and attendance
- Resolutions and ordinances

### Phase 3 — Transparency

- Budgets and allocations
- Expenses (server-side totals)
- Projects and programs
- Procurement
- Accomplishments
- Public transparency dashboard

### Phase 4 — Citizen services

- Feedback form and tracking numbers
- Status workflow for residents
- Global search
- Printable / PDF-friendly reports

### Phase 5 — Blockchain

- Canonical hashing + EVM (or mock) provider
- Queue/job anchoring (non-blocking for CMS)
- Public `/verify/[recordId]`
- QR codes pointing to verify URLs
- Blockchain admin dashboard and retries

### Phase 6 — Hardening

- Security headers, rate limiting, a11y polish
- Performance, backups, structured logging
- Broader unit / integration / e2e tests
- Deployment

## Working principles

1. Inspect existing code before adding modules; reuse components and services.
2. Keep business logic out of UI — prefer `src/services/`.
3. Enforce permissions on the server; never trust the client.
4. Blockchain downtime must not break normal CMS operations.
5. Mark DEMO data clearly; never confuse seed data with official records.
6. Work incrementally; do not generate the entire application in one pass.

## Documentation map

- [Architecture](./architecture.md) — folders and system design
- Root [README.md](../README.md) — setup and demo logins
