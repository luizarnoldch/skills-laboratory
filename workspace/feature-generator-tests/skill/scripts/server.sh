#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$SCRIPT_DIR/lib/helpers.sh"
source "$SCRIPT_DIR/lib/replacer.sh"

generate_trpc_router() {
  local entity="$1"
  local entity_pascal
  local entity_camel
  local entity_kebab
  
  entity_pascal=$(to_pascal_case "$entity")
  entity_camel=$(to_camel_case "$entity")
  entity_kebab=$(to_kebab_case "$entity")
  
  cat <<EOF
import { z } from "zod"
import { createTRPCRouter, protectedProcedure, baseProcedure } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import * as ${entity_camel}Service from "./${entity_kebab}.service"
import { create${entity_pascal}Schema, update${entity_pascal}Schema } from "../schemas/${entity_kebab}.schema"

export const ${entity_camel}Router = createTRPCRouter({
  list: baseProcedure.query(async () => {
    try {
      return await ${entity_camel}Service.list()
    } catch (err) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to list ${entity_kebab}s" })
    }
  }),

  get: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        return await ${entity_camel}Service.get(input.id)
      } catch (err) {
        if (err instanceof Error && err.message.includes("not found")) {
          throw new TRPCError({ code: "NOT_FOUND", message: "${entity_pascal} not found" })
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to get ${entity_kebab}" })
      }
    }),

  create: protectedProcedure
    .input(create${entity_pascal}Schema)
    .mutation(async ({ input }) => {
      try {
        return await ${entity_camel}Service.create(input)
      } catch (err) {
        if (err instanceof Error && err.message.includes("already exists")) {
          throw new TRPCError({ code: "CONFLICT", message: err.message })
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create ${entity_kebab}" })
      }
    }),

  update: protectedProcedure
    .input(update${entity_pascal}Schema)
    .mutation(async ({ input }) => {
      try {
        return await ${entity_camel}Service.update(input.id, input)
      } catch (err) {
        if (err instanceof Error && err.message.includes("not found")) {
          throw new TRPCError({ code: "NOT_FOUND", message: "${entity_pascal} not found" })
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update ${entity_kebab}" })
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await ${entity_camel}Service.remove(input.id)
        return { success: true }
      } catch (err) {
        if (err instanceof Error && err.message.includes("not found")) {
          throw new TRPCError({ code: "NOT_FOUND", message: "${entity_pascal} not found" })
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete ${entity_kebab}" })
      }
    }),
})
EOF
}

generate_trpc_service() {
  local entity="$1"
  local entity_pascal
  local entity_camel
  local entity_kebab
  
  entity_pascal=$(to_pascal_case "$entity")
  entity_camel=$(to_camel_case "$entity")
  entity_kebab=$(to_kebab_case "$entity")
  
  cat <<EOF
import type { z } from "zod"
import * as ${entity_camel}Repository from "./${entity_kebab}.repository"
import type { Create${entity_pascal}Schema, Update${entity_pascal}Schema } from "../schemas/${entity_kebab}.schema"

export async function list() {
  return ${entity_camel}Repository.findAll()
}

export async function get(id: string) {
  const ${entity_camel} = await ${entity_camel}Repository.findById(id)
  if (!${entity_camel}) {
    throw new Error("${entity_pascal} not found")
  }
  return ${entity_camel}
}

export async function create(data: z.infer<typeof Create${entity_pascal}Schema>) {
  const existing = await ${entity_camel}Repository.findByName(data.name)
  if (existing) {
    throw new Error("${entity_pascal} already exists")
  }
  return ${entity_camel}Repository.create(data)
}

export async function update(id: string, data: z.infer<typeof Update${entity_pascal}Schema>) {
  const ${entity_camel} = await ${entity_camel}Repository.findById(id)
  if (!${entity_camel}) {
    throw new Error("${entity_pascal} not found")
  }
  return ${entity_camel}Repository.update(id, data)
}

export async function remove(id: string) {
  const ${entity_camel} = await ${entity_camel}Repository.findById(id)
  if (!${entity_camel}) {
    throw new Error("${entity_pascal} not found")
  }
  await ${entity_camel}Repository.remove(id)
}
EOF
}

generate_prisma_repository() {
  local entity="$1"
  local entity_pascal
  local entity_camel
  local entity_kebab
  local entity_snake
  
  entity_pascal=$(to_pascal_case "$entity")
  entity_camel=$(to_camel_case "$entity")
  entity_kebab=$(to_kebab_case "$entity")
  entity_snake=$(to_snake_case "$entity")
  
  cat <<EOF
import { db } from "@/lib/db"
import type { Create${entity_pascal}Schema, Update${entity_pascal}Schema } from "../schemas/${entity_kebab}.schema"

export async function findAll() {
  return db.${entity_snake}.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function findById(id: string) {
  return db.${entity_snake}.findUnique({
    where: { id },
  })
}

export async function findByName(name: string) {
  return db.${entity_snake}.findFirst({
    where: { name },
  })
}

export async function create(data: Create${entity_pascal}Schema) {
  return db.${entity_snake}.create({
    data,
  })
}

export async function update(id: string, data: Update${entity_pascal}Schema) {
  return db.${entity_snake}.update({
    where: { id },
    data,
  })
}

export async function remove(id: string) {
  return db.${entity_snake}.delete({
    where: { id },
  })
}
EOF
}

generate_drizzle_repository() {
  local entity="$1"
  local entity_pascal
  local entity_camel
  local entity_kebab
  local entity_snake
  
  entity_pascal=$(to_pascal_case "$entity")
  entity_camel=$(to_camel_case "$entity")
  entity_kebab=$(to_kebab_case "$entity")
  entity_snake=$(to_snake_case "$entity")
  
  cat <<EOF
import { db } from "@/lib/db"
import { ${entity_snake} } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import type { Create${entity_pascal}Schema, Update${entity_pascal}Schema } from "../schemas/${entity_kebab}.schema"

export async function findAll() {
  return db.select().from(${entity_snake}).orderBy(desc(${entity_snake}.createdAt))
}

export async function findById(id: string) {
  const result = await db.select().from(${entity_snake}).where(eq(${entity_snake}.id, id))
  return result[0]
}

export async function findByName(name: string) {
  const result = await db.select().from(${entity_snake}).where(eq(${entity_snake}.name, name))
  return result[0]
}

export async function create(data: Create${entity_pascal}Schema) {
  const result = await db.insert(${entity_snake}).values(data).returning()
  return result[0]
}

export async function update(id: string, data: Update${entity_pascal}Schema) {
  const result = await db.update(${entity_snake}).set(data).where(eq(${entity_snake}.id, id)).returning()
  return result[0]
}

export async function remove(id: string) {
  await db.delete(${entity_snake}).where(eq(${entity_snake}.id, id))
}
EOF
}

generate_api_file() {
  local entity="$1"
  local entity_pascal
  local entity_camel
  local entity_kebab
  
  entity_pascal=$(to_pascal_case "$entity")
  entity_camel=$(to_camel_case "$entity")
  entity_kebab=$(to_kebab_case "$entity")
  
  cat <<EOF
import { apiFetch } from "@/lib/api"
import type { Create${entity_pascal}Schema, Update${entity_pascal}Schema } from "../schemas/${entity_kebab}.schema"

export type ${entity_pascal}Response = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export async function list${entity_pascal}s(): Promise<${entity_pascal}Response[]> {
  return apiFetch<${entity_pascal}Response[]>(\`/${entity_kebab}s\`, { method: "GET" })
}

export async function get${entity_pascal}(id: string): Promise<${entity_pascal}Response> {
  return apiFetch<${entity_pascal}Response>(\`/${entity_kebab}s/\${id}\`, { method: "GET" })
}

export async function create${entity_pascal}(data: Create${entity_pascal}Schema): Promise<${entity_pascal}Response> {
  return apiFetch<${entity_pascal}Response>(\`/${entity_kebab}s\`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function update${entity_pascal}(id: string, data: Update${entity_pascal}Schema): Promise<${entity_pascal}Response> {
  return apiFetch<${entity_pascal}Response>(\`/${entity_kebab}s/\${id}\`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function delete${entity_pascal}(id: string): Promise<void> {
  return apiFetch<void>(\`/${entity_kebab}s/\${id}\`, { method: "DELETE" })
}
EOF
}

scaffold_server() {
  local target="$1"
  local entity="$2"
  local transport="$3"
  local database="$4"
  
  local entity_kebab
  entity_kebab=$(to_kebab_case "$entity")
  
  local schema_exists
  schema_exists=$(validate_schema_exists "$target" "$entity")
  
  if [[ "$schema_exists" == "false" ]]; then
    echo "→ Schema not found, creating..."
    source "$SCRIPT_DIR/schema.sh"
    scaffold_schema "$target" "$entity" "$database"
  fi
  
  if [[ "$transport" == "trpc" ]]; then
    local server_dir="$target/src/features/$entity_kebab/server"
    mkdir -p "$server_dir"
    
    local router_file="$server_dir/${entity_kebab}.router.ts"
    local service_file="$server_dir/${entity_kebab}.service.ts"
    local repository_file="$server_dir/${entity_kebab}.repository.ts"
    
    generate_trpc_router "$entity" > "$router_file"
    echo "✓ Created: $router_file"
    
    generate_trpc_service "$entity" > "$service_file"
    echo "✓ Created: $service_file"
    
    if [[ "$database" == "prisma" ]]; then
      generate_prisma_repository "$entity" > "$repository_file"
    else
      generate_drizzle_repository "$entity" > "$repository_file"
    fi
    echo "✓ Created: $repository_file"
    
  elif [[ "$transport" == "api" ]]; then
    validate_api_client "$target" || true
    
    local server_dir="$target/src/features/$entity_kebab/server"
    mkdir -p "$server_dir"
    
    local api_file="$server_dir/${entity_kebab}.api.ts"
    generate_api_file "$entity" > "$api_file"
    echo "✓ Created: $api_file"
  fi
}
