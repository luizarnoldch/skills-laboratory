# Hydration, Suspense & Error Boundary Reference

Reusable hydration layouts and prefetch strategies for `src/features/[entity]/hooks/`.

Supports both tRPC and External API backends.

---

## 1. tRPC Server Setup

`src/trpc/server.tsx`:

```tsx
import "server-only"; // <-- ensure this file cannot be imported from the client
import {
  createTRPCOptionsProxy,
  TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { appRouter } from "./routers/_app";

// ...

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
```

---

## 2. tRPC Hydrate Component

`src/features/{entity}/hooks/Hydrate{Entity}s.tsx`:

```tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ReactNode } from "react";

type HydrateLegalAreasProps = {
  children: ReactNode;
};

const HydrateLegalAreas = ({ children }: HydrateLegalAreasProps) => {
  prefetch(trpc.legalArea.list.queryOptions());
  return <HydrateClient>{children}</HydrateClient>;
};

export default HydrateLegalAreas;
```

---

## 3. External API Server Setup

`src/trpc/server.tsx`:

```tsx
import "server-only"; // <-- ensure this file cannot be imported from the client

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy, type TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

// ...


/**
 * Generic prefetch helper for both tRPC and standard fetchers.
 */
export function apiPrefetch(
  options: Parameters<ReturnType<typeof getQueryClient>["prefetchQuery"]>[0],
) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(options);
}
```

---

## 4. External API Hydrate Component

`src/features/{entity}/hooks/Hydrate{Entity}s.tsx`:

```tsx
import { apiPrefetch, HydrateClient } from "@/trpc/server";
import { ReactNode } from "react";
import { listMilestones } from "../api/milestone.api";

type HydrateMilestonesProps = {
  children: ReactNode;
  projectId?: string;
};

const HydrateMilestones = ({ children, projectId }: HydrateMilestonesProps) => {
  apiPrefetch({
    queryKey: ["milestones", "list", projectId],
    queryFn: () => listMilestones(projectId),
  });

  return <HydrateClient>{children}</HydrateClient>;
};

export default HydrateMilestones;
```

---

## 5. Suspense & Error Boundary Usage

Wrap page content at the layout or view level:

```tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import HydrateProducts from "@/features/product/hooks/HydrateProducts";
import { ProductView } from "@/features/product/views/ProductView";

const ProductPage = () => {
  return (
    <HydrateProducts>
      <Suspense fallback={<ProductSkeleton />}>
        <ErrorBoundary fallback={<ProductError />}>
          <ProductView />
        </ErrorBoundary>
      </Suspense>
    </HydrateProducts>
  );
};

export default ProductPage;
```

### Skeleton Fallback

```tsx
const ProductSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  );
};
```

### Error Fallback

```tsx
const ProductError = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="space-y-2">
      <p className="text-destructive">Failed to load products: {error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};
```

---

## 6. Rules

- `Hydrate*` components are **always** Server Components — never add `'use client'`.
- `HydrateClient` wraps children in `HydrationBoundary` with dehydrated state.
- `prefetch` is for tRPC query options; `apiPrefetch` is for manual queryKey/queryFn.
- Both `prefetch` and `apiPrefetch` use `getQueryClient()` for request-scoped caching.
- Suspense boundaries catch loading states; ErrorBoundary catches runtime failures.
- The same `HydrateClient` + `Suspense` + `ErrorBoundary` pattern is reusable across all features.
- For external API, pass any required props (e.g., `projectId`) to the Hydrate component and forward them to `apiPrefetch`.
