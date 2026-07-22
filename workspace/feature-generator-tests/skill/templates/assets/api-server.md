```ts
// [entity].api.ts
import { apiFetch } from "@/lib/api"
import type { Create[Entity]Request, Create[Entity]Response, Update[Entity]Request, Update[Entity]Response } from "../schema/[entity].schema"

export async function list[Entity](): Promise<[Entity]Response[]> {
  return apiFetch<[Entity]Response[]>(`/${[entity]}`, { method: "GET" })
}

export async function create[Entity](data: Create[Entity]Request): Promise<Create[Entity]Response> {
  return apiFetch<Create[Entity]Response>(`/${[entity]}`, { method: "POST", body: JSON.stringify(data) })
}

export async function get[Entity](id: string): Promise<[Entity]Response> {
  return apiFetch<[Entity]Response>(`/${[entity]}/${id}`, { method: "GET" })
}

export async function update[Entity](id: string, data: Update[Entity]Request): Promise<Update[Entity]Response> {
  return apiFetch<Update[Entity]Response>(`/${[entity]}/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export async function delete[Entity](id: string): Promise<void> {
  return apiFetch<void>(`/${[entity]}/${id}`, { method: "DELETE" })
}
```
