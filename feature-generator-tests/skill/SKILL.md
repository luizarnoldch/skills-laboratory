---
name: next-backend-architect
description: "Scaffolds and maintains specific backend layers for a feature-based Next.js app. Use this skill when creating or modifying individual layers: Zod schemas, tRPC routers, REST APIs, business logic services, database repositories, or TanStack Query / TanStack Form hooks. Triggers on: 'create schema for X', 'add CRUD', 'tRPC router', 'API endpoint', 'Zod schema', 'TanStack hooks', 'form validation', 'scaffold feature', 'repository pattern', or any Next.js backend scaffolding request. Pairs with the next-trpc-developer agent for full plan → implement workflow."
metadata:
  domain: nextjs-backend
  stack: tanstack-query,tanstack-form,zod-v4,trpc
  orm: prisma,drizzle
  transport: trpc,rest-api
  pattern: layered-architecture
---
# Next.js Backend Architect

**Modular backend scaffolding — only create what the user explicitly requests.**

## Rules

**Ask before scaffolding.** When the request is ambiguous, ask:

> "Which layers? `schema`, `server`, `hooks`, or `all`?"

**Layer isolation:**
- `schema` → only `.schema.ts`
- `server` → only `server/` (auto-creates schema if missing)
- `hooks` → only `hooks/` (auto-creates server + schema if missing)
- `all` → full stack

**Defaults:** `--transport trpc`, `--database prisma`

**Dependency chain:** `hooks → server → schema` (CLI handles auto-creation)

**Prefer CLI.** Use `./scripts/main.sh` for new scaffolds. Fallback to templates only if CLI unavailable.

## Architecture Overview

Each feature lives under `src/features/[entity]/`:

```txt
schemas/
└── [entity].schema.ts          ← Zod v4 schema + inferred types

server/
├── [entity].router.ts          ← tRPC (input parse → call service → error map)
├── [entity].api.ts             ← HTTP (input parse → call service → status codes)
├── [entity].service.ts         ← business logic → call repository
└── [entity].repository.ts      ← data access (Prisma / Drizzle)

hooks/
├── Hydrate[Entity]s.tsx        ← Server Component prefetch
├── useList[Entity]s.tsx        ← Client query
├── useSuspenseList[Entity]s.tsx ← Suspense variant
├── useCreate[Entity].tsx       ← Create mutation + form
├── useUpdate[Entity].tsx       ← Update mutation + form
└── useDelete[Entity].tsx       ← Delete mutation
```

---

### Schema (if requested)

1. **Use the CLI** (preferred):
   ```bash
   ./scripts/main.sh <target> <entity> --schema --database <prisma|drizzle>
   ```

2. **Fallback to templates** if CLI unavailable:
   - Prisma: use `assets/prisma-schema.md`
   - Drizzle: use `assets/drizzle-schema.md`

Templates use Zod v4. Replace `[Entity]` with PascalCase, `[entity]` with camelCase.

---

### Server (if requested)

1. **Use the CLI** (preferred):
   ```bash
   ./scripts/main.sh <target> <entity> --server --transport <trpc|api> --database <prisma|drizzle>
   ```

2. **Fallback to inline creation** if CLI unavailable:
   - **tRPC transport**: Create router + service + repository
   - **API transport**: Create single `[entity].api.ts` file

**API transport requires** `src/lib/api.ts` (see `references/external-api.md`)

### Hooks (if requested)

1. **Use the CLI** (preferred):
   ```bash
   ./scripts/main.sh <target> <entity> --hooks --transport <trpc|api>
   ```

2. **Fallback to templates** if CLI unavailable:
   - tRPC: `assets/*-hook.md`
   - REST API: `assets/*-api-hook.md`

---

## Notes

- If you need to setup the external API client, read `references/external-api.md`