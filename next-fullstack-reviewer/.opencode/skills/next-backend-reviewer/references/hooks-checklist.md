# Hooks Checklist (tRPC)

Applies to files under `src/features/[entity]/hooks/`.

## Required files (all 6)
1. `Hydrate[Entity]s.tsx`
2. `useList[Entity]s.tsx`
3. `useSuspenseList[Entity]s.tsx`
4. `useCreate[Entity].tsx`
5. `useUpdate[Entity].tsx`
6. `useDelete[Entity].tsx`

## Common checks for all hook files
- [ ] File name matches exact PascalCase pattern.
- [ ] Hooks that use `useTRPC`, `useMutation`, `useSuspenseQuery`, `useForm` start with `"use client"`.
- [ ] `useTRPC` is imported from `@/trpc/client`.
- [ ] Transport is NOT mixed (e.g. no `apiFetch` alongside `useTRPC`).

## Hydrate[Entity]s.tsx
- [ ] Imports `trpc` and `dehydrate`, `HydrationBoundary` from `@/trpc/server`.
- [ ] `await trpc.[entity].list.prefetch()` called inside the component before rendering children.
- [ ] Returns `<HydrationBoundary state={dehydrate(trpc.queryClient)}>`.

## useSuspenseList[Entity]s.tsx
- [ ] Uses `useSuspenseQuery(trpc.[entity].list.queryOptions())`.
- [ ] Returns `{ [entity]s: data }`.

## useList[Entity]s.tsx
- [ ] Uses `useQuery(trpc.[entity].list.queryOptions())`.
- [ ] Returns `{ [entity]s: data, isLoading, isError }`.
- [ ] No suspense version used here (that's why the separate file exists).

## useCreate[Entity].tsx
- [ ] Uses `useMutation`, `useQueryClient` from `@tanstack/react-query`.
- [ ] Uses `useForm` from `@tanstack/react-form`.
- [ ] Imports `toast` from `sonner`.
- [ ] Imports `create[Entity]Schema` and `Create[Entity]Input` from `../schemas/[entity].schema`.
- [ ] `onSuccess` invalidates `trpc.[entity].list.queryOptions()`.
- [ ] `validators: { onChange: create[Entity]Schema }` wired into `useForm`.
- [ ] `onSubmit` calls `mutation.mutateAsync(value)` then `form.reset()`.
- [ ] Returns `{ form, ...mutation }`.

## useUpdate[Entity].tsx
- [ ] Same imports as create plus update schema and type.
- [ ] Component or hook is keyed by `id` prop/input.
- [ ] `useForm` initialised with existing entity data.
- [ ] Calls `trpc.[entity].update.mutationOptions()`.
- [ ] On success invalidates list query.
- [ ] Returns `{ form, ...mutation }`.

## useDelete[Entity].tsx
- [ ] Uses `useMutation`.
- [ ] Calls `trpc.[entity].delete.mutationOptions()`.
- [ ] On success invalidates list query and shows toast.
- [ ] Returns the mutation object.
