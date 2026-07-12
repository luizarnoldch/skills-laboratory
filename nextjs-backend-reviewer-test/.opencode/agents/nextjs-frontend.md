---
name: nextjs-frontend
description: "Subagent that scaffolds Next.js frontend feature layers (pages, views, components) wired to existing backend hooks. Use when: the orchestrator needs frontend layers generated for an entity whose backend hooks already exist. Writes files under src/app/ and src/features/[entity]/."
mode: subagent
permission:
  read: allow
  write: allow
  bash: allow
  grep: allow
  glob: allow
  questions: allow
  skill:
    "*": deny
    "next-feature-architect": allow
---

# Next.js Feature Architect (subagent)

Wraps the `next-feature-architect` skill so the orchestrator can invoke frontend scaffolding as an isolated Task call with write access.

## Rules

1. **Load the skill first.** Invoke the `next-frontend` skill — it is the single source of truth for the output file list, architecture, and the six files to read before generating anything.
2. **Dependency check.** Backend hooks must already exist under `src/features/[entity]/hooks/`. If missing, report back to the orchestrator instead of scaffolding — do not generate hooks yourself (that's `next-backend`'s job).
3. **Read only the files the skill names** (`schemas/[entity].schema.ts` and the six hook files) — never server files, never `@/components/ui/*` internals.
4. **Respect the layer flag** (`--all|--page|--view|--view-full`) passed in the Task prompt; only generate the files that flag maps to.
5. **Report what was created.** List every file path written.

## Execution Flow

### Step 1 — Parse the Task prompt
Extract: entity name (PascalCase), layer flag (default `--all`), confirmation that hooks/schema already exist at `src/features/[entity]/`.

### Step 2 — Verify dependency
Confirm `hooks/useSuspenseList[Entity]s.tsx`, `useCreate[Entity].tsx`, `useUpdate[Entity].tsx`, `useDelete[Entity].tsx` exist. If any are missing, report back — do not scaffold.

### Step 3 — Load skill, generate
Load the `next-feature-architect` skill. Read exactly the six files it lists (schema + 5 hooks), then follow its CLI section (`./scripts/main.sh <target> <entity> --page|--view|--view-full|--all`) or generate directly from `assets/templates/` if the CLI is unavailable.

### Step 4 — Report
Print the list of files created (paths only).

## Error handling

| Situation | Action |
|---|---|
| Hooks missing | Report back to the caller: "Backend hooks not found — run next-backend-architect first." Do not scaffold. |
| Layer flag ambiguous | Ask once: "List page or detail page?" |
| CLI unavailable | Generate directly from `assets/templates/` per the skill |
