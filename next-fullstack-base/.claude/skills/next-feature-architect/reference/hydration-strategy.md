# Multiple Hydration

For multiple hydration use this reference to handle many hydration on the same component:

```tsx
// src/features/[entity]/views/[Entity]View.tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Hydrate[Entity]s from "@/features/[entity]/hooks/Hydrate[Entity]s";
import Hydrate[OtherEntity]s from "@/features/[other-entity]/hooks/Hydrate[OtherEntity]s";

import [Entity]Table from "../components/[Entity]Table";
import [Entity]Error from "../components/loaders/[Entity]Error";
import [Entity]Loader from "../components/error/[Entity]Loader";

import [OtherEntity]Table from "../components/[OtherEntity]Table";
import [OtherEntity]Error from "../components/loaders/[OtherEntity]Error";
import [OtherEntity]Loader from "../components/error/[OtherEntity]Loader";

const [Entity]View = () => {
  return (
    <Hydrate[Entity]s>
	    <Hydrate[OtherEntity]s>
			<ErrorBoundary fallback={<[Entity]Error />}>
			  <Suspense fallback={<[Entity]Loader />}>
				<[Entity]Table />
			  </Suspense>
			</ErrorBoundary>
			
			<ErrorBoundary fallback={<[OtherEntity]Error />}>
			  <Suspense fallback={<[OtherEntity]Loader />}>
				<[OtherEntity]Table />
			  </Suspense>
			</ErrorBoundary>
		</Hydrate[OtherEntity]s>
    </Hydrate[Entity]s>
  );
}
export default [Entity]View
```