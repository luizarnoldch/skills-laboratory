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

Each parent task breaks into sub-tasks with **Context**, **Files Related**, and **Skills Related**.

If a step is not needed → mark done, write "not required".
