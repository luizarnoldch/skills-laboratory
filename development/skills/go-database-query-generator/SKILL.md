---

name: go-database-query-generator

description: Use this skill when you need to generate a database query.

---
# Database Query Generator

Expert in generating SQL queries for PostgreSQL databases. This skill ensures that all database queries are type-safe, efficient, and compatible with the existing schema.

## Activation Criteria

- When the user asks to 'create a query', 'update a search', or 'fetch specific data'.
- When a new feature requires new data access patterns in Go.
- Refactor existing sqlc queries or files, adding or removing files and queries.
- When you need to update existing `sqlc` queries or fix database-related Go code generation.

## Execution Workflow

Follow these steps strictly:

### 1. Service Context Detection

- Identify the target service (e.g., 'services/communication') from the user request or current active files.
- Locate the 'sql/queries/' directory within the service root to confirm where SQL queries are stored.
- Locate 'sqlc.yaml' in the service root to ensure the service is configured for `sqlc`.

### 2. Query Design & Implementation

- **Analyze Requirements**: Determine the SQL logic needed (SELECT, INSERT, UPDATE, DELETE).
- **File Management**:
    - If adding a new domain/feature, create a new `.sql` file in `sql/queries/` (e.g., `sql/queries/messages.sql`).
    - If updating existing logic, locate the relevant file in `sql/queries/`.
- **SQL Implementation**:
    - Write the SQL query with a proper `sqlc` annotation (e.g., `-- name: CreateMessage :one`).
    - Ensure type-safety by using appropriate PostgreSQL types.

### 3. Compilation (Scripted)

- Use the provided helper script to compile the SQL queries into Go code:

```sh
make generate

// or
sqlc generate
```

- **Manual Fallback**: If the script fails, try running `make generate` or `sqlc generate` directly in the service root.

### 4. Verification

- **Validate Generated Code**: Check the `sql/sqlc/` directory for the newly generated `.go` files.
- **Review Go Signatures**: Ensure the generated Go functions match the expected parameters and return types.
- **Error Handling**: Verify that if the SQL was invalid, the compilation error is addressed.

## Best Practices

- Use descriptive query names (e.g., `GetActiveUsers` instead of `GetUsers`).
- Keep query files organized by feature or entity.
- Always run the compilation script after *any* change to `.sql` files in the queries directory.
- **Post-Implementation**: If the query introduces new return types, update the business logic in the `pkg/` directory to utilize them.