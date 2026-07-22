# Email Enumeration Protection — Deep Dive

How better-auth prevents email enumeration and how to configure it with plugins.

---

## When Protection Is Active

| Configuration | Protection | New Sign-Up Response |
|---------------|------------|----------------------|
| `requireEmailVerification: true` | Active | 200 success (no session) |
| `autoSignIn: false` | Active | 200 success (no session) |
| Default (both false) | Inactive | 422 error for existing email |

> This follows [OWASP authentication best practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages).

---

## Custom Synthetic User — Full Guide

When plugins add fields to the user table (e.g., admin, two-factor, phone-number), the fake sign-up response must include those fields to be indistinguishable from a real response.

### Building Blocks

The `customSyntheticUser` callback receives:

- **`coreFields`** — Always present: `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`
- **`additionalFields`** — Your `user.additionalFields` with defaults applied
- **`id`** — A generated user ID matching your configured ID strategy

### Assembly Order

Match your database schema exactly:

```
core fields → plugin fields → additional fields → id
```

### Admin Plugin Example

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
      ...coreFields,
      // Admin plugin fields (in schema order)
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
      // Your additional fields
      ...additionalFields,
      // ID must be last to match database output order
      id,
    }),
  },
  plugins: [admin()],
});
```

> Each plugin documents its fields. See the admin plugin docs for the exact field list and required order.

---

## Additional Fields Support

Both `signUp.email` and `signIn.email` endpoints support additional properties when the `user.additionalFields` config or installed plugins extend the schema. Pass extra fields in the client call and they will be included in the request.
