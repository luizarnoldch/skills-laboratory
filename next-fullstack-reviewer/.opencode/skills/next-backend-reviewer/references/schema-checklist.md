# Schema Checklist

Applies to: `src/features/[entity]/schemas/[entity].schema.ts`

## Required imports
```ts
import { z } from "zod"
```

## Required exports
1. `[entity]Schema` (base Zod object)
2. `create[Entity]Schema`
3. `update[Entity]Schema`
4. `delete[Entity]Schema`
5. `[Entity]` — inferred type
6. `Create[Entity]Input` — inferred type
7. `Update[Entity]Input` — inferred type
8. `Delete[Entity]Input` — inferred type

## Pattern checks
- `create[Entity]Schema` must use `.omit({ id: true, createdAt: true })` or equivalent.
- `update[Entity]Schema` must use `.partial().required({ id: true })`.
- `delete[Entity]Schema` must be `z.object({ id: z.uuid() })`.
- All types exported with `type` keyword, never `interface`.
- Default values for fields (dates, enums) should be handled in the service layer, not hard-coded in the schema.
