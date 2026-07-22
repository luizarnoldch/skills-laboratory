# Next.js tRPC Backend — Steps to Complete

Use 4 parent tasks in this exact order:

- [ ] **1.0 Prisma Schema & Migration**
  Add or update Prisma model. Generate migration with `prisma migrate dev`.

- [ ] **2.0 Zod Schema**
  Define input/output validation schemas matching Prisma model shapes.

- [ ] **3.0 tRPC Router**
  Add queries and mutations under `src/features/<entity>/server/`. Validate inputs with Zod. Wire router in `src/trpc/routers/_app.ts`.

- [ ] **4.0 TanStack Query & Form Hooks**
  Create query hook for data fetching and form hook for mutations under `src/features/<entity>/hooks/`.

Each parent task breaks into sub-tasks with **Context**, **Files**, and **Skills**.

If a step is not needed → mark done, write "not required".

---

## Sub-task Format

```
- [ ] 1.0 Parent Task Title
  **Context:** Why this exists.

  - [ ] 1.1 Sub-task description
    **Context:** Specific thing to implement.
    **Files:** `path/to/files/`.
    **Skills:** `skill-name`.
```

---

### Relevant Files

**Prisma:**
- `prisma/schema.prisma` (modified)
- `prisma/migrations/YYYYMMDDHHMMSS_add_{feature}/migration.sql`

**Zod Schema:**
- `src/features/{feature}/schemas/{feature}.schema.ts`

**Transport (pick ONE):**
- `src/features/{feature}/server/{feature}.router.ts` (IF tRPC + Prisma detected)
- `src/features/{feature}/server/{feature}.api.ts` (ELSE — requires API docs/Swagger)
- `src/features/{feature}/server/{feature}.service.ts`
- `src/features/{feature}/server/{feature}.repository.ts`
- `src/trpc/routers/_app.ts` (modified — wire new router, tRPC only)

**Hydration (Server Component, no 'use client'):**
- `src/features/{feature}/hooks/Hydrate{Entity}s.tsx`

**Hooks (all 'use client'):**
- `src/features/{feature}/hooks/useList{Entity}s.ts`
- `src/features/{feature}/hooks/useSuspenseList{Entity}s.ts`
- `src/features/{feature}/hooks/useCreate{Entity}.ts`
- `src/features/{feature}/hooks/useUpdate{Entity}.ts` (props: id, data)
- `src/features/{feature}/hooks/useDelete{Entity}.ts` (props: id)

Omit files not required by the feature. Add extra files if the feature demands them.

---

## Next.js Feature Layer Order (Backend)

```
src/features/{feature}/
├── schemas/
│   └── {feature}.schema.ts      ← Zod input/output schemas. No runtime deps.
├── server/
│   ├── {feature}.router.ts      ← tRPC queries & mutations (IF tRPC + Prisma/Drizzle)
│   ├── {feature}.api.ts         ← HTTP transport (ELSE — requires Swagger/docs)
│   ├── {feature}.service.ts     ← pure business logic, no tRPC/Next imports
│   └── {feature}.repository.ts  ← data access, Prisma/Drizzle only
└── hooks/
    ├── Hydrate{Entity}s.tsx     ← Server Component; prefetches via tRPC queryOptions()
    ├── useList{Entity}s.ts      ← 'use client', list query hook
    ├── useSuspenseList{Entity}s.ts  ← 'use client', suspense variant
    ├── useCreate{Entity}.ts     ← 'use client', mutation + form helpers
    ├── useUpdate{Entity}.ts     ← 'use client', mutation + form (props: id, data)
    └── useDelete{Entity}.ts     ← 'use client', mutation (props: id)
```

Wire the new router in `src/trpc/routers/_app.ts` (tRPC only).

---

## Hydration Strategy

Hydration layouts and prefetch strategy are reusable across tRPC features.

**tRPC prefetch:** Use `prefetch(trpc.{entity}.list.queryOptions())` in `Hydrate{Entity}s.tsx`.

**External API prefetch:** Use `apiPrefetch({ queryKey, queryFn })` in `Hydrate{Entity}s.tsx`.

Wrap page content with `<Suspense fallback={...}>` and `<ErrorBoundary fallback={...}>` at the layout level. `Hydrate*` components wrap children inside `HydrationBoundary`.

Full patterns and code examples: see `references/hydration-suspense.md`.
