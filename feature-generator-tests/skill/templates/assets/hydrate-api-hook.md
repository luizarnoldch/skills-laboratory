```tsx
// Hydrate[Entity].tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server"
import { ReactNode } from "react"

type Hydrate[Entity]sProps = {
  children: ReactNode
}

const Hydrate[Entity]s = ({ children }: Hydrate[Entity]sProps) => {
  apiPrefetch({
      queryKey: ["[entity]s", "list"],
      queryFn: () => list[Entity]s(),
    })

  return (
    <HydrateClient>
      {children}
    </HydrateClient>
  )
}

export default Hydrate[Entity]s
```