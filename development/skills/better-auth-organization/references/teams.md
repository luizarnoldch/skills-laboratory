# Teams Reference

Group members within an organization using the teams feature.

---

## 1. Enable Teams

Pass `teams` to **both** server and client plugins.

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    organization({
      teams: {
        enabled: true,
        maximumTeams: 10,           // Optional: limit teams per org
        allowRemovingAllTeams: false, // Optional: prevent removing the last team
      },
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
      teams: { enabled: true },
    }),
  ],
});
```

> Requires migration to add `team` and `teamMember` tables.

---

## 2. Managing Teams

### Create

```ts
await authClient.organization.createTeam({
  name: "my-team",
  organizationId?: "org-id",
});
```

### List Teams

```ts
await authClient.organization.listOrganizationTeams({
  organizationId?: "org-id",
});
```

### Update

```ts
await authClient.organization.updateTeam({
  teamId: "team-id",
  data: {
    name?: "My new team name",
    organizationId?: "org-id",
    createdAt?: new Date(),
    updatedAt?: new Date(),
  },
});
```

### Remove

```ts
await authClient.organization.removeTeam({
  teamId: "team-id",
  organizationId?: "org-id",
});
```

### Set Active Team

Sets the active team for the current active organization. Pass `null` to unset.

```ts
await authClient.organization.setActiveTeam({
  teamId?: "team-id" | null,
});
```

### List User Teams

```ts
await authClient.organization.listUserTeams();
```

### List Team Members

```ts
await authClient.organization.listTeamMembers({
  teamId?: "team-id",
});
```

### Add Team Member

```ts
await authClient.organization.addTeamMember({
  teamId: "team-id",
  userId: "user-id",
});
```

### Remove Team Member

```ts
await authClient.organization.removeTeamMember({
  teamId: "team-id",
  userId: "user-id",
});
```

---

## 3. Team Permissions

Users need these permissions to manage teams:

* `team:create` — Create new teams
* `team:update` — Update team details
* `team:delete` — Remove teams

By default, owners and admins can manage teams; regular members cannot.

---

## 4. Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable the teams feature. |
| `maximumTeams` | `number` \| `async ({ organizationId, session }, ctx) => number` | `Infinity` | Max teams per organization. |
| `maximumMembersPerTeam` | `number` \| `async ({ teamId, session, organizationId }, ctx) => number` | `Infinity` | Max members per team. |
| `allowRemovingAllTeams` | `boolean` | `true` | Whether the last team can be removed. |

---

## 5. Inviting to a Team

When sending an invitation, include `teamId`:

```ts
await authClient.organization.inviteMember({
  email: "user@example.com",
  role: "member",
  teamId: "team-id",
});
```

The invited member joins the specified team upon accepting.

---

## 6. Schema

When teams are enabled, the following tables are added:

### `team`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (PK) | Unique identifier |
| `name` | `string` | Team name |
| `organizationId` | `string` (FK) | Parent organization |
| `createdAt` | `Date` | Creation timestamp |
| `updatedAt` | `Date` (optional) | Last update timestamp |

### `teamMember`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (PK) | Unique identifier |
| `teamId` | `string` (FK) | References `team.id` |
| `userId` | `string` (FK) | References `user.id` |
| `createdAt` | `Date` (optional) | Creation timestamp |

### `invitation` additions

| Field | Type | Description |
|-------|------|-------------|
| `teamId` | `string` (optional) | Target team for the invitation |
