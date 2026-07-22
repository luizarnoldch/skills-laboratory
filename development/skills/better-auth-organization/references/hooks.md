# Organization Hooks Reference

Full index of `organizationHooks` for customizing organization, member, invitation, and team lifecycle.

---

## Organization Lifecycle

```ts
organizationHooks: {
  // Creation
  beforeCreateOrganization: async ({ organization, user }) => {
    return { data: { ...organization, metadata: { customField: "value" } } };
  },
  afterCreateOrganization: async ({ organization, member, user }) => {
    await setupDefaultResources(organization.id);
  },

  // Update
  beforeUpdateOrganization: async ({ organization, user, member }) => {
    return { data: { ...organization, name: organization.name?.toLowerCase() } };
  },
  afterUpdateOrganization: async ({ organization, user, member }) => {
    await syncToExternalSystems(organization);
  },

  // Deletion
  beforeDeleteOrganization: async (data, request) => { /* validate */ },
  afterDeleteOrganization: async (data, request) => { /* cleanup */ },
}
```

> Legacy `organizationCreation` hooks are deprecated. Use `beforeCreateOrganization` / `afterCreateOrganization` instead.

---

## Member Lifecycle

```ts
organizationHooks: {
  beforeAddMember: async ({ member, user, organization }) => {
    // Optional: modify member data before insert
    return { data: { ...member, role: "custom-role" } };
  },
  afterAddMember: async ({ member, user, organization }) => {
    await sendWelcomeEmail(user.email, organization.name);
  },

  beforeRemoveMember: async ({ member, user, organization }) => {
    await cleanupUserResources(user.id, organization.id);
  },
  afterRemoveMember: async ({ member, user, organization }) => {
    await logMemberRemoval(user.id, organization.id);
  },

  beforeUpdateMemberRole: async ({ member, newRole, user, organization }) => {
    if (newRole === "owner" && !hasOwnerUpgradePermission(user)) {
      throw new Error("Cannot upgrade to owner");
    }
    return { data: { role: newRole } };
  },
  afterUpdateMemberRole: async ({ member, previousRole, user, organization }) => {
    await logRoleChange(user.id, previousRole, member.role);
  },
}
```

---

## Invitation Lifecycle

```ts
organizationHooks: {
  beforeCreateInvitation: async ({ invitation, inviter, organization }) => {
    return {
      data: {
        ...invitation,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    };
  },
  afterCreateInvitation: async ({ invitation, inviter, organization }) => {
    await sendCustomInvitationEmail(invitation, organization);
  },

  beforeAcceptInvitation: async ({ invitation, user, organization }) => {
    await validateUserEligibility(user, organization);
  },
  afterAcceptInvitation: async ({ invitation, member, user, organization }) => {
    await setupNewMemberResources(user, organization);
  },

  beforeRejectInvitation: async ({ invitation, user, organization }) => { },
  afterRejectInvitation: async ({ invitation, user, organization }) => {
    await notifyInviterOfRejection(invitation.inviterId, user.email);
  },

  beforeCancelInvitation: async ({ invitation, cancelledBy, organization }) => { },
  afterCancelInvitation: async ({ invitation, cancelledBy, organization }) => {
    await logInvitationCancellation(invitation.id, cancelledBy.id);
  },
}
```

---

## Team Lifecycle (requires `teams: { enabled: true }`)

```ts
organizationHooks: {
  beforeCreateTeam: async ({ team, user, organization }) => {
    return {
      data: {
        ...team,
        name: team.name.toLowerCase().replace(/\s+/g, "-"),
      },
    };
  },
  afterCreateTeam: async ({ team, user, organization }) => {
    await createDefaultTeamResources(team.id);
  },

  beforeUpdateTeam: async ({ team, updates, user, organization }) => {
    return { data: { ...updates, name: updates.name?.toLowerCase() } };
  },
  afterUpdateTeam: async ({ team, user, organization }) => {
    await syncTeamChangesToExternalSystems(team);
  },

  beforeDeleteTeam: async ({ team, user, organization }) => {
    await backupTeamData(team.id);
  },
  afterDeleteTeam: async ({ team, user, organization }) => {
    await cleanupTeamResources(team.id);
  },

  beforeAddTeamMember: async ({ teamMember, team, user, organization }) => {
    const count = await getTeamMemberCount(team.id);
    if (count >= 10) throw new Error("Team is full");
  },
  afterAddTeamMember: async ({ teamMember, team, user, organization }) => {
    await grantTeamAccess(user.id, team.id);
  },

  beforeRemoveTeamMember: async ({ teamMember, team, user, organization }) => {
    await backupTeamMemberData(user.id, team.id);
  },
  afterRemoveTeamMember: async ({ teamMember, team, user, organization }) => {
    await revokeTeamAccess(user.id, team.id);
  },
}
```

---

## Error Handling

Throwing in a `before*` hook aborts the operation:

```ts
import { APIError } from "better-auth/api";

beforeAddMember: async ({ member, user, organization }) => {
  const violations = await checkUserViolations(user.id);
  if (violations.length > 0) {
    throw new APIError("BAD_REQUEST", {
      message: "User has pending violations and cannot join organizations",
    });
  }
}
```

Return `{ data: { ... } }` from `before*` hooks to modify the payload before it reaches the database.
