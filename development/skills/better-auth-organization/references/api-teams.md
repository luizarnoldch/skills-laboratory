# Client & Server API Reference

Each action is available on the client (`authClient.organization.*`) and on the server (`auth.api.*`). Server calls that require a session must pass `headers` with session cookies.

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
