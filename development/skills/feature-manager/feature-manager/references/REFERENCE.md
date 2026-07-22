# Feature Manager Reference

## Project Fields

| Field       | Type   | Required | Description                  |
| ----------- | ------ | -------- | ---------------------------- |
| name        | string | yes      | Project name                 |
| description | string | yes      | Project description          |
| version     | string | yes      | Version, `vX.Y.Z`            |
| status      | string | yes      | From `rules.possible_status` |
| contexts    | list   | yes      | Valid context tags           |

## Rules Fields

| Field                         | Type | Description           |
| ----------------------------- | ---- | --------------------- |
| develop_one_feature_at_a_time | bool | One `in_progress` max |
| possible_status               | list | Valid statuses        |

## Feature Fields

| Field        | Type   | Required | Description                             |
| ------------ | ------ | -------- | --------------------------------------- |
| id           | string | yes      | `F` + digits, unique                    |
| name         | string | yes      | Feature name                            |
| description  | string | yes      | What it does                            |
| status       | string | yes      | From `rules.possible_status`            |
| version      | string | no       | Implemented version, `vX.Y.Z`           |
| depends_on   | list   | no       | Required feature IDs                    |
| contexts     | list   | no       | Subset of `project.contexts`            |
| date_updated | string | no       | Set on `status` → `done`. Null default. |
| prds         | list   | no       | Linked PRDs. Empty `[]` if none.        |

## PRD Fields

| Field        | Type   | Required | Description                             |
| ------------ | ------ | -------- | --------------------------------------- |
| name         | string | yes      | PRD filename, no extension              |
| status       | string | yes      | PRD status                              |
| version      | string | no       | Implemented version, `vX.Y.Z`           |
| link         | string | yes      | Path `docs/prds/<name>.md`              |
| date_updated | string | no       | Set on `status` → `done`. Null default. |

## Status

| Status      | Meaning     |
| ----------- | ----------- |
| backlog     | Not started |
| planned     | Scheduled   |
| in_progress | Active dev  |
| done        | Released    |
| blocked     | Impeded     |

## Version `vX.Y.Z`

| Segment | Meaning  | Increment                  |
| ------- | -------- | -------------------------- |
| X       | Breaking | Architecture shift, API v2 |
| Y       | New      | Backward-compat addition   |
| Z       | Fix      | Bugfix, tweak              |

## ID Convention

Minimum ID width: 4 digits (`F0001`...`F9999`).
Exhausted? Use `F10000` (5 digits).
Run `scripts/renumber-ids.py` to pad old IDs.
