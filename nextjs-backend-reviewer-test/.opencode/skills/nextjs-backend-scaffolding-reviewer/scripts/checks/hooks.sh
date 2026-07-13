#!/usr/bin/env bash
set -euo pipefail

# check_hooks <target> <entity_kebab> <entity_pascal> <entity_camel> <transport>
check_hooks() {
  local target="$1" entity_kebab="$2" entity_pascal="$3" entity_camel="$4" transport="$5"
  local dir="$target/src/features/$entity_kebab/hooks"
  local reasons=()

  local hydrate="$dir/Hydrate${entity_pascal}s.tsx"
  local use_list="$dir/useList${entity_pascal}s.tsx"
  local use_suspense="$dir/useSuspenseList${entity_pascal}s.tsx"
  local use_create="$dir/useCreate${entity_pascal}.tsx"
  local use_update="$dir/useUpdate${entity_pascal}.tsx"
  local use_delete="$dir/useDelete${entity_pascal}.tsx"

  for f in "$hydrate" "$use_list" "$use_suspense" "$use_create" "$use_update" "$use_delete"; do
    require_file "$f" "$(basename "$f") missing" || true
  done
  if [[ ${#reasons[@]} -gt 0 ]]; then
    fail_layer hooks "${reasons[@]}"
    return 1
  fi

  for f in "$use_suspense" "$use_create" "$use_update" "$use_delete"; do
    require_grep "$f" '^"use client"' "$(basename "$f") must start with \"use client\"" || true
  done

  if [[ "$transport" == "trpc" ]]; then
    require_grep "$hydrate" 'HydrateClient' "$(basename "$hydrate") must import HydrateClient from @/trpc/server" || true
    require_grep "$hydrate" "prefetch\(trpc\.${entity_camel}\.list" "$(basename "$hydrate") must call prefetch(trpc.${entity_camel}.list.queryOptions())" || true

    require_grep "$use_suspense" 'useTRPC.*from "@/trpc/client"' "$(basename "$use_suspense") must import useTRPC from @/trpc/client" || true
    require_grep "$use_suspense" "useSuspenseQuery\(trpc\.${entity_camel}\.list" "$(basename "$use_suspense") must call useSuspenseQuery(trpc.${entity_camel}.list.queryOptions())" || true

    require_grep "$use_list" "useQuery\(trpc\.${entity_camel}\.list" "$(basename "$use_list") must call useQuery(trpc.${entity_camel}.list.queryOptions())" || true

    require_grep "$use_create" 'useForm' "$(basename "$use_create") must use useForm from @tanstack/react-form" || true
    require_grep "$use_create" "create${entity_pascal}Schema" "$(basename "$use_create") must wire create${entity_pascal}Schema into the form validators" || true
    require_grep "$use_create" 'toast' "$(basename "$use_create") must import toast from sonner" || true

    require_grep "$use_update" "trpc\.${entity_camel}\.update\.mutationOptions" "$(basename "$use_update") must call trpc.${entity_camel}.update.mutationOptions()" || true

    require_grep "$use_delete" "trpc\.${entity_camel}\.delete\.mutationOptions" "$(basename "$use_delete") must call trpc.${entity_camel}.delete.mutationOptions()" || true

    for f in "$hydrate" "$use_list" "$use_suspense" "$use_create" "$use_update" "$use_delete"; do
      if grep -Eq 'apiFetch|apiPrefetch' "$f"; then
        reasons+=("$(basename "$f") mixes REST transport (apiFetch/apiPrefetch) into a tRPC feature")
      fi
    done

  elif [[ "$transport" == "api" ]]; then
    require_grep "$hydrate" 'apiPrefetch' "$(basename "$hydrate") must call apiPrefetch({ queryKey, queryFn })" || true
    require_grep "$hydrate" "list${entity_pascal}s.*from \"\.\./server/$entity_kebab\.api\"" "$(basename "$hydrate") must import list${entity_pascal}s from ../server/$entity_kebab.api" || true

    require_grep "$use_suspense" "list${entity_pascal}s" "$(basename "$use_suspense") must call list${entity_pascal}s() from the REST api client" || true
    require_grep "$use_list" "list${entity_pascal}s" "$(basename "$use_list") must call list${entity_pascal}s() from the REST api client" || true
    require_grep "$use_create" "create${entity_pascal}" "$(basename "$use_create") must call create${entity_pascal}(...) from the REST api client" || true
    require_grep "$use_update" "update${entity_pascal}" "$(basename "$use_update") must call update${entity_pascal}(...) from the REST api client" || true
    require_grep "$use_delete" "delete${entity_pascal}" "$(basename "$use_delete") must call delete${entity_pascal}(...) from the REST api client" || true

    for f in "$hydrate" "$use_list" "$use_suspense" "$use_create" "$use_update" "$use_delete"; do
      if grep -Eq 'useTRPC\(\)' "$f"; then
        reasons+=("$(basename "$f") mixes tRPC transport (useTRPC) into a REST feature")
      fi
    done

  else
    reasons+=("unknown transport '$transport' (expected trpc or api)")
  fi

  if [[ ${#reasons[@]} -eq 0 ]]; then
    pass_layer hooks
  else
    fail_layer hooks "${reasons[@]}"
  fi
}