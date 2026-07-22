# Admin Plugin — API Reference

Detailed API signatures, query parameters, filtering, pagination, and permission utilities.

> **Server-side note:** All admin endpoints require session cookies. Pass `headers: await headers()` on the server when using `auth.api.*` calls.

---

## Endpoints — Client & Server

Each section shows both the **client** (`authClient.admin.*`) and **server** (`auth.api.*`) call pattern.

---

### createUser

**Client**

```ts
const { data: newUser, error } = await authClient.admin.createUser({
  email: "user@example.com",      // required
  password: "some-secure-password", // required
  name: "James Smith",            // required
  role: "user",
  data: { customField: "customValue" },
});
```

**Server**

```ts
const newUser = await auth.api.createUser({
  body: {
    email: "user@example.com",
    password: "some-secure-password",
    name: "James Smith",
    role: "user",
    data: { customField: "customValue" },
  },
});
```

---

### listUsers

All query properties are optional. Default `limit` = 100.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `searchValue` | `string` | — | Value to search for. |
| `searchField` | `"email" \| "name"` | `"name"` | Field to search in. |
| `searchOperator` | `"contains" \| "starts_with" \| "ends_with"` | `"contains"` | Search operator. |
| `limit` | `string \| number` | `100` | Rows to return. |
| `offset` | `string \| number` | `0` | Start offset. |
| `sortBy` | `string` | `"name"` | Field to sort by. |
| `sortDirection` | `"asc" \| "desc"` | `"desc"` | Sort direction. |
| `filterField` | `string` | `"email"` | Field to filter by. |
| `filterValue` | `string \| number \| boolean \| string[] \| number[]` | — | Value to filter by. |
| `filterOperator` | `"eq" \| "ne" \| "lt" \| "lte" \| "gt" \| "gte" \| "in" \| "not_in" \| "contains" \| "starts_with" \| "ends_with"` | `"eq"` | Filter operator. |

**Client**

```ts
const { data: users, error } = await authClient.admin.listUsers({
  query: {
    searchValue: "some name",
    searchField: "name",
    searchOperator: "contains",
    limit: 100,
    offset: 0,
    sortBy: "name",
    sortDirection: "desc",
    filterField: "email",
    filterValue: "hello@example.com",
    filterOperator: "eq",
  },
});
```

**Server**

```ts
const users = await auth.api.listUsers({
  query: {
    searchValue: "some name",
    searchField: "name",
    searchOperator: "contains",
    limit: 100,
    offset: 0,
    sortBy: "name",
    sortDirection: "desc",
    filterField: "email",
    filterValue: "hello@example.com",
    filterOperator: "eq",
  },
  headers: await headers(),
});
```

**Pagination math**

```ts
const totalPages = Math.ceil(total / limit);
const currentPage = (offset / limit) + 1;
const nextOffset = Math.min(offset + limit, total - 1);
const prevOffset = Math.max(0, offset - limit);
```

**Example: Page 2 with 10 per page**

```ts
const pageSize = 10;
const currentPage = 2;

// client
const { data } = await authClient.admin.listUsers({
  query: {
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  },
});
```

---

### getUser

**Client**

```ts
const { data, error } = await authClient.admin.getUser({
  query: { id: "user-id" }, // required
});
```

Returns `data: User | null` or `error: { message, status, statusText, code }`.

**Server**

```ts
const data = await auth.api.getUser({
  query: { id: "user-id" },
  headers: await headers(),
});
```

---

### setRole

**Client**

```ts
const { data, error } = await authClient.admin.setRole({
  userId: "user-id",
  role: "admin", // required (string | string[])
});
```

**Server**

```ts
const data = await auth.api.setRole({
  body: {
    userId: "user-id",
    role: "admin",
  },
  headers: await headers(),
});
```

---

### setUserPassword

**Client**

```ts
const { data, error } = await authClient.admin.setUserPassword({
  newPassword: "new-password", // required
  userId: "user-id",           // required
});
```

**Server**

```ts
const data = await auth.api.setUserPassword({
  body: {
    newPassword: "new-password",
    userId: "user-id",
  },
  headers: await headers(),
});
```

---

### updateUser

Client method is `updateUser`; server method is `adminUpdateUser`.

**Client**

```ts
const { data, error } = await authClient.admin.updateUser({
  userId: "user-id",              // required
  data: { name: "John Doe" },     // required
});
```

**Server**

```ts
const data = await auth.api.adminUpdateUser({
  body: {
    userId: "user-id",
    data: { name: "John Doe" },
  },
  headers: await headers(),
});
```

---

### banUser

**Client**

```ts
await authClient.admin.banUser({
  userId: "user-id",            // required
  banReason: "Spamming",
  banExpiresIn: 60 * 60 * 24 * 7, // seconds; omit for permanent
});
```

**Server**

```ts
await auth.api.banUser({
  body: {
    userId: "user-id",
    banReason: "Spamming",
    banExpiresIn: 60 * 60 * 24 * 7,
  },
  headers: await headers(),
});
```

---

### unbanUser

**Client**

```ts
await authClient.admin.unbanUser({
  userId: "user-id", // required
});
```

**Server**

```ts
await auth.api.unbanUser({
  body: { userId: "user-id" },
  headers: await headers(),
});
```

---

### listUserSessions

**Client**

```ts
const { data, error } = await authClient.admin.listUserSessions({
  userId: "user-id", // required
});
```

**Server**

```ts
const data = await auth.api.listUserSessions({
  body: { userId: "user-id" },
  headers: await headers(),
});
```

---

### revokeUserSession

**Client**

```ts
const { data, error } = await authClient.admin.revokeUserSession({
  sessionToken: "session_token_here", // required
});
```

**Server**

```ts
const data = await auth.api.revokeUserSession({
  body: { sessionToken: "session_token_here" },
  headers: await headers(),
});
```

---

### revokeUserSessions

**Client**

```ts
const { data, error } = await authClient.admin.revokeUserSessions({
  userId: "user-id", // required
});
```

**Server**

```ts
const data = await auth.api.revokeUserSessions({
  body: { userId: "user-id" },
  headers: await headers(),
});
```

---

### impersonateUser

**Client**

```ts
const { data, error } = await authClient.admin.impersonateUser({
  userId: "user-id", // required
});
```

**Server**

```ts
const data = await auth.api.impersonateUser({
  body: { userId: "user-id" },
  headers: await headers(),
});
```

---

### stopImpersonating

**Client**

```ts
await authClient.admin.stopImpersonating();
```

**Server**

```ts
await auth.api.stopImpersonating({
  headers: await headers(),
});
```

---

### removeUser

**Client**

```ts
const { data: deletedUser, error } = await authClient.admin.removeUser({
  userId: "user-id", // required
});
```

**Server**

```ts
const deletedUser = await auth.api.removeUser({
  body: { userId: "user-id" },
  headers: await headers(),
});
```

---

## Permission Checks

### Client: hasPermission

```ts
// Must use exactly one of `permission` or `permissions`
const { data, error } = await authClient.admin.hasPermission({
  userId: "user-id",
  permission: { project: ["create", "update"] },
  // permissions: { project: ["create"], sale: ["create"] },
});
```

### Server: userHasPermission

Client method is `hasPermission`; server method is `userHasPermission`.

```ts
const data = await auth.api.userHasPermission({
  body: {
    userId: "user-id",
    role: "admin",            // server-only: check by role instead of user
    permission: { project: ["create", "update"] },
    // permissions: { project: ["create"], sale: ["create"] },
  },
});
```

### Client: checkRolePermission (synchronous)

Checks whether a **role** (not the current user) has a permission. No server round-trip.

```ts
const canDeleteUser = authClient.admin.checkRolePermission({
  role: "admin",
  permissions: { user: ["delete"] },
});

const canDeleteAndRevoke = authClient.admin.checkRolePermission({
  role: "admin",
  permissions: { user: ["delete"], session: ["revoke"] },
});
```
