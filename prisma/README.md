# Prisma / database layer

Database schema, migrations, and demo seed data for BTGS. Application code uses Prisma Client via `@/lib/db` in `src/lib/db/index.ts` — not from this folder directly.

## Layout

```text
prisma/
├── schema.prisma       # generator + datasource (entry point)
├── enums/
│   └── common.prisma   # shared enums (PublicationStatus, etc.)
├── models/             # domain-grouped models
│   ├── auth.prisma
│   ├── barangay.prisma
│   ├── officials.prisma
│   ├── finance.prisma
│   ├── projects.prisma
│   ├── documents.prisma
│   ├── meetings.prisma
│   ├── legal.prisma
│   ├── communications.prisma
│   ├── feedback.prisma
│   ├── audit.prisma
│   └── blockchain.prisma
├── migrations/         # migration history — do not rewrite
└── seed/               # modular demo seed scripts
    └── index.ts        # entry point
```

Root [`prisma.config.ts`](../../prisma.config.ts) points the CLI at the `prisma/` directory (multi-file schema) and configures migrations + seed.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run db:generate` | Generate `@prisma/client` |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:push` | Push schema without migration (prototyping only) |
| `npm run db:seed` | Run demo seed (`prisma/seed/index.ts`) |
| `npm run db:studio` | Open Prisma Studio |
| `npx prisma validate` | Validate schema files |

`postinstall` runs `prisma generate` automatically.

## Prisma Client in the app

Import the shared singleton:

```ts
import { prisma } from "@/lib/db";
```

Do not create `new PrismaClient()` in route handlers or components. The seed CLI uses its own client in `prisma/seed/index.ts`.

## Changing the schema safely

1. Edit the relevant file under `prisma/models/` or `prisma/enums/`.
2. Run `npx prisma validate`.
3. Run `npx prisma migrate dev --name describe_change` for a new migration.
4. Run `npx prisma generate`.
5. Before committing a structural-only split, confirm zero drift:

   ```bash
   npx prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma --script
   ```

   Expected output: `This is an empty migration.`

Do not manually edit historical migrations unless fixing a known deployment issue.

## Seed data

All seed records are **DEMO only** — not official government publications.

- Entry: `prisma/seed/index.ts`
- Domain modules: `auth.ts`, `barangay.ts`, `officials.ts`, `finance.ts`, etc.
- `cleanup.ts` wipes tables in FK-safe order before re-seeding.

Demo admin: `admin@demo.barangay.gov.ph` / `DemoAdmin123!`

## Where business logic belongs

- **Schema / relations / indexes** → `prisma/models/`
- **Infrastructure client** → `src/lib/db`
- **Domain CRUD and workflows** → `src/services/` (Phase 2+)
- **Thin route handlers** → `src/app/`

Do not add repositories unless query reuse or testability clearly benefits.
