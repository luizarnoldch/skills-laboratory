---
name: feature-manager
description: >
  Manage project features in single FEATURES.yml file at project root.
  Triggers: "add feature", "update feature", "mark feature done",
  "link PRD to feature", "init FEATURES.yml", "manage features".
  Handles YAML feature registry with project metadata, rules, contexts,
  dependencies, PRD links, status tracking.
license: MIT
compatibility: opencode
metadata:
  domain: project-management
---

# What I do

Read, write, validate `./FEATURES.yml` at workspace root.
YAML file, no Markdown wrappers.

## Trigger

Phrases:

- "add feature"
- "update feature"
- "mark feature done"
- "link PRD to feature"
- "init FEATURES.yml"
- "manage features"

## Output

`./FEATURES.yml` — see `assets/feature-template.yaml`.

## Workflow

1. Missing file + add/update request → ask init first.
2. Read `./FEATURES.yml`.
3. Apply change.
4. Validate.
5. Write back.

## Validation

- `id`: `F` + digits, unique.
- `status`: in `rules.possible_status`.
- `version`: `vX.Y.Z`. See `references/REFERENCE.md`.
- `depends_on`: IDs must exist.
- `contexts`: subset of `project.contexts`.
- `prds[].link`: file must exist at `docs/prds/<name>.md`.
- `date_updated`: set on status → `done`. Null otherwise.

## Commands

- `init` — use template `assets/feature-template.yaml` to create `./FEATURES.yml`.
- `add-feature <name>` — append feature, auto-id based on existing IDs.
- `update-feature <id> <field> <value>` — modify field.
- `link-prd <feature-id> <prd-name>` — link PRD, validate existence.
- `renumber-ids` — run `scripts/renumber-ids.py` when approaching digit limit.

## Scripts

- **`scripts/renumber-ids.py`** — Trigger: user asks "renumber IDs" or `F9999` approached.

## References

- `references/REFERENCE.md` — if user asks for field meanings, status values,
  version format.
- `references/schema.md` — if user asks for structure, required vs optional fields.
- `assets/feature-template.yaml` — if user asks for a new FEATURE file.
