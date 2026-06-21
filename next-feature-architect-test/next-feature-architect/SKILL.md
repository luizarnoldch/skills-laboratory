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
2. **Views own layout.** `[Entity]View.tsx` wraps `ErrorBoundary` + `Suspense` in a layout `<div>` with Tailwind classes. No layout wrapper components.
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

This skill creates views and components under `src/features/[entity]/`:

```txt
src/features/[entity]/
├── views/
│   ├── [Entity]View.tsx
│   └── [Entity]DetailView.tsx
└── components/
    ├── [Entity]Table/
    │   └── index.tsx
    ├── [Entity]Detail/
    │   └── index.tsx
    ├── [Entity]Form/
    │   └── index.tsx
    ├── Delete[Entity]Button/
    │   └── index.tsx
    ├── loaders/
    ├── error/
    └── empty/
```

Pages go in `src/app/[entity]s/page.tsx` and `src/app/[entity]s/[id]/page.tsx` (scaffold with CLI). Hooks exist in `src/features/[entity]/hooks/` (created by next-backend-architect).

---

## Data Flow

```
page.tsx → Hydrate (prefetch) → [Entity]View (container mx-auto p-6) → ErrorBoundary → Suspense → [Entity]Table (client hook)
```

For multi-entity views, see `reference/multi-hydration.md`.

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

1. **Imports resolve:** Run `npx tsc --noEmit`. If hooks are missing: `ls src/features/[entity]/hooks/` → run next-backend-architect → re-run tsc.
2. **Render:** Start dev server and navigate to the page. Check for rendering errors in browser console.
3. **Data flow:** Verify data loads correctly in Network tab (API calls) or React DevTools (hook state).

The CLI outputs descriptive errors with recovery steps for any scaffolding failures.

---

## Notes

- REST API: `src/lib/api.ts` required; see next-backend-architect docs for config.
- Loaders/error components are minimal; add styling/spinners as needed.
- Multi-entity views: `reference/multi-hydration.md`. Form logic: `reference/component-logic.md`.
