# Go Backend — Steps to Complete

Use 6 parent tasks in this exact order:

- [ ] **1.0 SQL & Migrations**
  Define or alter database schema first. Write migration files under `sql/migrations/`.

- [ ] **2.0 Query Layer (sqlc)**
  Write `.sql` query files. Run `sqlc generate` to produce domain models and repository code.

- [ ] **3.0 Domain Scaffolding (pkg/)**
  Create domain types, interfaces, and repository stubs under `pkg/<feature>/`.

- [ ] **4.0 Business Logic (service)**
  Implement core use-cases orchestrating repositories, external APIs, and validation.

- [ ] **5.0 HTTP Layer (handlers + routes)**
  Wire HTTP handlers, request/response DTOs, route registration, and middleware.

- [ ] **6.0 E2E Tests (Bruno)**
  Create Bruno collections verifying the full request/response lifecycle.

Each parent task breaks into sub-tasks with **Context**, **Files**, and **Skills**.

If a step is not needed → mark done, write "not required".

---

## Sub-task Format

```
- [ ] 1.0 Parent Task Title
  **Context:** Why this exists.

  - [ ] 1.1 Sub-task description
    **Context:** Specific thing to implement.
    **Files:** `path/to/files/`.
    **Skills:** `skill-name`.
```

---

### Relevant Files

**Migrations:**
- `sql/migrations/YYYYMMDDHHMMSS_add_{feature}.up.sql`
- `sql/migrations/YYYYMMDDHHMMSS_add_{feature}.down.sql`

**Queries:**
- `sql/queries/{feature}.sql`

**Domain (pkg/):**
- `pkg/{feature}/domain.go`
- `pkg/{feature}/dto.go`
- `pkg/{feature}/interface.go`
- `pkg/{feature}/repository.go`
- `pkg/{feature}/mapper.go`
- `pkg/{feature}/service.go`
- `pkg/{feature}/handler.go`

**Routes:**
- `internal/app/routes.go` (modified — wire new handler)

**E2E Tests:**
- `bruno/{service}/{feature}/bruno.json`
- `bruno/{service}/{feature}/environments/dev.bru`
- `bruno/{service}/{feature}/create_{entity}.yml`
- `bruno/{service}/{feature}/list_{entity}s.yml`
- `bruno/{service}/{feature}/get_{entity}.yml`
- `bruno/{service}/{feature}/update_{entity}.yml`
- `bruno/{service}/{feature}/delete_{entity}.yml`

Omit files not required by the feature. Add extra files if the feature demands them.

---

## Go Backend Layer Order

```
pkg/{feature}/
├── domain.go      ← 1. Pure structs. No logic. No imports.
├── dto.go         ← 2. HTTP request/response structs.
├── interface.go   ← 3. Repository + Service interfaces.
├── repository.go  ← 4. DB calls. Wraps sqlc.
├── mapper.go      ← 5. Convert between domain and dto.
├── service.go     ← 6. Business rules.
└── handler.go     ← 7. HTTP handlers.
```

Wire the new routes in `internal/app/routes.go` (modified).

---

## Dependency Injection & Wiring

Always explicit wiring — never `init()` or globals.

```go
repo  := {feature}.New{Feature}Repository(db)
svc   := {feature}.New{Feature}Service(repo)
hdlr  := {feature}.New{Feature}Handler(svc)

mux.HandleFunc("GET /{features}",        hdlr.HandleList{Feature}s)
mux.HandleFunc("GET /{features}/{id}",  hdlr.HandleGet{Feature})
mux.HandleFunc("POST /{features}",      hdlr.HandleCreate{Feature})
mux.HandleFunc("PUT /{features}/{id}", hdlr.HandleUpdate{Feature})
mux.HandleFunc("DELETE /{features}/{id}", hdlr.HandleDelete{Feature})
```

