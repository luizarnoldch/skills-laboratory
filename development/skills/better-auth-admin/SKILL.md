---
name: better-auth-admin
description: >
  Configure and use the Admin plugin for Better Auth to manage users, roles,
  bans, sessions, and impersonation. Use when the user asks about "better auth
  admin", "user management", "ban user", "impersonate user", "admin roles",
  "set user role", "list users", "revoke sessions", or when integrating the
  admin plugin into a better-auth project.
license: MIT
compatibility: Requires Node.js, better-auth, and a backend framework that supports cookie-based sessions.
metadata:
  publisher: better-auth-team
---
# Better Auth — Admin Plugin

Manage users, roles, bans, sessions, and impersonation with the better-auth Admin plugin.

> Load `references/admin-api-reference.md` for full API parameter tables, filtering operators, and pagination math.  
> Load `references/access-control.md` when the user needs custom roles, permissions, or the `hasPermission` / `checkRolePermission` flows.

---

## 1. Installation

### Server Plugin

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [admin()],
});
```

### Migrate Database

```bash
npx auth migrate
# or
npx auth generate
```

### Client Plugin

```ts title="auth-client.ts"
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [adminClient()],
});
```

> Admin operations require an authenticated user with the `admin` role (or an ID listed in `adminUserIds`).

---

## 2. Core User Management

### Create User

```ts
await authClient.admin.createUser({
  email: "user@example.com",
  password: "some-secure-password",
  name: "James Smith",
  role: "user",
  data: { customField: "customValue" },
});
```

### List Users

```ts
const { data: users } = await authClient.admin.listUsers({
  query: { limit: 10, offset: 0 },
});
```

Returns:

```ts
{ users: User[], total: number, limit?: number, offset?: number }
```

> For full query parameters, filter operators, search, sort, and pagination math, read `references/admin-api-reference.md`.

### Get User

```ts
const { data, error } = await authClient.admin.getUser({ id: "user-id" });
```

### Update User

```ts
await authClient.admin.updateUser({
  userId: "user-id",
  data: { name: "John Doe" },
});
```

### Set Role

```ts
await authClient.admin.setRole({
  userId: "user-id",
  role: "admin", // string | string[]
});
```

### Set Password

```ts
await authClient.admin.setUserPassword({
  userId: "user-id",
  newPassword: "new-password",
});
```

### Remove User

Hard-deletes a user.

```ts
await authClient.admin.removeUser({ userId: "user-id" });
```

---

## 3. Ban & Unban

### Ban

```ts
await authClient.admin.banUser({
  userId: "user-id",
  banReason: "Spamming",
  banExpiresIn: 60 * 60 * 24 * 7, // seconds; omit for permanent
});
```

Banning revokes **all** existing sessions for that user.

### Unban

```ts
await authClient.admin.unbanUser({ userId: "user-id" });
```

---

## 4. Session Management

### List User Sessions

```ts
const { data: sessions } = await authClient.admin.listUserSessions({
  userId: "user-id",
});
```

### Revoke a Single Session

```ts
await authClient.admin.revokeUserSession({ sessionToken: "token_here" });
```

### Revoke All Sessions for a User

```ts
await authClient.admin.revokeUserSessions({ userId: "user-id" });
```

---

## 5. Impersonation

Admins can create a session that acts as another user.

```ts
await authClient.admin.impersonateUser({ userId: "user-id" });
```

- Session lasts until browser closes or `impersonationSessionDuration` expires (default 1 hour).
- By default, admins **cannot** impersonate other admins. Grant `impersonate-admins` permission to a role to allow it.

Stop impersonating:

```ts
await authClient.admin.stopImpersonating();
```

---

## 6. Access Control Overview

### Default Roles

| Role | Permissions |
|------|-------------|
| `admin` | Full control over `user` and `session` resources. |
| `user` | No admin permissions. |

Multiple roles are stored comma-separated in the `role` column.

### Default Permissions

**user resource:** `create`, `list`, `set-role`, `ban`, `impersonate`, `impersonate-admins`, `delete`, `set-password`

**session resource:** `list`, `revoke`, `delete`

> For custom roles, custom resources, and permission-checking helpers, read `references/access-control.md`.

---

## 7. Schema

Adds fields to the `user` table:

| Field | Type | Description |
|-------|------|-------------|
| `role` | string | Defaults to `user`. |
| `banned` | boolean | Is the user banned? |
| `banReason` | string | Reason for the ban. |
| `banExpires` | date | When the ban expires. |

Adds a field to the `session` table:

| Field | Type | Description |
|-------|------|-------------|
| `impersonatedBy` | string | ID of the admin that started the impersonated session. |

### Email Enumeration Protection

If `requireEmailVerification` or `autoSignIn: false` is enabled, provide `customSyntheticUser` that includes admin fields:

```ts
customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
  ...coreFields,
  role: "user",
  banned: false,
  banReason: null,
  banExpires: null,
  ...additionalFields,
  id,
});
```

---

## 8. Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultRole` | string | `user` | Default role for new users. |
| `adminRoles` | string[] | `["admin"]` | Roles treated as admin. Custom roles require custom access control. |
| `adminUserIds` | string[] | `[]` | Specific user IDs with full admin access. |
| `impersonationSessionDuration` | number | 3600 | Impersonation session lifetime in seconds. |
| `defaultBanReason` | string | `"No reason"` | Default ban reason. |
| `defaultBanExpiresIn` | number | undefined | Default ban duration in seconds. |
| `bannedUserMessage` | string | `"You have been banned..."` | Message shown to banned users on sign-in. |

---

## 9. Gotchas

- `adminRoles` is **ignored** when custom access control (`ac` + `roles`) is used.
- Only `admin` and `user` exist as valid roles when **not** using custom access control. Any role outside `adminRoles` cannot perform admin operations.
- `impersonate-admins` permission is required to impersonate other admin users.
- Bans immediately revoke all sessions for the target user.
- Passwords are stored in the `account` table (`providerId: "credential"`), not the `user` table.

---

## 10. References

Load conditionally:

- **`references/admin-api-reference.md`** — Full `listUsers` query parameters, filter/search operators, pagination formulas, all API method signatures, server-side `userHasPermission`, and client `checkRolePermission`. Load when the user asks about listing users, filtering, pagination, or detailed API shapes.
- **`references/access-control.md`** — Step-by-step guide to `createAccessControl`, defining custom roles, merging `defaultStatements`, passing `ac` and `roles` to server and client plugins, and permission checks. Load when the user asks about custom roles, permissions, access control, or `hasPermission`.
