# Mapping Guide for feature-prd-creator

## Field Mapping (FEATURES.yml → PRD)

| FEATURES.yml field | PRD frontmatter field | Notes                      |
| ------------------ | --------------------- | -------------------------- |
| `feature.id`       | `feature_number`      | Exact copy, e.g. `F0001`   |
| `feature.name`     | `name`                | `<feature-name>-<scope>`   |
| auto-generated     | `id`                  | `prd-<feature-id>-<scope>` |
| `feature.contexts` | `scope`               | One of the chosen contexts |

---

## Context Examples

| Context    | Typical PRD focus                      |
| ---------- | -------------------------------------- |
| `backend`  | API, business logic, database          |
| `frontend` | UI components, views, state management |
| `database` | Schema, migrations, seed data          |
| `devops`   | CI/CD, infrastructure, containers      |
| `api`      | Public API contract, versioning, docs  |
| `mobile`   | Mobile-specific views, native modules  |
| `docs`     | User documentation, API reference      |
| `security` | Auth, permissions, audit               |

If `feature.contexts` is empty, ask user for a free-text scope.

---

## Project Type Detection

| Detection rule                                                                         | Result                                 |
| -------------------------------------------------------------------------------------- | -------------------------------------- |
| File `go.mod` exists in project root                                                   | Go backend                             |
| File `package.json` exists AND `"next"` appears in `dependencies` or `devDependencies` | Next.js fullstack                      |
| Neither found                                                                          | Generic — use plain markdown checklist |

Detection runs once per PRD generation pass, not per scope.

---

## Code-Change Detection Heuristics

Determine whether to include the **Steps to Complete** section:

| Scenario                                             | Include Steps? | Reason                |
| ---------------------------------------------------- | -------------- | --------------------- |
| Feature adds new endpoints, routes, screens          | Yes            | Code changes required |
| Feature modifies existing business logic             | Yes            | Code changes required |
| Feature is config-only (feature flags, env vars)     | No             | No code change        |
| Feature is documentation-only                        | No             | No code change        |
| Feature is process-only (workflow, policy)           | No             | No code change        |
| Feature is pure data migration with no schema change | Ask user       | Ambiguous             |

When in doubt, ask user: _"Does this scope require code changes?"_

---

## Status Transition Rules

| Current       | Condition                            | New status               |
| ------------- | ------------------------------------ | ------------------------ |
| `backlog`     | Always                               | `planned`                |
| `planned`     | PRDs incomplete or user confirmed    | stay `planned`           |
| `planned`     | All linked PRDs exist and complete   | **STOP** — nothing to do |
| `in_progress` | Any                                  | **STOP** — active        |
| `blocked`     | Any                                  | **STOP** — blocked       |
| `done`        | At least one linked PRD file missing | `planned`                |
| `done`        | All linked PRDs exist and complete   | **STOP** — nothing to do |

_When reverting done → planned, set date_updated to null._

---

## PRD File Naming Convention

```
docs/prds/prd-<feature-id>-<scope>.md
```

Examples:

- `docs/prds/prd-F0001-backend.md`
- `docs/prds/prd-F0001-frontend.md`
- `docs/prds/prd-F0002-database.md`

---

## Steps Format References

### Go backend — go-task-planner

Use 6 parent tasks in this order:

1. SQL & Migrations
2. Query Layer (sqlc)
3. Domain Scaffolding (pkg/)
4. Business Logic (service)
5. HTTP Layer (handlers + routes)
6. E2E Tests (Bruno)

Each parent breaks into sub-tasks with **Context**, **Files Related**, **Skills Related**.

### Next.js fullstack — next-task-planner

Use 8 parent tasks in this order:

1. Prisma Schema & Migration
2. Zod Schema
3. tRPC Router
4. TanStack Query & Form Hooks
5. App Router Pages
6. Views, Layouts & Loading
7. Component UI — Pure Server
8. Component Client Islands

Each parent breaks into sub-tasks with **Context**, **Files**, **Skills**.

### Generic / No code changes

Use a plain markdown checklist:

```markdown
- [ ] Step 1 description
- [ ] Step 2 description
```

Omit section entirely if no code changes.
