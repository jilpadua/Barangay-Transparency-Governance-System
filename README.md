# Barangay Transparency & Governance System (BTGS)

Production-oriented transparency portal for barangay and Sangguniang Kabataan (SK) records, with a blockchain-backed verification layer for publication integrity.

> **DEMO DATA WARNING:** Seeded records are for demonstration only and are **not** official government publications.

Application code lives under **`src/`**. See [docs/](docs/) for the development plan and architecture.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + accessible UI primitives
- PostgreSQL + Prisma ORM
- Auth.js (NextAuth v5) credentials + JWT sessions + RBAC
- Local object storage abstraction (S3-ready)
- Blockchain provider interface (mock/null in Phase 1)

## Prerequisites

- Node.js 20+
- Docker Desktop (for PostgreSQL)
- npm

## Quick start

```bash
# 1. Start database
docker compose up -d

# 2. Install & configure
cp .env.example .env
npm install

# 3. Migrate & seed
npx prisma migrate dev --name init
npm run db:seed

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo staff login

| Email | Password | Role |
|-------|----------|------|
| `admin@demo.barangay.gov.ph` | `DemoAdmin123!` | Super Admin |
| `treasurer@demo.barangay.gov.ph` | `DemoAdmin123!` | Treasurer |
| `secretary@demo.barangay.gov.ph` | `DemoAdmin123!` | Secretary |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run db:migrate` | Prisma migrate |
| `npm run db:seed` | Seed DEMO data |

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/development-plan.md](docs/development-plan.md) | Phased roadmap (Phases 1–6) |
| [docs/architecture.md](docs/architecture.md) | Folder layout, auth, data flow |
| [docs/phase-1-foundation.md](docs/phase-1-foundation.md) | Completed foundation phase |
| [docs/phase-2-cms.md](docs/phase-2-cms.md) | Completed CMS phase |

**Status:** Phase 2 (CMS) complete. Next: Phase 3 — Transparency.

## Environment

See `.env.example` for `DATABASE_URL`, `AUTH_SECRET`, storage, and blockchain variables. Never commit real secrets.
