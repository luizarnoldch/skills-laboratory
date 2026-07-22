# Mapping Guide — feature-prd-creator

## Field Mapping (FEATURES.yml → Spec folder)

| FEATURES.yml field | Used in | Notes |
| ------------------ | ------- | ----- |
| `feature.id`       | folder name, file frontmatter | `prd-<feature-id>/`, e.g. `prd-F0001/` |
| `feature.name`     | file headings | Used as `<feature-name>` in `# Requirements — <feature-name>` |
| `feature.contexts` | `tasks.md` section headings | Each context becomes a `## <Scope>` heading |
| `feature.status`   | Step 3 gate | Must be `backlog` or `planned` to proceed |

---

## Context Examples

| Context    | Typical focus in `tasks.md`                    |
| ---------- | ---------------------------------------------- |
| `backend`  | API, business logic, database                  |
| `frontend` | UI components, views, state management         |
| `database` | Schema, migrations, seed data                  |
| `devops`   | CI/CD, infrastructure, containers              |
| `api`      | Public API contract, versioning, docs          |
| `mobile`   | Mobile-specific views, native modules          |
| `docs`     | User documentation, API reference              |
| `security` | Auth, permissions, audit                       |

If `feature.contexts` is empty, ask the user for free-text scope(s).

---

## Project Type Detection

| Detection rule | Result |
| -------------- | ------ |
| `go.mod` exists in project root | Go backend |
| `package.json` exists AND `"next"` in `dependencies` or `devDependencies` | Next.js fullstack |
| Neither found | Generic |

Detection runs once per generation pass, not per scope.

---

## Spec Folder Naming Convention

```
docs/prds/prd-<feature-id>/
├── requirements.md
├── tech-notes.md
└── tasks.md
```

Examples:

```
docs/prds/prd-F0001/
docs/prds/prd-F0002/
```

Standalone mode (no FEATURES.yml): use scope as folder name.

```
docs/prds/prd-<scope>/
├── requirements.md
├── tech-notes.md
└── tasks.md
```

---

## EARS Patterns Quick Reference

| Pattern | Template |
| ------- | -------- |
| **Ubiquitous** | `The system MUST <action>.` |
| **Event-driven** | `WHEN <trigger>, the system MUST <action>.` |
| **State-driven** | `WHILE <state>, the system MUST <action>.` |
| **Optional** | `WHERE <optional feature>, the system MUST <action>.` |
| **Unwanted behaviour** | `IF <unwanted event> THEN the system MUST <action>.` |

### Traceability rule (hard)

Every `R<n>` in `requirements.md` MUST appear in at least one task in
`tasks.md`. Every task in `tasks.md` MUST reference at least one `R<n>`.
The `tasks.md` traceability table makes this mapping explicit.

---

## tasks.md Format Reference

Each scope gets one `## <Scope>` heading. Tasks are numbered sequentially
across all sections: `T1`, `T2`, `T3`, ...

### Go backend — expected task areas (in order)

1. SQL migrations
2. sqlc query layer
3. Domain scaffolding (`pkg/`)
4. Business logic (service)
5. HTTP layer (handlers + routes)
6. E2E tests

### Next.js tRPC backend — expected task areas (in order)

1. Prisma schema and migration
2. Zod schema
3. tRPC router (or external API transport)
4. TanStack Query and Form hooks

Relevant files:
- `src/features/{feature}/schemas/{feature}.schema.ts`
- `src/features/{feature}/server/{feature}.router.ts` (tRPC) or `.api.ts`
- `src/features/{feature}/server/{feature}.service.ts`
- `src/features/{feature}/server/{feature}.repository.ts`
- `src/features/{feature}/hooks/use*.ts`

### Next.js fullstack — expected task areas (in order)

1. Prisma schema and migration
2. Zod schema
3. tRPC router
4. TanStack Query and Form hooks
5. App Router pages
6. Views, layouts, loading states
7. Server components
8. Client island components

### Generic

Plain checklist with no enforced order. Use `- [ ] T<n> — <description>. Covers: R<n>.`

---

## Status Transition Rules

| Current       | Condition                                | New status               |
| ------------- | ---------------------------------------- | ------------------------ |
| `backlog`     | Always                                   | `planned` (after save)   |
| `planned`     | User explicitly requests regeneration    | stay `planned`           |
| `in_progress` | Any                                      | **STOP** — active        |
| `blocked`     | Any                                      | **STOP** — blocked       |
| `done`        | Any                                      | **STOP** — complete      |

After setting status to `planned`, the skill always stops and waits for human
approval before any implementer proceeds.
