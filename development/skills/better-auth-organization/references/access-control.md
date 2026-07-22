# Access Control Reference

Complete guide to static (compile-time) access control with the Organization plugin.

---

## 1. Default Roles & Permissions

| Role | Scope |
|------|-------|
| `owner` | Full control over all resources and actions. |
| `admin` | Full control except `organization:delete` and changing owner. |
| `member` | Read-only. No `create`, `update`, or `delete` permissions. |

Default resources and actions:

```
organization:  update, delete
member:        create, update, delete
invitation:    create, cancel
```

Multiple roles per user are stored comma-separated in the member `role` column.

---

## 2. Custom Permissions — Full Workflow

### Step 1: Create Access Control

```ts title="permissions.ts"
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);
```

> Import from `better-auth/plugins/access` (not `better-auth/plugins`) to minimize bundle size.

### Step 2: Define Roles

```ts
const member = ac.newRole({ project: ["create"] });
const admin  = ac.newRole({ project: ["create", "update"] });
const owner  = ac.newRole({ project: ["create", "update", "delete"] });

const myCustomRole = ac.newRole({
  project: ["create", "update", "delete"],
  organization: ["update"],
});
```

### Step 3: Preserve Defaults When Overriding

When you assign custom permissions to built-in role names (`owner`, `admin`, `member`), the original defaults are **overwritten**. Merge them back:

```ts
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const admin = ac.newRole({
  project: ["create", "update"],
  ...adminAc.statements,
});
```

### Step 4: Wire Into Server

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { ac, owner, admin, member, myCustomRole } from "@/auth/permissions";

export const auth = betterAuth({
  plugins: [
    organization({
      ac,
      roles: { owner, admin, member, myCustomRole },
    }),
  ],
});
```

### Step 5: Wire Into Client

```ts title="auth-client.ts"
import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";
import { ac, owner, admin, member, myCustomRole } from "@/auth/permissions";

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: { owner, admin, member, myCustomRole },
    }),
  ],
});
```

---

## 3. Checking Permissions

### Server — `hasPermission`

```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const result = await auth.api.hasPermission({
  headers: await headers(),
  body: {
    permissions: {
      project: ["create"],
    },
  },
});

// Multiple resources at once
await auth.api.hasPermission({
  headers: await headers(),
  body: {
    permissions: {
      project: ["create"],
      sale: ["create"],
    },
  },
});
```

### Client — `hasPermission`

```ts
const canCreateProject = await authClient.organization.hasPermission({
  permissions: {
    project: ["create"],
  },
});

const canDoBoth = await authClient.organization.hasPermission({
  permissions: {
    project: ["create"],
    sale: ["create"],
  },
});
```

> `hasPermission` hits the server and supports dynamic roles.

### Client — `checkRolePermission` (sync, no server call)

```ts
const canDelete = authClient.organization.checkRolePermission({
  permissions: {
    organization: ["delete"],
    member: ["delete"],
  },
  role: "admin",
});
```

> **Limitation**: `checkRolePermission` is synchronous on the client and does **not** include dynamic roles. Use `hasPermission` if dynamic roles are involved.

---

## 4. Role Priority Rules

- `owner` always wins if present in the user's roles.
- `admin` has full control minus `organization:delete`.
- Custom roles restrict to exactly the actions you grant.
- When using custom `ac` + `roles`, the built-in `adminRoles` option is ignored.

---

## 5. Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting `as const` on the statement | TypeScript cannot infer actions; add `as const`. |
| Overriding built-in roles without merging defaults | Import `defaultStatements` and `adminAc.statements` and spread them. |
| Using `checkRolePermission` with dynamic roles | Use `hasPermission` instead — it resolves on the server. |
| Passing only to server plugin | Must pass `ac` and `roles` to **both** server and client plugins. |
| Importing from `better-auth/plugins` | Import `createAccessControl` from `better-auth/plugins/access` for tree-shaking. |
