# PRD Template Assembly Guide

This skill now builds PRDs from modular parts instead of a single monolithic template.

## Assembly Order

1. Read `prd-core-template.md` for scope-agnostic sections (User Story, Input / Output Spec, Pseudocode, Technical Notes).
2. Pick a step template from `steps/` based on scope + detected project type.
3. Embed the step template content into the `[steps_content]` placeholder.

## Available Step Templates

| Scope + Project Type      | Step Template File                | Description                                          |
| ------------------------- | --------------------------------- | ---------------------------------------------------- |
| `backend` (Go)            | `steps/backend-go-steps.md`       | SQL → sqlc → Domain → Service → HTTP → E2E           |
| `frontend` (Next.js)      | `steps/frontend-nextjs-steps.md`  | Prisma → Zod → tRPC → Hooks → Pages → Views → Server → Islands |
| `devops`                  | `steps/devops-steps.md`           | Container → Compose → CI/CD → Infra → Monitoring     |
| Generic / other           | `steps/generic-steps.md`          | Plain markdown checklist                             |

## Full Routing Matrix

See `references/template-index.md` for the full scope-to-template mapping, including fallback rules when the project type is unknown.

## When to Omit Steps

If the feature is config-only, docs-only, or process-only, delete the entire **Steps to Complete** section from the assembled PRD (replace `[steps_content]` with nothing).
