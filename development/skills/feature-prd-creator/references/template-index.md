# PRD Template Index

Maps each scope + detected project type to the expected tasks for `tasks.md` sections.

| Scope (context) | Detected project type    | Tasks focus                                                |
| --------------- | ------------------------ | ---------------------------------------------------------- |
| `backend`       | Go (`go.mod`)            | SQL migrations, sqlc, domain pkg, service, HTTP, E2E tests |
| `backend`       | Next.js (`package.json`) | Prisma schema, Zod schema, tRPC router, TanStack hooks     |
| `frontend`      | Next.js (`package.json`) | App Router pages, views, server components, client islands |
| `devops`        | Any                      | CI/CD pipeline, Dockerfile, env config, infra              |
| `api`           | Any                      | API contract, versioning, endpoint docs                    |
| `docs`          | Any                      | User documentation, API reference, changelogs              |
| `security`      | Any                      | Auth flows, permission checks, audit logging               |
| `mobile`        | Any (native)             | Native screens, platform-specific modules                  |
| Unknown         | Any                      | Generic checklist — no enforced task order                 |

---

## tasks.md Assembly Rules

1. One `## <Scope>` heading per context from `feature.contexts`.
2. Use the **Tasks focus** column above to determine which task areas to include
   in each section. Do not invent task areas outside this index.
3. Task ids are sequential across all sections: `T1`, `T2`, `T3`, ...
4. Every task MUST reference at least one `R<n>` from `requirements.md`:
   `- [ ] T<n> — <description>. Covers: R<n>.`
5. The traceability table at the top of `tasks.md` maps every `R<n>` to the
   `T<n>` tasks that cover it. This table is generated last, after all tasks
   are written.
6. If project type is Generic or the scope is not in this index, use a plain
   checklist with no enforced order.

---

## Example `tasks.md` Section (Next.js backend)

```markdown
## Backend

- [ ] T1 — Add `users` table to Prisma schema. Covers: R1.
- [ ] T2 — Run migration `add_users_table`. Covers: R1.
- [ ] T3 — Create Zod schema `createUserSchema` in `schemas/user.schema.ts`. Covers: R2, R3.
- [ ] T4 — Add `user.create` procedure to `server/user.router.ts`. Covers: R2.
- [ ] T5 — Add `useCreateUser` hook in `hooks/useCreateUser.ts`. Covers: R2.
```
