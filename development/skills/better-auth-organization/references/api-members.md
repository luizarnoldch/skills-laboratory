# Client & Server API Reference

Each action is available on the client (`authClient.organization.*`) and on the server (`auth.api.*`). Server calls that require a session must pass `headers` with session cookies.

---

## Members

### List

```ts
// Client
const { data, error } = await authClient.organization.listMembers({
  query: {
    organizationId: "organization-id",
    limit: 100,
    offset: 0,
    sortBy: "createdAt",
    sortDirection: "desc",
    filterField: "createdAt",
    filterOperator: "eq",
    filterValue: "value",
  },
});

// Server
const data = await auth.api.listMembers({
  query: {
    organizationId: "organization-id",
    limit: 100,
    offset: 0,
    sortBy: "createdAt",
    sortDirection: "desc",
    filterField: "createdAt",
    filterOperator: "eq",
    filterValue: "value",
  },
  headers: await headers(),
});
```

### Remove

```ts
// Client
const { data, error } = await authClient.organization.removeMember({
  memberIdOrEmail: "user@example.com", // required
  organizationId: "org-id",
});

// Server
const data = await auth.api.removeMember({
  body: {
    memberIdOrEmail: "user@example.com",
    organizationId: "org-id",
  },
  headers: await headers(),
});
```

### Update Role

```ts
// Client
await authClient.organization.updateMemberRole({
  role: ["admin", "sale"], // required
  memberId: "member-id",    // required
  organizationId: "organization-id",
});

// Server
await auth.api.updateMemberRole({
  body: {
    role: ["admin", "sale"],
    memberId: "member-id",
    organizationId: "organization-id",
  },
  headers: await headers(),
});
```

### Get Active Member

```ts
// Client
const { data: member, error } = await authClient.organization.getActiveMember();

// Server
const member = await auth.api.getActiveMember({
  headers: await headers(),
});
```

### Get Active Member Role

```ts
// Client
const { data: { role }, error } = await authClient.organization.getActiveMemberRole();

// Server
const { role } = await auth.api.getActiveMemberRole({
  headers: await headers(),
});
```

### Add Member (server-only)

```ts
const data = await auth.api.addMember({
  body: {
    userId: "user-id",
    role: ["admin", "sale"], // required
    organizationId: "org-id",
    teamId: "team-id",
  },
});
```

### Leave

```ts
// Client
await authClient.organization.leave({
  organizationId: "organization-id", // required
});

// Server
await auth.api.leaveOrganization({
  body: { organizationId: "organization-id" },
  headers: await headers(),
});
```
