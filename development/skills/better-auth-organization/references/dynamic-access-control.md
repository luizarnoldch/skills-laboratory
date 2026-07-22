# Dynamic Access Control Reference

Runtime role creation stored per-organization in the `organizationRole` table.

---

## 1. Enable

Requires `ac` pre-defined on the server. Pass `dynamicAccessControl` to **both** plugins.

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { ac } from "@/auth/permissions";

export const auth = betterAuth({
  plugins: [
    organization({
      ac, // required — infers available permissions
      dynamicAccessControl: { enabled: true },
    }),
  ],
});
```

```ts title="auth-client.ts"
import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      dynamicAccessControl: { enabled: true },
    }),
  ],
});
```

> Requires migration to add the `organizationRole` table.

---

## 2. Creating a Role

Only users whose current role has `ac:create` can create roles. By default: `admin` and `owner`.

Custom permissions must be a subset of what the creator already has.

```ts
await authClient.organization.createRole({
  role: "my-unique-role",
  permission: { project: ["create", "update", "delete"] },
  organizationId?: "org-id",
});
```

---

## 3. Deleting a Role

```ts
await authClient.organization.deleteRole({
  roleName?: "my-role",
  roleId?: "role-id",
  organizationId?: "org-id",
});
```

---

## 4. Listing Roles

Requires `ac:read` permission.

```ts
const { data: roles } = await authClient.organization.listOrgRoles({
  organizationId?: "org-id",
});
```

---

## 5. Getting a Specific Role

Requires `ac:read` permission.

```ts
const { data: role } = await authClient.organization.getOrgRole({
  roleName?: "my-role",
  roleId?: "role-id",
  organizationId?: "org-id",
});
```

---

## 6. Updating a Role

```ts
const { data: updatedRole } = await authClient.organization.updateOrgRole({
  roleName?: "my-role",
  roleId?: "role-id",
  organizationId?: "org-id",
  data: {
    permission: { project: ["create", "update"] },
    roleName: "my-new-role",
  },
});
```

---

## 7. Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable dynamic access control. |
| `maximumRolesPerOrganization` | `number` \| `async (orgId) => number` | `Infinity` | Max roles per org. |

Example with dynamic limit:

```ts
dynamicAccessControl: {
  enabled: true,
  maximumRolesPerOrganization: async (organizationId) => {
    const org = await getOrganization(organizationId);
    return org.plan === "pro" ? 100 : 10;
  },
}
```

---

## 8. Schema Customization

Add fields to `organizationRole` table:

```ts
organization({
  schema: {
    organizationRole: {
      additionalFields: {
        color: {
          type: "string",
          defaultValue: "#ffffff",
        },
      },
    },
  },
});
```

Infer on client:

```ts
import { inferOrgAdditionalFields } from "better-auth/client/plugins";

organizationClient({ schema: inferOrgAdditionalFields<typeof auth>() })
```

Or pass values directly:

```ts
organizationClient({
  schema: {
    organizationRole: {
      additionalFields: { color: { type: "string", defaultValue: "#ffffff" } },
    },
  },
})
```

---

## 9. Important Notes

- `authClient.organization.checkRolePermission` **does not** evaluate dynamic roles. Always use `hasPermission` when dynamic roles may be involved.
- The `ac` instance on the server defines the universe of available permissions. Dynamic roles cannot exceed that set.
- Users can only assign permissions they already possess.
