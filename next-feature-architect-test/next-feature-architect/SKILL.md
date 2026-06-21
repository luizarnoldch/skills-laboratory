---
name: next-feature-architect
description: "Creates and maintains Next.js frontend features: pages, components, views, and hook integrations with server-side data prefetching, Suspense boundaries, and mutations. Use this skill when: building React components (.tsx), creating Next.js pages with app router, implementing TanStack Query hooks, adding Suspense and error boundaries, building forms and mutations, configuring server-side rendering (SSR)."
metadata:
  version: 1.0.0
  domain: nextjs-frontend
  stack: tanstack-query,tanstack-form,react-error-boundary
  transport: trpc,rest-api
  pattern: layered-architecture
---
# Next.js Feature Architect

**Frontend feature scaffolding — connects `src/app/` pages to hooks via views and components.**

## Rules

1. **Pages are thin.** `page.tsx` hydrates data and renders a view. No business logic.
2. **Views orchestrate.** `[Entity]View.tsx` wraps `ErrorBoundary` + `Suspense` around data components.
3. **Components use hooks.** Only the entrypoint component calls hooks; sub-components receive data/callbacks as props.
4. **Minimal UI.** Loading/error = single `<div>`. Data = one `<div>` per element. Buttons for mutations only.
5. **Type conventions.** Use `type` for Props (never `interface`). Arrow functions. `export default`.
6. **Default: suspense.** Use `useSuspenseList[Entity]s`. Fall back to `useList[Entity]s` only if explicitly requested.

**When ambiguous, ask:** "List page or detail page?"

**Layer isolation flags:**
- `--page` → `src/app/**/page.tsx` only
- `--view` → `src/features/[entity]/views/` only
- `--view-full` → views + components
- `--all` → pages + views + components

**Dependency:** hooks must exist first—run next-backend-architect if not. **Prefer CLI** (`./scripts/main.sh`).

## Architecture Overview

Each feature lives under `src/features/[entity]/`:

```txt
src/app/
├── [entity]s/
│   └── page.tsx                      ← List page (thin pass-through)
└── [entity]s/
    └── [id]/
        └── page.tsx                  ← Detail page (thin pass-through)

src/features/[entity]/
├── hooks/                            ← (Created by next-backend-architect)
│   ├── Hydrate[Entity]s.tsx
│   ├── useList[Entity]s.tsx
│   ├── useSuspenseList[Entity]s.tsx
│   ├── useCreate[Entity].ts
│   ├── useUpdate[Entity].ts
│   └── useDelete[Entity].ts
├── views/                            ← (Created by this skill)
│   ├── [Entity]View.tsx
│   └── [Entity]DetailView.tsx
└── components/                       ← (Created by this skill)
    ├── [Entity]Table/
    │   └── index.tsx
    ├── [Entity]Detail/
    │   └── index.tsx
    ├── [Entity]Form/
    │   └── index.tsx
    ├── Delete[Entity]Button/
    │   └── index.tsx
    ├── loaders/
    │   ├── [Entity]ViewLoader.tsx
    │   └── [Entity]DetailViewLoader.tsx
    ├── error/
    │   ├── [Entity]ViewError.tsx
    │   └── [Entity]DetailViewError.tsx
    └── empty/
        ├── [Entity]ViewEmpty.tsx
        └── [Entity]DetailViewEmpty.tsx
```

---

## Data Flow

```
page.tsx (server) → Hydrate (prefetch) → [Entity]View → ErrorBoundary → Suspense → [Entity]Table (client hook)
```

### Single entity flow

```
page.tsx
  └─ Hydrate[Entity]s        ← Server Component: prefetches data
      └─ [Entity]View        ← Client boundary orchestrator
          ├─ ErrorBoundary   ← Catches query errors
          │   └─ [Entity]ViewError
          └─ Suspense        ← Shows loader while query resolves
              └─ [Entity]Table  ← Calls useSuspenseList[Entity]s()
```

### Multi-entity flow

See `reference/multi-hydration.md`.

---

## Connect App to Views (pages)

### CLI (preferred)

```bash
./scripts/main.sh <target> <entity> --page list      # List page
./scripts/main.sh <target> <entity> --page detail    # Detail page
./scripts/main.sh <target> <entity> --view-full      # Views + components
./scripts/main.sh <target> <entity> --all            # Pages + views + components
```

### Template-driven (fallback)

Use `assets/list-page.md` or `assets/detail-page.md` and replace `[Entity]`/`[entity]` placeholders.

---

## Transport Detection

The CLI auto-detects transport from existing hooks. Override with:

```bash
./scripts/main.sh . Product --all --transport api
```

Detection cues:
- **tRPC:** `useTRPC()`, `trpc.[entity].list.queryOptions()`
- **REST API:** `apiFetch`, `apiPrefetch`, raw fetch

---

## Verify & Validate

After scaffolding:

1. **Imports resolve:** Verify hook imports exist; run `npx tsc --noEmit` for TypeScript errors.
2. **Render:** Start dev server and navigate to the page. Check for rendering errors.
3. **Data flow:** Verify data loads correctly in browser network tab or React DevTools.

The CLI outputs descriptive errors with recovery steps (e.g., "Hooks not found, run next-backend-architect first").

---

## Notes

- REST API: `src/lib/api.ts` required; see next-backend-architect docs for config.
- Loaders/error components are minimal; add styling/spinners as needed.
- Multi-entity views: `reference/multi-hydration.md`. Form logic: `reference/component-logic.md`.
