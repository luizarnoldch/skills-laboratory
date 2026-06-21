---
name: next-feature-architect
description: "Scaffolds and maintains the full frontend of a feature-based Next.js app, Use this skill when creating or modifying frontend layers: hook utilization, pages and views integrations, data hydration, frontend business logic."
metadata:
  domain: nextjs-frontend
  stack: tanstack-query,tanstack-form,react-error-boundary
  transport: trpc,rest-api
  pattern: layered-architecture
---
# Next.js Feature Architect

**Frontend feature scaffolding — connects `src/app/` pages to hooks via views and components.**

## Rules

1. **Pages are thin pass-throughs.** `page.tsx` only hydrates data and renders a view. No business logic.
2. **Views wire hydration.** `[Entity]View.tsx` orchestrates `ErrorBoundary` + `Suspense` around data components.
3. **Components import hooks.** Only the entrypoint component calls hooks. Sub-components receive data/callbacks as props.
4. **No complex UI.** Loading = `<div>Loading...</div>`. Error = `<div>Failed to load</div>`. Data = one `<div>` per element. Buttons only for mutations.
5. **Component conventions.** Use `type` for Props (never `interface`). Arrow functions. `export default`.
6. **Default query: suspense.** Use `useSuspenseList[Entity]s` always. Fall back to `useList[Entity]s` only if explicitly requested.

**Ask before scaffolding.** When the request is ambiguous, ask:

> "List page or detail page?"

**Layer isolation:**
- `--page` → only `src/app/**/page.tsx`
- `--view` → only `src/features/[entity]/views/`
- `--view-full` → views + components (loaders, error, table/detail)
- `--all` → pages + views + components

**Dependency:** `frontend → hooks` (hooks must exist first — run next-backend-architect if not)

**Prefer CLI.** Use `./scripts/main.sh` for new scaffolds. Fallback to templates only if CLI unavailable.

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

Use `assets/list-page.md` and `assets/detail-page.md`.

### CLI (preferred)

```bash
# List page
./scripts/main.sh <target> <entity> --page list

# Detail page
./scripts/main.sh <target> <entity> --page detail
```

### Template-driven

Read the matching asset file and replace `[Entity]`/`[entity]` with the actual entity name.

---

## Prefetch with Hydrate Hooks

The `Hydrate[Entity]s` server component wraps the page content. It calls `prefetch()` on the server side so data is available before the client component mounts.

**Default pattern** (suspense): `prefetch` → `ErrorBoundary` → `Suspense` → component using `useSuspenseQuery`.

See `assets/list-page.md` for the complete chain.

### CLI

```bash
./scripts/main.sh <target> <entity> --page list   # includes Hydrate + view + page
```

---

## Query Hooks with Loading/Error States

### Default: useSuspenseList[Entity]s

Parent components handle `ErrorBoundary` + `Suspense`. The data component is clean — no loading/error branches.

```tsx
"use client"
import useSuspenseListProducts from "../../hooks/useSuspenseListProducts"

const ProductsTable = () => {
  const { products } = useSuspenseListProducts()
  return <div>{products.map((p) => <div key={p.id}>{p.name}</div>)}</div>
}
export default ProductsTable
```

### Alternate: useList[Entity]s (only if explicitly requested)

Handles `isLoading`/`error` inline with minimal markup.

```tsx
"use client"
import useListProducts from "../../hooks/useListProducts"

const ProductsList = () => {
  const { products, isLoading, error } = useListProducts()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>
  return <div>{products.map((p) => <div key={p.id}>{p.name}</div>)}</div>
}
export default ProductsList
```

Full reference: `assets/query-usage.md`.

---

## Mutation Hooks (Button Only, No Complex UI)

### Delete: button only

```tsx
"use client"
import useDeleteProduct from "../../hooks/useDeleteProduct"

type DeleteProductButtonProps = { productId: string }
const DeleteProductButton = ({ productId }: DeleteProductButtonProps) => {
  const { mutate, isPending } = useDeleteProduct({ productId })
  return <button onClick={() => mutate()} disabled={isPending}>
    {isPending ? "Deleting..." : "Delete"}
  </button>
}
export default DeleteProductButton
```

### Create: minimal form + button

```tsx
"use client"
import useCreateProduct from "../../hooks/useCreateProduct"

const CreateProductForm = () => {
  const { form, isPending } = useCreateProduct()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); form.handleSubmit() }
  return (
    <form onSubmit={handleSubmit}>
      <form.Field name="name">
        {(field) => <input name={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />}
      </form.Field>
      <button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create"}</button>
    </form>
  )
}
export default CreateProductForm
```

Full reference: `assets/mutation-usage.md` and `reference/component-logic.md`.

---

## Transport Detection

The CLI auto-detects transport (tRPC vs REST API) from existing hooks. Manual override:

```bash
./scripts/main.sh . Product --all --transport api
```

When reading existing hooks to build pages/views, check whether the hook uses:
- **tRPC**: `useTRPC()`, `trpc.[entity].list.queryOptions()`
- **REST API**: `apiFetch`, `apiPrefetch`, raw fetch

Generate matching imports and patterns accordingly.

---

## Notes

- If hooks don't exist yet, run `next-backend-architect` first.
- `src/lib/api.ts` is required for REST API transport. See next-backend-architect's `references/external-api.md`.
- The `components/loaders/` and `components/error/` folders contain minimal placeholders — no spinner libraries, no styled error pages.
- For multi-entity views, see `reference/multi-hydration.md`.
- For form vs button-only logic patterns, see `reference/component-logic.md`.
