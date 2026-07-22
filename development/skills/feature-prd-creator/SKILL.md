---
name: feature-prd-creator
description: >
  Generate SDD-compliant specs from FEATURES.yml entries using EARS notation.
  Produces docs/prds/prd-<feature-id>/{requirements.md, tech-notes.md, tasks.md}.
  Triggers: "create PRD for feature", "generate spec", "plan feature",
  "start feature spec", "write spec for", "break down feature into tasks".
  Reads ./FEATURES.yml, detects project type (Go or Next.js), generates three
  spec files, sets status to planned, and stops for human approval.
license: MIT
metadata:
  domain: project-management
  depends-on: feature-manager
---

# What I do

Read `./FEATURES.yml`, pick a feature, generate a spec folder at
`docs/prds/prd-<feature-id>/` with three files:

| File              | Content                                                                    |
| ----------------- | -------------------------------------------------------------------------- |
| `requirements.md` | EARS-formatted requirements, each with a stable `R<n>` id                  |
| `tech-notes.md`   | Technical decisions: files touched, new signatures, discarded alternatives |
| `tasks.md`        | Executable checklist organized by scope, each task referencing `R<n>`      |

After saving, set feature status to `planned` and **stop**. Human approval is
required before any implementer proceeds.

---

## Trigger phrases

- "create PRD for feature"
- "generate spec"
- "plan feature"
- "start feature spec"
- "write spec for"
- "break down feature into tasks"

---

## Workflow

### 1. Check FEATURES.yml

Found → **FEATURES mode** (proceed to Step 2).

Missing → ask user:

> "No FEATURES.yml found. Continue as standalone spec? (Y/N)"

- Y → skip to Step 4 (**standalone mode**)
- N → stop. Say: _"Run `feature-manager` first."_

---

### 2. Pick feature `[FEATURES mode only]`

**Option A** — Direct: user supplies `feature-id` (e.g. `F0001`).

**Option B** — Interactive: list features with status `backlog` or `planned`.
Hide `in_progress`, `blocked`, and `done` entirely.

```text
F0001  user-authentication    backlog
F0002  payment-gateway        planned
```

---

### 3. Status gate `[FEATURES mode only]`

| Current status | Action |
| -------------- | ------ |
| `backlog`      | Proceed. Status will be set to `planned` after save. |
| `planned`      | Proceed only if user explicitly asks to regenerate. |
| `in_progress`  | **STOP.** Feature is active — spec is locked. |
| `done`         | **STOP.** Feature is complete. |
| `blocked`      | **STOP.** Resolve the block first. |

---

### 4. Detect project type

Runs once per session. Drives scope-to-tasks mapping in Step 9.

| File found | Project type |
| ---------- | ------------ |
| `go.mod` | Go backend |
| `package.json` + `"next"` in deps | Next.js fullstack |
| Neither | Generic |

---

### 5. Resolve scopes

Read `feature.contexts` from `FEATURES.yml` (or skip in standalone mode).

- **Contexts present** → confirm with user which ones to include.
  Example: `backend`, `frontend`, `devops`.
- **Contexts empty / standalone** → ask user: free-text scope(s).

Scopes become `## <Scope>` section headings inside `tasks.md`. They do **not**
produce separate files.

---

### 6. Clarifying questions

Ask 3–5 short questions before generating any file. Format: numbered list,
dot-notation sub-questions.

```text
1. Top-level question?
2. Top-level question?
   2.1. Sub-question?
   2.2. Sub-question?
3. Top-level question?
```

One atomic question per item. Cover:

- **Goal** — what problem does this feature solve?
- **Actor** — who triggers this? (user role, system, scheduler?)
- **Core actions** — what must the system do?
- **Boundaries** — what must this NOT do?
- **Error / edge cases** — what can go wrong? What are the limits?
- **Acceptance** — how do we know it works?

Use the answers to shape `R<n>` statements in Step 7.

---

### 7. Generate `requirements.md`

Write requirements using **EARS notation** (see EARS Notation section below).

Rules:
- Assign a stable id `R1`, `R2`, ... in order.
- One `MUST` per requirement — split if more than one.
- Every requirement must be verifiable by at least one task in `tasks.md`.
- No soft verbs (`could`, `may`, `should`, `supports`). Only `MUST` / `MUST NOT`.

Use `assets/requirements-template.md` as the output structure.

---

### 8. Generate `tech-notes.md`

Capture technical decisions **before** any code is written.

Required sections:

1. **Files** — list every file to create or modify.
2. **Signatures** — new functions, classes, tRPC procedures, CLI commands, or
   API endpoints introduced.
3. **Exceptions / Errors** — new error types or reused ones.
4. **Discarded alternatives** — at least one alternative considered and the
   reason it was rejected.

Do NOT do first-principles engineering here. Rely on existing architecture and
conventions visible in the project. Document only the points where this feature
touches or extends those conventions.

Use `assets/tech-notes-template.md` as the output structure.

---

### 9. Generate `tasks.md`

Write an executable checklist organized by scope.

Rules:
- One `## <Scope>` heading per scope (e.g., `## Backend`, `## Frontend`).
- Task ids are sequential across all sections: `T1`, `T2`, `T3`, ...
- Each task references at least one requirement: `Covers: R<n>`.
- Every `R<n>` from `requirements.md` must appear in at least one task.
- Implementer checks `[x]` on each task when done.

Use `assets/tasks-template.md` as the output structure.

Use `references/template-index.md` to determine which tasks are expected per
scope + project type.

---

### 10. Save files

Create `docs/prds/prd-<feature-id>/` if missing. Write all three files.

- FEATURES mode: `docs/prds/prd-<feature-id>/requirements.md`
- FEATURES mode: `docs/prds/prd-<feature-id>/tech-notes.md`
- FEATURES mode: `docs/prds/prd-<feature-id>/tasks.md`
- Standalone mode: `docs/prds/prd-<scope>/` (use scope as folder name)

---

### 11. Link back `[FEATURES mode only]`

1. Verify all three files exist on disk.
2. Set `feature.status = planned` in `FEATURES.yml`.
3. Append spec folder path to `feature.prds` in `FEATURES.yml`.
4. Write updated `FEATURES.yml`.
5. **Stop.** Print:

> Spec ready at `docs/prds/prd-<feature-id>/`. Review and say **'go'** to
> implement or request changes.

---

## EARS Notation

EARS = Easy Approach to Requirements Syntax. Five patterns:

| Pattern | Template |
| ------- | -------- |
| **Ubiquitous** | `The system MUST <action>.` |
| **Event-driven** | `WHEN <trigger>, the system MUST <action>.` |
| **State-driven** | `WHILE <state>, the system MUST <action>.` |
| **Optional** | `WHERE <optional feature>, the system MUST <action>.` |
| **Unwanted behaviour** | `IF <unwanted event> THEN the system MUST <action>.` |

### Hard rules

- Each requirement has one stable id: `R1`, `R2`, ...
- Each requirement MUST be verifiable by at least one concrete task or test.
- Do not combine multiple `MUST` in one requirement — split them.
- Do not use soft verbs (`could`, `may`, `should`, `supports`). Only `MUST` / `MUST NOT`.

### Examples

```markdown
## R1
WHEN the user submits the login form with valid credentials,
the system MUST return a session token within 500 ms.

## R2
IF the password field contains fewer than 8 characters
THEN the system MUST display an inline validation error
and MUST NOT submit the form.

## R3
The system MUST hash passwords using bcrypt with a cost factor >= 12.
```

---

## Output files

| Path | Description |
| ---- | ----------- |
| `docs/prds/prd-<feature-id>/requirements.md` | EARS requirements |
| `docs/prds/prd-<feature-id>/tech-notes.md` | Technical decisions |
| `docs/prds/prd-<feature-id>/tasks.md` | Executable checklist with R<n> traceability |
| `./FEATURES.yml` | Updated status (`planned`) + spec folder link (FEATURES mode only) |

---

## Available references

- Read `references/mapping-guide.md` when you need context examples,
  project-type detection rules, status transition table, or the EARS
  quick reference (Steps 3–7).
- Read `references/template-index.md` in Step 9 when generating `tasks.md`
  to determine which task areas to include for each scope + project type.

---

## Rules

1. **Read first** — parse `./FEATURES.yml` before any action (if it exists).
2. **EARS only** — every requirement in `requirements.md` MUST follow one of the five EARS patterns.
3. **Traceability** — every `R<n>` must appear in at least one task in `tasks.md`. Reject generation if any R<n> is uncovered.
4. **No direct implementations** — this skill produces spec files only; never write source code.
5. **Status guard** — `in_progress`, `done`, and `blocked` features are immutable.
6. **Auto-detect project type** — do not ask user for Go vs Next.js if files reveal it.
7. **Validate paths** — confirm all three files exist on disk before updating `FEATURES.yml`.
8. **Stop after planned** — after setting status to `planned`, always stop and prompt for human approval.
9. **Ask clarifying questions** — always before generating files; use answers to shape EARS requirements.
10. **One MUST per requirement** — split compound requirements before writing.
