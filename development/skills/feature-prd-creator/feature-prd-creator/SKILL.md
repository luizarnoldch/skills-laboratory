---
name: feature-prd-creator
description: >
  Generate focused PRDs from FEATURES.yml entries. Bridges the feature registry
  with implementation-ready spec documents per scope (backend, frontend, etc.).
  Triggers: "create PRD for feature", "generate backend PRD", "plan feature",
  "start feature spec", "write spec for", "break down feature into PRDs".
  Reads ./FEATURES.yml, detects project type (Go or Next.js), produces prd-<feature-id>-<scope>.md files, and auto-links them back to the registry.
license: MIT
compatibility: opencode
metadata:
  domain: project-management
  depends-on: feature-manager
---

# What I do

Read `./FEATURES.yml`, pick a feature, transition its status, generate one or
more scoped PRDs, save under `docs/prds/`, auto-link back to `FEATURES.yml`.

One feature → many PRDs (e.g. `backend`, `frontend`, `devops`).
Each PRD self-contained, ready for next pipeline stage.

---

## Trigger phrases

- "create PRD for feature"
- "generate backend PRD"
- "plan feature"
- "start feature spec"
- "write spec for"
- "break down feature into PRDs"

---

## Workflow

### 1. Check FEATURES.yml

Found → **FEATURES mode** (proceed to Step 2).

Missing → ask user:

> "No FEATURES.yml found. Continue as standalone PRD? (Y/N)"

- Y → skip to Step 4 (**standalone mode**)
- N → stop. Say: _"Run `feature-manager` first."_

---

### 2. Pick feature `[FEATURES mode only]`

**Option A** — Direct: user supplies `feature-id` (e.g. `F0001`).

**Option B** — Interactive: list features with status `backlog`, `planned`, or `done`.
Hide `in_progress` and `blocked` entirely.

```text
F0001  user-authentication    backlog
F0002  payment-gateway        planned
F0003  dark-mode              done   (linked: 1)
```

---

### 3. Status gate `[FEATURES mode only]`

| Current status | Action |
| -------------- | ------ |
| `backlog`      | Update → `planned`. Proceed. |
| `planned`      | Proceed (regenerate if asked). |
| `in_progress`  | **STOP.** Feature active — no new PRDs. |
| `done`         | Count linked PRDs. Any file missing → revert to `planned`, set `date_updated: null`. Proceed. All exist → **STOP.** |

---

### 4. Detect project type

Runs once per session. Drives step template selection.

| File found | Project type |
| ---------- | ------------ |
| `go.mod` | Go backend |
| `package.json` + `"next"` in deps | Next.js fullstack |
| Neither | Generic |

---

### 5. Resolve scope

Read `feature.contexts` from `FEATURES.yml` (or skip in standalone mode).

- **Contexts present** → multi-select which ones need PRDs.
  Example: `backend`, `frontend`, `devops`.
- **Contexts empty / standalone** → ask user: free-text scope.

---

### 6. Clarifying questions

Per chosen scope, ask 3–5 short questions. Format: numbered list, dot-notation sub-questions.

```text
1. Top-level question?
2. Top-level question?
   2.1. Sub-question?
   2.2. Sub-question?
3. Top-level question?
```

One atomic question per item. Adapt to user's prompt. Cover relevant areas:

- **Problem/Goal** — what problem does this solve?
- **Target User** — who uses this?
- **Core Functionality** — essential actions?
- **User Stories** — "As a [user], I want [action] so that [benefit]"?
- **Acceptance Criteria** — how to define success?
- **Scope/Boundaries** — what must this NOT do?
- **Data** — what info needs display or management?
- **Design/UI** — mockups or UI preferences?
- **Edge Cases** — errors or unusual situations?

---

### 7. Assemble PRD

Read `assets/prd-core-template.md`. Fill placeholders:

| Placeholder | Value |
| ----------- | ----- |
| `[id]` | `prd-<feature-id>-<scope>` (standalone: `prd-<scope>`) |
| `[name]` | `<feature-name>-<scope>` |
| `[feature_number]` | `<feature-id>` (standalone: omit) |
| `[scope]` | chosen scope |
| `[user_story]` | from clarifying answers |
| `[input_spec]` | from clarifying answers |
| `[output_spec]` | from clarifying answers |
| `[pseudocode]` | include only if algorithmic logic confirmed; else delete section |
| `[technical_notes]` | libs, constraints, key code portions |
| `[steps_content]` | embed from step template (see below); omit entire section if no code changes |

**Pick step template:** scope + project type → `references/template-index.md` → embed matching file from `assets/steps/`.

Leave comment after steps heading:

```markdown
<!-- Steps assembled from template: <template-name> -->
```

PRD sections (as defined in `assets/prd-core-template.md`):

1. **User Story**
2. **Input Specification**
3. **Output Specification**
4. **Pseudocode** _(omit if no algorithmic logic)_
5. **Technical Notes**
6. **Steps to Complete** _(omit if no code changes)_

---

### 8. Save PRD

- FEATURES mode: `docs/prds/prd-<feature-id>-<scope>.md`
- Standalone mode: `docs/prds/prd-<scope>.md`

Create `docs/prds/` if missing. Write file.

---

### 9. Link back `[FEATURES mode only]`

Append PRD entry (`name`, `status: planned`, `link`) to `feature.prds` in `FEATURES.yml`.
Validate file exists at `link` path before writing.
Write updated `FEATURES.yml`.

---

## Output files

| File | Description |
| ---- | ----------- |
| `docs/prds/prd-<feature-id>-<scope>.md` | Scoped PRD document |
| `./FEATURES.yml` | Updated status + `prds` list (FEATURES mode only) |

---

## Available assets

- **`assets/prd-core-template.md`** — scope-agnostic PRD base (all except Steps).
- **`assets/prd-template.md`** — assembly guide: how to compose core template + step templates.
- **`assets/steps/backend-go-steps.md`** — 6 parent tasks for Go backend.
- **`assets/steps/frontend-nextjs-steps.md`** — 8 parent tasks for Next.js fullstack.
- **`assets/steps/devops-steps.md`** — 5 parent tasks for DevOps / infrastructure.
- **`assets/steps/generic-steps.md`** — plain markdown checklist for any scope.

## Available references

- **`references/mapping-guide.md`** — field mapping, context examples,
  project-type detection rules, code-change detection heuristics.
- **`references/template-index.md`** — step template per scope + project type.

---

## Rules

1. **Read first** — parse `./FEATURES.yml` before any action (if exists).
2. **No direct implementations** — skill produces PRDs only; never write code.
3. **Status guard** — `in_progress` features immutable for PRD additions.
4. **Auto-detect project type** — do not ask user for Go vs Next.js if files reveal it.
5. **Omit Steps section** — when no code changes required (config, docs, process).
6. **Validate paths** — confirm `docs/prds/<name>.md` exists before adding to `feature.prds`.
7. **Update `date_updated` only on reverts** — `done` → `planned`: set `date_updated: null`. Else leave to `feature-manager`.
8. **Ask clarifying questions** — always before generating PRD; use answers to refine output.
