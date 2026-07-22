# Client & Server API Reference

Each action is available on the client (`authClient.organization.*`) and on the server (`auth.api.*`). Server calls that require a session must pass `headers` with session cookies.

---

## Dynamic Roles

### Create Role

```ts
// Client
await authClient.organization.createRole({
  role: "my-unique-role", // required
  permission: { project: ["create", "update", "delete"] },
  organizationId: "organization-id",
});

// Server
await auth.api.createOrgRole({
  body: {
    role: "my-unique-role",
    permission: { project: ["create", "update", "delete"] },
    organizationId: "organization-id",
  },
  headers: await headers(),
});
```

### Delete Role

```ts
// Client
await authClient.organization.deleteRole({
  roleName: "my-role",
  roleId: "role-id",
  organizationId: "organization-id",
});

// Server
await auth.api.deleteOrgRole({
  body: {
    roleName: "my-role",
    roleId: "role-id",
    organizationId: "organization-id",
  },
  headers: await headers(),
});
```

### List Roles

```ts
// Client
const { data: roles, error } = await authClient.organization.listRoles({
  query: { organizationId: "organization-id" },
});

// Server
const roles = await auth.api.listOrgRoles({
  query: { organizationId: "organization-id" },
  headers: await headers(),
});
```

### Get Role

```ts
// Client
const { data: role, error } = await authClient.organization.getRole({
  query: {
    roleName: "my-role",
    roleId: "role-id",
    organizationId: "organization-id",
  },
});

// Server
const role = await auth.api.getOrgRole({
  query: {
    roleName: "my-role",
    roleId: "role-id",
    organizationId: "organization-id",
  },
  headers: await headers(),
});
```

### Update Role

```ts
// Client
const { data: updatedRole, error } = await authClient.organization.updateRole({
  roleName: "my-role",
  roleId: "role-id",
  organizationId: "organization-id",
  data: {                // required
    permission: { project: ["create", "update", "delete"] },
    roleName: "my-new-role",
  },
});

// Server
const updatedRole = await auth.api.updateOrgRole({
  body: {
    roleName: "my-role",
    roleId: "role-id",
    organizationId: "organization-id",
    data: {
      permission: { project: ["create", "update", "delete"] },
      roleName: "my-new-role",
    },
  },
  headers: await headers(),
});
```
