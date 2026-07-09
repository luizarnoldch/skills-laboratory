# Service Checklist

Applies to: `src/features/[entity]/server/[entity].service.ts`

## Required imports
```ts
import * as [entity]Repository from "./[entity].repository"
import type { Create[Entity]Input, Update[Entity]Input } from "../schemas/[entity].schema"
import type { [Entity] } from "../schemas/[entity].schema"
```

## Required exports
1. `list` — `async (): Promise<[Entity][]>` → returns `[entity]Repository.findAll()`
2. `get` — `async (id: string): Promise<[Entity]>` → null-check then throw `Error("[Entity] not found")`
3. `create` — `async (data: Create[Entity]Input): Promise<[Entity]>` → duplicate-check then create
4. `update` — `async (id: string, data: Update[Entity]Input): Promise<[Entity]>` → null-check then update
5. `remove` — `async (id: string): Promise<void>` → null-check then remove

## Rules
- No direct DB calls. Every call must go through the repository.
- Error messages must include the exact entity name for string-matching in the router (e.g. "Product not found").
- `create` must guard duplicates with `findByName(data.name)` before inserting.
