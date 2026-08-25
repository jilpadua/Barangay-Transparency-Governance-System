# Barangay Transparency & Governance System (BTGS)

Production-oriented transparency portal for barangay and Sangguniang Kabataan (SK) records, with a blockchain-backed verification layer for publication integrity.

> **DEMO DATA WARNING:** Seeded records are for demonstration only and are **not** official government publications.

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

## Architecture notes

- Business logic lives under `lib/` and future `services/` — keep UI thin.
- Permissions are enforced server-side (`requirePermission`); never trust the client.
- Financial totals must be computed on the server.
- Blockchain is optional and non-blocking; CMS works when the network is down.
- Multi-barangay ready via `Barangay` + `barangayId` FKs (MVP uses one demo barangay).

## Phase status

- **Phase 1 (Foundation):** Complete — auth, RBAC, schema, shells, design system
- Phase 2+: CMS, transparency modules, feedback, blockchain anchoring

## Environment

See `.env.example` for `DATABASE_URL`, `AUTH_SECRET`, storage, and blockchain variables. Never commit real secrets.
