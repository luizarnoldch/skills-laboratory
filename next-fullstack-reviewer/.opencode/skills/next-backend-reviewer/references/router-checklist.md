# Router Checklist (tRPC)

Applies to: `src/features/[entity]/server/[entity].router.ts`

## Required imports
```ts
import { createTRPCRouter, protectedProcedure, baseProcedure } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import * as [entity]Service from "./[entity].service"
import { create[Entity]Schema, update[Entity]Schema, delete[Entity]Schema } from "../schemas/[entity].schema"
```

## Required routes (all 5)
1. `list` — `baseProcedure.query(...)` calls `[entity]Service.list()`
2. `get` — `baseProcedure.input(delete[Entity]Schema).query(...)` calls `[entity]Service.get(input.id)`
3. `create` — `protectedProcedure.input(create[Entity]Schema).mutation(...)` calls `[entity]Service.create(input)`
4. `update` — `protectedProcedure.input(update[Entity]Schema).mutation(...)` calls `[entity]Service.update(input.id, input)`
5. `delete` — `protectedProcedure.input(delete[Entity]Schema).mutation(...)` calls `[entity]Service.remove(input.id)` and returns `{ success: true }`

## Error handling pattern
Every route must be wrapped in `try/catch`:
- "not found" → `TRPCError({ code: "NOT_FOUND", message: "[Entity] not found" })`
- "already exists" → `TRPCError({ code: "CONFLICT", message: err.message })`
- Other → `TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to ${action} [entity]" })`
