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
