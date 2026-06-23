```tsx
// src/features/[entity]/views/[Entity]View.tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Hydrate[Entity]s from "@/features/[entity]/hooks/Hydrate[Entity]s";

import [Entity]Table from "../components/[Entity]Table";
import [Entity]Error from "../components/loaders/[Entity]Error";
import [Entity]Loader from "../components/error/[Entity]Loader";

const [Entity]View = () => {
  return (
    <Hydrate[Entity]s>
      <div className="container mx-auto p-6">
        <ErrorBoundary fallback={<[Entity]Error />}>
          <Suspense fallback={<[Entity]Loader />}>
            <[Entity]Table />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Hydrate[Entity]s>
  );
}
export default [Entity]View
```