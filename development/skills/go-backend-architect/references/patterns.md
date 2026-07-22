# Go Backend Architect — Extended Patterns Reference

Extended code patterns for complex scenarios not covered in the main skill file templates. Reference specific sections from `go-backend-architect` tasks.

---

## 1. Pagination Helpers

### Cursor-based pagination (recommended for large datasets)

**Domain struct:**
```go
// ListParams is the standard input for any list operation.
type List{Entity}Params struct {
    Cursor   string // ID of last item seen; empty = first page
    Limit    int    // max items to return; default 20, max 100
    OrderBy  string // "created_at" | "updated_at" | field name
    OrderDir string // "asc" | "desc"
    // add filter fields here (e.g., Status string)
}
```

**sqlc query (`sql/queries/{entity}.sql`):**
```sql
-- name: List{Entity}s :many
SELECT *
FROM {entities}
WHERE deleted_at IS NULL
  AND (
    @cursor::text = ''
    OR id < @cursor::uuid  -- for DESC order; flip to > for ASC
  )
ORDER BY created_at DESC
LIMIT @limit + 1;  -- fetch N+1 to detect next page
```

**Repository implementation:**
```go
func (r *{entity}Repository) List(ctx context.Context, params List{Entity}Params) ([]{Entity}, string, error) {
    limit := params.Limit
    if limit <= 0 || limit > 100 {
        limit = 20
    }

    rows, err := r.db.List{Entity}s(ctx, sqlc.List{Entity}sParams{
        Cursor: params.Cursor,
        Limit:  int32(limit + 1), // +1 to check for next page
    })
    if err != nil {
        return nil, "", fmt.Errorf("{context}.List: %w", err)
    }

    hasNext := len(rows) > limit
    if hasNext {
        rows = rows[:limit]
    }

    items := make([]{Entity}, len(rows))
    for i, row := range rows {
        items[i] = *map{Entity}FromDB(row)
    }

    nextCursor := ""
    if hasNext {
        nextCursor = items[len(items)-1].ID
    }

    return items, nextCursor, nil
}
```

**DTO response:**
```go
type {Entity}ListResponse struct {
    Items      []{Entity}Response `json:"items"`
    NextCursor string             `json:"next_cursor,omitempty"` // empty = no more pages
    HasMore    bool               `json:"has_more"`
}
```

### Offset-based pagination (simpler, fine for admin panels)

```sql
-- name: List{Entity}sOffset :many
SELECT * FROM {entities}
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT @limit OFFSET @offset;

-- name: Count{Entity}s :one
SELECT COUNT(*) FROM {entities} WHERE deleted_at IS NULL;
```

**DTO response:**
```go
type {Entity}ListResponse struct {
    Items      []{Entity}Response `json:"items"`
    TotalCount int64              `json:"total_count"`
    Page       int                `json:"page"`
    PageSize   int                `json:"page_size"`
    TotalPages int                `json:"total_pages"`
}
```

---

## 2. Soft Delete Query Patterns

**Schema requirement:** The entity table must have `deleted_at TIMESTAMPTZ` (nullable).

**sqlc queries:**
```sql
-- name: SoftDelete{Entity} :exec
UPDATE {entities}
SET deleted_at = now()
WHERE id = @id
  AND deleted_at IS NULL;

-- name: Get{Entity}ByID :one
SELECT * FROM {entities}
WHERE id = @id
  AND deleted_at IS NULL;  -- always exclude soft-deleted in normal reads

-- name: Get{Entity}ByIDIncludeDeleted :one
SELECT * FROM {entities}
WHERE id = @id;  -- admin use only
```

**Repository soft-delete method:**
```go
func (r *{entity}Repository) SoftDelete(ctx context.Context, id string) error {
    err := r.db.SoftDelete{Entity}(ctx, uuid.MustParse(id))
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return Err{Entity}NotFound
        }
        return fmt.Errorf("{context}.SoftDelete: %w", err)
    }
    return nil
}
```

**Service layer guard (check ownership before delete):**
```go
func (s *{entity}Service) Delete{Entity}(ctx context.Context, id string, callerID string) error {
    existing, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return fmt.Errorf("{context}.Delete{Entity}: %w", err)
    }

    if existing.OwnerID != callerID {
        return Err{Entity}Forbidden
    }

    return s.repo.SoftDelete(ctx, id)
}
```

**Handler error mapping (add to sentinel errors in `domain.go`):**
```go
var (
    Err{Entity}NotFound  = errors.New("{context}: not found")
    Err{Entity}Forbidden = errors.New("{context}: forbidden")
)

// In handler.go switch:
case errors.Is(err, Err{Entity}Forbidden):
    respond.Forbidden(w)
```

---

## 3. Status Transition Validation

**Pattern:** Encode allowed transitions in a map in `domain.go`. Service validates before calling repository.

**domain.go:**
```go
// {Entity}Status enumerates all valid statuses.
// These must match the CHECK constraint in the migration:
// CHECK (status IN ('draft', 'active', 'archived', 'cancelled'))
type {Entity}Status string

const (
    {Entity}StatusDraft     {Entity}Status = "draft"
    {Entity}StatusActive    {Entity}Status = "active"
    {Entity}StatusArchived  {Entity}Status = "archived"
    {Entity}StatusCancelled {Entity}Status = "cancelled"
)

// allowed{Entity}Transitions is the source of truth for valid state changes.
// Key = current status. Value = set of statuses it can transition to.
var allowed{Entity}Transitions = map[{Entity}Status]map[{Entity}Status]bool{
    {Entity}StatusDraft:    {{Entity}StatusActive: true},
    {Entity}StatusActive:   {{Entity}StatusArchived: true, {Entity}StatusCancelled: true},
    {Entity}StatusArchived: {},         // terminal
    {Entity}StatusCancelled: {},        // terminal
}

// Can{Entity}Transition returns true if transitioning from → to is permitted.
func Can{Entity}Transition(from, to {Entity}Status) bool {
    allowed, ok := allowed{Entity}Transitions[from]
    if !ok {
        return false
    }
    return allowed[to]
}
```

**service.go — transition method:**
```go
func (s *{entity}Service) Transition{Entity}(ctx context.Context, id string, toStatus {Entity}Status) (*{Entity}Response, error) {
    existing, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("{context}.Transition{Entity}: %w", err)
    }

    if !Can{Entity}Transition(existing.Status, toStatus) {
        return nil, fmt.Errorf(
            "%w: cannot transition from %s to %s",
            ErrInvalidStatusChange,
            existing.Status,
            toStatus,
        )
    }

    updated, err := s.repo.UpdateStatus(ctx, id, toStatus)
    if err != nil {
        return nil, fmt.Errorf("{context}.Transition{Entity}: %w", err)
    }

    res := {entity}ToResponse(updated)
    return &res, nil
}
```

**handler.go — transition endpoint:**
```go
// POST /products/{id}/activate
func (h *{Entity}Handler) HandleActivate{Entity}(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id")
    res, err := h.svc.Transition{Entity}(r.Context(), id, {Entity}StatusActive)
    if err != nil {
        switch {
        case errors.Is(err, Err{Entity}NotFound):
            respond.NotFound(w, err)
        case errors.Is(err, ErrInvalidStatusChange):
            respond.BadRequest(w, err) // 400 — client sent invalid transition
        default:
            respond.InternalError(w, err)
        }
        return
    }
    respond.JSON(w, http.StatusOK, res)
}
```

**sqlc query:**
```sql
-- name: Update{Entity}Status :one
UPDATE {entities}
SET status = @status, updated_at = now()
WHERE id = @id
  AND deleted_at IS NULL
RETURNING *;
```

---

## 4. Audit Log / Event Appending

**Pattern:** Append-only `events` table per entity type. Written on every state change. Never updated or deleted.

**Migration (`sql/migrations/YYYYMMDDHHMMSS_{entity}_events_create.sql`):**
```sql
CREATE TABLE IF NOT EXISTS {entity}_events (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id  UUID        NOT NULL REFERENCES {entities}(id),
    actor_id   UUID        NOT NULL,  -- user who triggered the change
    event_type TEXT        NOT NULL,  -- 'created' | 'activated' | 'cancelled' | ...
    payload    JSONB       NOT NULL DEFAULT '{}',  -- before/after snapshot or extra context
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_{entity}_events_entity_id ON {entity}_events(entity_id);
CREATE INDEX idx_{entity}_events_created_at ON {entity}_events(created_at DESC);
```

**domain.go additions:**
```go
type {Entity}Event struct {
    ID         string
    EntityID   string
    ActorID    string
    EventType  string
    Payload    map[string]any
    CreatedAt  time.Time
}
```

**interface.go additions:**
```go
type {Entity}Repository interface {
    // ... existing methods ...
    AppendEvent(ctx context.Context, event Create{Entity}EventInput) error
    ListEvents(ctx context.Context, entityID string) ([]{Entity}Event, error)
}

type Create{Entity}EventInput struct {
    EntityID  string
    ActorID   string
    EventType string
    Payload   map[string]any
}
```

**service.go — emit event after every mutation:**
```go
func (s *{entity}Service) Create{Entity}(ctx context.Context, req Create{Entity}Request, actorID string) (*{Entity}Response, error) {
    created, err := s.repo.Create(ctx, Create{Entity}Input{/* ... */})
    if err != nil {
        return nil, fmt.Errorf("{context}.Create{Entity}: %w", err)
    }

    // Append audit event — non-fatal if it fails (log but do not roll back)
    _ = s.repo.AppendEvent(ctx, Create{Entity}EventInput{
        EntityID:  created.ID,
        ActorID:   actorID,
        EventType: "created",
        Payload:   map[string]any{"name": created.Name},
    })

    res := {entity}ToResponse(created)
    return &res, nil
}
```

**sqlc query:**
```sql
-- name: Append{Entity}Event :exec
INSERT INTO {entity}_events (entity_id, actor_id, event_type, payload)
VALUES (@entity_id, @actor_id, @event_type, @payload);

-- name: List{Entity}Events :many
SELECT * FROM {entity}_events
WHERE entity_id = @entity_id
ORDER BY created_at ASC;
```

---

## Usage Checklist

When applying any pattern above, verify:

- [ ] sqlc query written and named correctly
- [ ] `sqlc generate` run — no compile errors in generated code
- [ ] Domain struct updated if new fields added
- [ ] Interface updated before implementing repository/service
- [ ] Sentinel errors added to `domain.go` for all new error cases
- [ ] Handler switch updated to map new sentinel errors to HTTP codes
- [ ] Migration file includes rollback (`down`) file
- [ ] `go build ./...` passes
- [ ] `go vet ./...` passes
