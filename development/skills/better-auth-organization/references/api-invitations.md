# Client & Server API Reference

Each action is available on the client (`authClient.organization.*`) and on the server (`auth.api.*`). Server calls that require a session must pass `headers` with session cookies.

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
