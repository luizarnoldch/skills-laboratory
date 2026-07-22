# FEATURES.yml Schema

## Structure

```yaml
project:
  name: string
  description: string
  version: string # vX.Y.Z
  status: string # from rules.possible_status
  contexts: [string]

rules:
  develop_one_feature_at_a_time: boolean
  possible_status: [string]

features:
  - id: string # F + digits, variable width
    name: string
    description: string
    status: string
    version: string # optional, vX.Y.Z
    depends_on: [string] # optional
    contexts: [string] # optional, subset of project.contexts
    date_updated: string # optional, auto-set on done
    prds: # optional, [] if none
      - name: string
        status: string
        version: string # optional
        link: string # docs/prds/<name>.md
        date_updated: string # optional, auto-set on done
```

## Constraints

- `project.contexts` not empty.
- `rules.possible_status` not empty.
- Feature `id`s unique, format `F` + digits.
- `depends_on` IDs must exist.
- `contexts` values in `project.contexts`.
- PRD `link` file must exist if provided at `docs/prds/<name>.md`.
- `date_updated` generated, not user input. Format `YYYY-MM-DD`.
