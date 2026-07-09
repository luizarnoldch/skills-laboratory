# Router Checklist (REST)

Applies to: `src/features/[entity]/server/[entity].api.ts`

## Required imports
```ts
import * as [entity]Service from "./[entity].service"
```

## Required handlers
1. `GET` — returns all; calls `[entity]Service.list()`; returns `Response.json(result)` with status `200`
2. `GET /[id]` — returns one; calls `[entity]Service.get(id)`; `404` if not found
3. `POST` — creates; calls `[entity]Service.create(await request.json())`; returns `201`
4. `PUT` or `PATCH` — updates; calls `[entity]Service.update(id, await request.json())`; `404` if not found
5. `DELETE` — removes; calls `[entity]Service.remove(id)`; `404` if not found; returns `{ success: true }`

## Error handling pattern
All handlers must `try/catch`:
- "not found" → `Response.json({ error: "[Entity] not found" }, { status: 404 })`
- "already exists" → `Response.json({ error: err.message }, { status: 409 })`
- Other → `Response.json({ error: "Failed to ${action} [entity]" }, { status: 500 })`
