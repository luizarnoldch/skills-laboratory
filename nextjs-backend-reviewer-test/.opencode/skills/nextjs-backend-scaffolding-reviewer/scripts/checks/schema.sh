#!/usr/bin/env bash
set -euo pipefail

# check_schema <target> <entity_kebab> <entity_pascal> <entity_camel> <database>
check_schema() {
  local target="$1" entity_kebab="$2" entity_pascal="$3" entity_camel="$4" database="$5"
  local file="$target/src/features/$entity_kebab/schemas/$entity_kebab.schema.ts"
  local reasons=()

  require_file "$file" "schema file missing" || { fail_layer schema "${reasons[@]}"; return 1; }

  require_grep "$file" 'from "zod"' "must import z from zod" || true
  require_grep "$file" "delete${entity_pascal}Schema[[:space:]]*=" "must export delete${entity_pascal}Schema" || true
  require_grep "$file" "create${entity_pascal}Schema[[:space:]]*=" "must export create${entity_pascal}Schema" || true
  require_grep "$file" "update${entity_pascal}Schema[[:space:]]*=" "must export update${entity_pascal}Schema" || true

  if [[ "$database" == "drizzle" ]]; then
    require_grep "$file" "createSelectSchema\(" "drizzle schema must derive from createSelectSchema" || true
    require_grep "$file" "createInsertSchema\(" "drizzle schema must derive from createInsertSchema" || true
    require_grep "$file" "createUpdateSchema\(" "drizzle schema must derive from createUpdateSchema" || true
  else
    require_grep "$file" "${entity_camel}Schema[[:space:]]*=[[:space:]]*z\.object" "must export ${entity_camel}Schema as z.object(...)" || true
    require_grep "$file" '\.omit\(' "create${entity_pascal}Schema must use .omit(...)" || true
    require_grep "$file" '\.partial\(\)' "update${entity_pascal}Schema must use .partial()" || true
  fi

  require_grep "$file" "type ${entity_pascal}[[:space:]]*=[[:space:]]*z\.infer" "must export type ${entity_pascal} via z.infer" || true
  require_grep "$file" "type Create${entity_pascal}Input" "must export type Create${entity_pascal}Input" || true
  require_grep "$file" "type Update${entity_pascal}Input" "must export type Update${entity_pascal}Input" || true

  if grep -Eq '\binterface\b' "$file"; then
    reasons+=("must not use the interface keyword")
  fi

  if [[ ${#reasons[@]} -eq 0 ]]; then
    pass_layer schema
  else
    fail_layer schema "${reasons[@]}"
  fi
}