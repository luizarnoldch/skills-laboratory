# Admin Plugin — Access Control

Full walkthrough for custom roles, permissions, and access control with the better-auth Admin plugin.

---

## 1. Create an Access Controller

Import `createAccessControl` from `better-auth/plugins/access` (keeps bundle small). Pass a statement object with resource names as keys and action arrays as values. Use `as const` for type inference.

```ts title="permissions.ts"
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  project: ["create", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);
```

---

## 2. Create Roles

Use `ac.newRole` to define permission sets.

```ts title="permissions.ts"
export const user = ac.newRole({
  project: ["create"],
});

export const admin = ac.newRole({
  project: ["create", "update"],
});

export const myCustomRole = ac.newRole({
  project: ["create", "update", "delete"],
  user: ["ban"],
});
```

---

## 3. Merge Default Statements

Custom roles override the built-in `admin` and `user` roles. To keep the default admin permissions while adding your own, merge `defaultStatements` and `adminAc.statements`.

```ts title="permissions.ts"
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  project: ["create", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  project: ["create", "update"],
  ...adminAc.statements,
});
```

---

## 4. Pass Roles to the Plugin

### Server

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user, myCustomRole } from "@/auth/permissions";

export const auth = betterAuth({
  plugins: [
    adminPlugin({
      ac,
      roles: { admin, user, myCustomRole },
    }),
  ],
});
```

### Client

```ts title="auth-client.ts"
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, user, myCustomRole } from "@/auth/permissions";

export const client = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: { admin, user, myCustomRole },
    }),
  ],
});
```

---

## 5. Permission Checks

### Client: hasPermission

```ts
const canCreate = await authClient.admin.hasPermission({
  permissions: { project: ["create"] },
});

// You can also check a single permission
const canCreate = await authClient.admin.hasPermission({
  permission: { project: ["create"] },
});
```

### Server: userHasPermission

```ts
import { auth } from "@/lib/auth";

await auth.api.userHasPermission({
  body: {
    userId: "id",
    permissions: { project: ["create"] },
  },
});
```

Pass role directly:

```ts
await auth.api.userHasPermission({
  body: {
    role: "admin",
    permissions: { project: ["create"] },
  },
});
```

### Client: checkRolePermission (synchronous)

Checks whether a **role** has a permission. Does not contact the server.

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

---

## 6. Allow Impersonating Admins

By default, admins cannot impersonate other admins. Grant the `impersonate-admins` permission to a custom role:

```ts title="permissions.ts"
export const superAdmin = ac.newRole({
  ...adminAc.statements,
  user: ["impersonate-admins", ...adminAc.statements.user],
});
```

> The legacy `allowImpersonatingAdmins` option still works but is deprecated.
