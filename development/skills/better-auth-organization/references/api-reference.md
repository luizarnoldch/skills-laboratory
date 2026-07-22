# Client & Server API Reference

Each action is available on the client (`authClient.organization.*`) and on the server (`auth.api.*`). Server calls that require a session must pass `headers` with session cookies.

---

## Organization

### Create

```ts
// Client
const { data, error } = await authClient.organization.create({
  name: "My Organization", // required
  slug: "my-org",          // required
  logo: "https://example.com/logo.png",
  metadata: { someKey: "someValue" },
  userId: "some_user_id",
  keepCurrentActiveOrganization: false,
});

// Server
const data = await auth.api.createOrganization({
  body: {
    name: "My Organization", // required
    slug: "my-org",          // required
    logo: "https://example.com/logo.png",
    metadata: { someKey: "someValue" },
    userId: "some_user_id",
    keepCurrentActiveOrganization: false,
  },
  headers: await headers(),
});
```

### Check Slug

```ts
// Client
const { data, error } = await authClient.organization.checkSlug({
  slug: "my-org", // required
});

// Server
const data = await auth.api.checkOrganizationSlug({
  body: { slug: "my-org" },
});
```

### List

```ts
// Client
const { data, error } = await authClient.organization.list();

// Server
const data = await auth.api.listOrganizations({
  headers: await headers(),
});
```

### Set Active

```ts
// Client
const { data, error } = await authClient.organization.setActive({
  organizationId: "org-id",
  organizationSlug: "org-slug",
});

// Server
const data = await auth.api.setActiveOrganization({
  body: {
    organizationId: "org-id",
    organizationSlug: "org-slug",
  },
  headers: await headers(),
});
```

### Get Full Organization

```ts
// Client
const { data, error } = await authClient.organization.getFullOrganization({
  query: {
    organizationId: "org-id",
    organizationSlug: "org-slug",
    membersLimit: 100,
  },
});

// Server
const data = await auth.api.getFullOrganization({
  query: {
    organizationId: "org-id",
    organizationSlug: "org-slug",
    membersLimit: 100,
  },
  headers: await headers(),
});
```

### Update

```ts
// Client
const { data, error } = await authClient.organization.update({
  data: {               // required
    name: "updated-name",
    slug: "updated-slug",
    logo: "new-logo.url",
    metadata: { customerId: "test" },
  },
  organizationId: "org-id",
});

// Server
const data = await auth.api.updateOrganization({
  body: {
    data: {               // required
      name: "updated-name",
      slug: "updated-slug",
      logo: "new-logo.url",
      metadata: { customerId: "test" },
    },
    organizationId: "org-id",
  },
  headers: await headers(),
});
```

### Delete

```ts
// Client
const { data, error } = await authClient.organization.delete({
  organizationId: "org-id", // required
});

// Server
const data = await auth.api.deleteOrganization({
  body: { organizationId: "org-id" },
  headers: await headers(),
});
```

---

## Invitations

### Send

```ts
// Client
const { data, error } = await authClient.organization.inviteMember({
  email: "example@gmail.com", // required
  role: "member",             // required
  organizationId: "org-id",
  resend: true,
  teamId: "team-id",
});

// Server
const data = await auth.api.createInvitation({
  body: {
    email: "example@gmail.com",
    role: "member",
    organizationId: "org-id",
    resend: true,
    teamId: "team-id",
  },
  headers: await headers(),
});
```

### Accept

```ts
// Client
const { data, error } = await authClient.organization.acceptInvitation({
  invitationId: "invitation-id", // required
});

// Server
const data = await auth.api.acceptInvitation({
  body: { invitationId: "invitation-id" },
  headers: await headers(),
});
```

### Cancel

```ts
// Client
await authClient.organization.cancelInvitation({
  invitationId: "invitation-id", // required
});

// Server
await auth.api.cancelInvitation({
  body: { invitationId: "invitation-id" },
  headers: await headers(),
});
```

### Reject

```ts
// Client
await authClient.organization.rejectInvitation({
  invitationId: "invitation-id", // required
});

// Server
await auth.api.rejectInvitation({
  body: { invitationId: "invitation-id" },
  headers: await headers(),
});
```

### Get

```ts
// Client
const { data, error } = await authClient.organization.getInvitation({
  query: { id: "invitation-id" }, // required
});

// Server
const data = await auth.api.getInvitation({
  query: { id: "invitation-id" },
  headers: await headers(),
});
```

### List (organization)

```ts
// Client
const { data, error } = await authClient.organization.listInvitations({
  query: { organizationId: "organization-id" },
});

// Server
const data = await auth.api.listInvitations({
  query: { organizationId: "organization-id" },
  headers: await headers(),
});
```

### List (user)

```ts
// Client
const { data, error } = await authClient.organization.listUserInvitations();

// Server — by email query parameter
const data = await auth.api.listUserInvitations({
  query: { email: "user@example.com" },
});
```

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

---

## Teams

### Create Team

```ts
// Client
const { data, error } = await authClient.organization.createTeam({
  name: "my-team", // required
  organizationId: "organization-id",
});

// Server
const data = await auth.api.createTeam({
  body: {
    name: "my-team",
    organizationId: "organization-id",
  },
});
```

### List Teams

```ts
// Client
const { data, error } = await authClient.organization.listTeams({
  query: { organizationId: "organization-id" },
});

// Server
const data = await auth.api.listOrganizationTeams({
  query: { organizationId: "organization-id" },
  headers: await headers(),
});
```

### Update Team

```ts
// Client
const { data, error } = await authClient.organization.updateTeam({
  teamId: "team-id", // required
  data: {            // required
    name: "My new team name",
    organizationId: "My new organization ID for this team",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
});

// Server
const data = await auth.api.updateTeam({
  body: {
    teamId: "team-id",
    data: {
      name: "My new team name",
      organizationId: "My new organization ID for this team",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  headers: await headers(),
});
```

### Remove Team

```ts
// Client
const { data, error } = await authClient.organization.removeTeam({
  teamId: "team-id", // required
  organizationId: "organization-id",
});

// Server
const data = await auth.api.removeTeam({
  body: {
    teamId: "team-id",
    organizationId: "organization-id",
  },
});
```

### Set Active Team

```ts
// Client
const { data, error } = await authClient.organization.setActiveTeam({
  teamId: "team-id",
});

// Server
const data = await auth.api.setActiveTeam({
  body: { teamId: "team-id" },
  headers: await headers(),
});
```

### List User Teams

```ts
// Client
const { data, error } = await authClient.organization.listUserTeams();

// Server
const data = await auth.api.listUserTeams({
  headers: await headers(),
});
```

### List Team Members

```ts
// Client
const { data, error } = await authClient.organization.listTeamMembers({
  query: { teamId: "team-id" },
});

// Server
const data = await auth.api.listTeamMembers({
  query: { teamId: "team-id" },
  headers: await headers(),
});
```

### Add Team Member

```ts
// Client
const { data, error } = await authClient.organization.addTeamMember({
  teamId: "team-id", // required
  userId: "user-id", // required
});

// Server
const data = await auth.api.addTeamMember({
  body: {
    teamId: "team-id",
    userId: "user-id",
  },
  headers: await headers(),
});
```

### Remove Team Member

```ts
// Client
const { data, error } = await authClient.organization.removeTeamMember({
  teamId: "team-id", // required
  userId: "user-id", // required
});

// Server
const data = await auth.api.removeTeamMember({
  body: {
    teamId: "team-id",
    userId: "user-id",
  },
  headers: await headers(),
});
```
