# Repository Checklist

Applies to: `src/features/[entity]/server/[entity].repository.ts`

## Required imports (Prisma)
```ts
import { db } from "@/lib/db"
import type { Create[Entity]Input, Update[Entity]Input } from "../schemas/[entity].schema"
import type { [Entity] } from "../schemas/[entity].schema"
```

## Required exports
1. `findAll` — `async (): Promise<[Entity][]>` → `db.[entityTable].findMany({ orderBy: { createdAt: "desc" } })`
2. `findById` — `async (id: string): Promise<[Entity] | null>` → `db.[entityTable].findUnique({ where: { id } })`
3. `findByName` — `async (name: string): Promise<[Entity] | null>` → `db.[entityTable].findFirst({ where: { name } })`
4. `create` — `async (data: Create[Entity]Input): Promise<[Entity]>` → `db.[entityTable].create({ data })`
5. `update` — `async (id: string, data: Update[Entity]Input): Promise<[Entity]>` → `db.[entityTable].update({ where: { id }, data })`
6. `remove` — `async (id: string): Promise<void>` → `db.[entityTable].delete({ where: { id } })`

## Rules
- Use Prisma client `db` imported from `@/lib/db`.
- Table reference must be `db.[entityTable]` (snake_case plural name).
- No business logic; pure ORM delegation only.
