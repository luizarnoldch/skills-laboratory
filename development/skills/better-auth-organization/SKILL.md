---
name: better-auth-organization
description: >
  Configure and use the Organization plugin for Better Auth to manage
  organizations, members, teams, invitations, roles, and access control.
  Use when the user asks about "organization", "org", "team", "member",
  "invitation", "role", "access control", "permissions", or when integrating
  multi-tenant workspace features into a better-auth project.
license: MIT
compatibility: Requires Node.js, better-auth, and a backend framework that supports cookie-based sessions.
metadata:
  publisher: better-auth-team
---
@
# Better Auth — Organization Plugin

Manage multi-tenant workspaces: organizations, members, invitations, roles, teams, and access control.

---

## 1. Installation

### Server Plugin

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [organization()],
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
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [organizationClient()],
});
```

> Load `references/best-practices.md` for a complete configuration example, security considerations, and lifecycle hooks.

---

## 2. Organization Management

> Load `references/api-organization.md` for side-by-side client/server signatures.

### Create

```ts
await authClient.organization.create({
  name: "My Org",
  slug: "my-org",
  logo?: "https://example.com/logo.png",
  metadata?: { key: "value" },
  keepCurrentActiveOrganization?: false,
});
```

- `userId` is **server-only** (ignored if session headers present).
- Restrict creation: `allowUserToCreateOrganization: async (user) => boolean`
- Check slug availability:
  ```ts
  // Client
  await authClient.organization.checkSlug({ slug: "my-org" });
  // Server
  await auth.api.checkOrganizationSlug({ body: { slug: "my-org" } });
  ```

### Read / Update / Delete

```ts
// List user's organizations
const { data: orgs } = authClient.useListOrganizations(); // hook
// or
await authClient.organization.list();

// Full details (defaults to active org)
await authClient.organization.getFullOrganization({
  organizationId?: "org-id",
  organizationSlug?: "org-slug",
  membersLimit?: 100,
});

// Update
await authClient.organization.update({
  data: { name?: "New", slug?: "new", logo?: "url", metadata?: {} },
  organizationId?: "org-id",
});

// Delete (owner only)
await authClient.organization.delete({ organizationId: "org-id" });
```

- Disable deletion entirely: `disableOrganizationDeletion: true`
- Hooks: `beforeDeleteOrganization`, `afterDeleteOrganization`
> For the full hooks reference, load `references/hooks.md`.

### Active Organization

Default is `null`. Set via:

```ts
await authClient.organization.setActive({
  organizationId?: "org-id" | null,
  organizationSlug?: "org-slug",
});
```

Retrieve:

```ts
const { data: activeOrg } = authClient.useActiveOrganization();
```

Auto-set on session creation via database hooks (`session.create.before`).

---

## 3. Members

> Load `references/api-members.md` for side-by-side client/server signatures.

### List

```ts
await authClient.organization.listMembers({
  organizationId?: "org-id",
  limit?: 100,
  offset?: 0,
  sortBy?: "createdAt",
  sortDirection?: "asc" | "desc",
  filterField?: "createdAt",
  filterOperator?: "eq" | "ne" | ... | "starts_with",
  filterValue?: string | number | boolean | string[] | number[],
});
```

### Update Role

```ts
await authClient.organization.updateMemberRole({
  memberId: "member-id",
  role: "admin", // string | string[]
  organizationId?: "org-id",
});
```

### Remove / Leave

```ts
await authClient.organization.removeMember({
  memberIdOrEmail: "user@example.com",
  organizationId?: "org-id",
});

await authClient.organization.leave({ organizationId: "org-id" });
```

### Add Member (server-only)

```ts
await auth.api.addMember({
  body: {
    userId?: "user-id" | null,
    role: "admin",
    organizationId?: "org-id",
    teamId?: "team-id",
  },
});
```

### Get Current Member

```ts
// Client
await authClient.organization.getActiveMember();
await authClient.organization.getActiveMemberRole();

// Server
await auth.api.getActiveMember({ headers: await headers() });
await auth.api.getActiveMemberRole({ headers: await headers() });
```

---

## 4. Invitations

> Load `references/api-invitations.md` for side-by-side client/server signatures.

### Setup Invitation Email

Required. Provide `sendInvitationEmail` in the plugin config.

```ts
organization({
  async sendInvitationEmail(data) {
    const inviteLink = `https://example.com/accept-invitation/${data.id}`;
    await sendEmail({
      to: data.email,
      subject: "Invitation",
      text: `Join ${data.organization.name}: ${inviteLink}`,
    });
  },
});
```

> Do not `await` the email send inside the callback to prevent timing attacks.

### Send

```ts
await authClient.organization.inviteMember({
  email: "user@example.com",
  role: "member", // string | string[]
  organizationId?: "org-id",
  resend?: true,
  teamId?: "team-id",
});
```

- If user is already a member, invitation is canceled.
- If already invited and `resend: false`, no new email is sent.
- `cancelPendingInvitationsOnReInvite: true` cancels pending invites before re-inviting.

### Accept / Cancel / Reject / Get

```ts
await authClient.organization.acceptInvitation({ invitationId: "id" });
await authClient.organization.cancelInvitation({ invitationId: "id" });
await authClient.organization.rejectInvitation({ invitationId: "id" });

await authClient.organization.getInvitation({ id: "invitation-id" });
```

- Accept requires user to be logged in.
- `requireEmailVerificationOnInvitation: true` enforces verified email before accept/reject.

### List

```ts
await authClient.organization.listInvitations({ organizationId?: "org-id" });
await authClient.organization.listUserInvitations();
```

Server-side by email:

```ts
await auth.api.listUserInvitations({ query: { email: "user@example.com" } });
```

---

## 5. Access Control (Static)

> Load `references/access-control.md` for full custom roles, permissions, `hasPermission`, and `checkRolePermission` flows.
> If the user asks about runtime-created roles, also load `references/dynamic-access-control.md` and `references/api-dynamic-roles.md`.

Default roles: `owner`, `admin`, `member`.

Default resources/actions:

| Resource | Actions |
|----------|---------|
| `organization` | `update`, `delete` |
| `member` | `create`, `update`, `delete` |
| `invitation` | `create`, `cancel` |

Owner = full control. Admin = everything except delete org / change owner. Member = read-only.

### Custom Permissions

1. Create access control in `permissions.ts`:

```ts
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  project: ["create", "share", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({ project: ["create"] });
const admin  = ac.newRole({ project: ["create", "update"] });
const owner  = ac.newRole({ project: ["create", "update", "delete"] });
```

> Import `createAccessControl` from `better-auth/plugins/access` (not `better-auth/plugins`) to keep bundle small.

2. Merge defaults when overriding built-in roles:

```ts
import { defaultStatements, adminAc } from "better-auth/plugins/organization/access";

const statement = { ...defaultStatements, project: ["create", "share", "update", "delete"] } as const;
const ac = createAccessControl(statement);

const admin = ac.newRole({ project: ["create", "update"], ...adminAc.statements });
```

3. Pass to **both** server and client plugins:

```ts
// auth.ts
plugins: [organization({ ac, roles: { owner, admin, member } })]

// auth-client.ts
plugins: [organizationClient({ ac, roles: { owner, admin, member } })]
```

### Check Permissions

Server:

```ts
await auth.api.hasPermission({
  headers: await headers(),
  body: { permissions: { project: ["create"] } },
});
```

Client:

```ts
const canCreate = await authClient.organization.hasPermission({
  permissions: { project: ["create"] },
});
```

Synchronous client-side role check (no dynamic roles):

```ts
authClient.organization.checkRolePermission({
  permissions: { organization: ["delete"] },
  role: "admin",
});
```

---

## 6. Schema

Added tables/fields:

| Table | Key Fields |
|-------|-----------|
| `organization` | `id`, `name`, `slug` (unique), `logo`, `metadata`, `createdAt` |
| `member` | `id`, `userId`, `organizationId`, `role`, `createdAt` |
| `invitation` | `id`, `email`, `inviterId`, `organizationId`, `role`, `status`, `createdAt`, `expiresAt` |
| `session` *adds* | `activeOrganizationId`, `activeTeamId` |
| `organizationRole` *(if dynamic AC enabled)* | `id`, `organizationId`, `role`, `permission`, `createdAt`, `updatedAt` |
| `team` *(if teams enabled)* | `id`, `name`, `organizationId` (FK), `createdAt`, `updatedAt` |
| `teamMember` *(if teams enabled)* | `id`, `teamId` (FK), `userId` (FK), `createdAt` |

> If customizing dynamic roles or teams schema, load `references/dynamic-access-control.md` or `references/teams.md` respectively.

Customize via `schema` option:

```ts
organization({
  schema: {
    organization: {
      modelName: "organizations",
      fields: { name: "title" },
      additionalFields: {
        customField: { type: "string", input: true, required: false },
      },
    },
  },
});
```

Infer additional fields on client:

```ts
import { inferOrgAdditionalFields } from "better-auth/client/plugins";

organizationClient({ schema: inferOrgAdditionalFields<typeof auth>() })
```

Or pass values directly without importing the auth type:

```ts
organizationClient({
  schema: inferOrgAdditionalFields({
    organization: {
      additionalFields: {
        newField: { type: "string" },
      },
    },
  }),
});
```

---

## 7. Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowUserToCreateOrganization` | `boolean` \| `((user) => boolean)` | `true` |Restrict org creation. |
| `organizationLimit` | `number` \| `((user) => boolean)` | `unlimited` | Max orgs per user. Function returns `true` if limit reached. |
| `creatorRole` | `"admin"` \| `"owner"` | `"owner"` | Role of the creator. |
| `membershipLimit` | `number` \| `((user, org) => number)` | `100` | Max members per org. |
| `sendInvitationEmail` | `async (data) => void` | — | Invitation email sender. |
| `invitationExpiresIn` | `number` | `172800` (48h) | Invitation link TTL in seconds. |
| `cancelPendingInvitationsOnReInvite` | `boolean` | `false` | Cancel pending invites on re-invite. |
| `invitationLimit` | `number` \| `((user) => boolean)` | `100` | Max invitations per user. |
| `requireEmailVerificationOnInvitation` | `boolean` | `false` | Require verified email to accept/reject. |
| `disableOrganizationDeletion` | `boolean` | `false` | Prevent org deletion. |
| `teams.enabled` | `boolean` | `false` | Enable the teams feature. |
| `teams.maximumTeams` | `number` \| `async (args) => number` | `Infinity` | Max teams per org. |
| `teams.maximumMembersPerTeam` | `number` \| `async (args) => number` | `Infinity` | Max members per team. |
| `teams.allowRemovingAllTeams` | `boolean` | `true` | Whether the last team can be removed. |

> For teams details, load `references/teams.md` and `references/api-teams.md`.

---

## 8. Gotchas

- `userId` in `createOrganization` is **server-only** and silently ignored when session headers are present.
- Multiple roles per user are stored as comma-separated string in the `role` column.
- `checkRolePermission` runs **synchronously on the client** — it does NOT include dynamic roles. Use `hasPermission` for dynamic checks.
- When overriding built-in roles with custom permissions, **predefined permissions are lost unless you merge `defaultStatements` and `adminAc.statements`**.
- Do **not** `await` `sendInvitationEmail` inside the callback — return early to prevent timing attacks.
- Passwords are stored in the `account` table (`providerId: "credential"`), not the `user` table.
- `addMember` is **server-only**. On the client, use `inviteMember` + invitation flow.

- `addMember` is **server-only**. On the client, use `inviteMember` + invitation flow.
