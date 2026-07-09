# Hooks Checklist (REST)

Applies to files under `src/features/[entity]/hooks/` when transport is REST.

## Required files (all 6)
Same as tRPC:
1. `Hydrate[Entity]s.tsx`
2. `useList[Entity]s.tsx`
3. `useSuspenseList[Entity]s.tsx`
4. `useCreate[Entity].tsx`
5. `useUpdate[Entity].tsx`
6. `useDelete[Entity].tsx`

## Differences from tRPC
- [ ] Hooks import `apiFetch` and `apiPrefetch` from `@/lib/api` instead of `useTRPC`.
- [ ] Queries call raw `fetch` or `apiFetch` to the REST endpoint (e.g. `fetch('/api/[entity]s')`).
- [ ] Mutations call `fetch('/api/[entity]s', { method: 'POST', body: JSON.stringify(data) })`.
- [ ] `Hydrate[Entity]s` prefetches via `apiPrefetch('/api/[entity]s')`.
- [ ] Invalidation uses `queryClient.invalidateQueries({ queryKey: ['[entity]s'] })` instead of `trpc.[entity].list.queryOptions()`.

## Rules
- Do NOT import `useTRPC`.
- Do NOT reference `trpc` anywhere.
- Ensure `src/lib/api.ts` exists before these hooks are validated.
