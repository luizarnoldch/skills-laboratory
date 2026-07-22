# PRD Template Index

Maps each scope + detected project type to the correct step assembly.

| Scope (context) | Detected project type    | Asset to embed                          | Fallback if unknown type |
| --------------- | ------------------------ | --------------------------------------- | ------------------------ |
| `backend`       | Go (`go.mod`)            | `assets/steps/backend-go-steps.md`      | `generic-steps.md`       |
| `backend`       | Next.js (`package.json`) | `assets/steps/frontend-nextjs-steps.md` | N/A                      |
| `frontend`      | Next.js (`package.json`) | `assets/steps/frontend-nextjs-steps.md` | `generic-steps.md`       |
| `devops`        | Any                      | `assets/steps/devops-steps.md`          | `generic-steps.md`       |
| `api`           | Any                      | `assets/steps/generic-steps.md`         | —                        |
| `docs`          | Any                      | `assets/steps/generic-steps.md`         | —                        |
| `security`      | Any                      | `assets/steps/generic-steps.md`         | —                        |
| `mobile`        | Any (native)             | `assets/steps/generic-steps.md`         | —                        |

## Assembly Rules

1. Read `assets/prd-core-template.md` (scope-agnostic base).
2. Resolve scope from `feature.contexts`.
3. Resolve project type from root files (`go.mod`, `package.json`).
4. Pick step template from this index.
5. Replace `[steps_content]` placeholder with step template content.
6. Leave comment block telling user which template was embedded:
   ```markdown
   <!-- Steps assembled from template: devops-steps.md -->
   ```
