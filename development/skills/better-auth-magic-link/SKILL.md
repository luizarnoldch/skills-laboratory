---
name: better-auth-magic-link
description: >
  Implement passwordless magic link authentication with Better Auth.
  Use when the user wants to set up email link login, magic link sign-in,
  or passwordless authentication with better-auth. Triggers on:
  "magic link", "email link auth", "passwordless login", "better auth magic link",
  "send magic link", or when configuring the magicLink plugin.
compatibility: Requires Node.js, better-auth, and a backend framework that supports cookie-based sessions (Express, Next.js, SvelteKit, etc.).
metadata:
  publisher: better-auth-team
---
# Better Auth — Magic Link Authentication

This skill provides step-by-step instructions to configure and use the magic link (passwordless) plugin in better-auth. It covers server/client setup, sign-in flow, verification, and all `magicLink` configuration options.

---

## 1. Enable Magic Link

### Server Plugin

Add `magicLink` to the `plugins` array and provide a `sendMagicLink` callback.

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, token, url, metadata }, ctx) => {
                // send email to user with `url`
            }
        })
    ]
});
```

### Client Plugin

Add `magicLinkClient` to the client plugins.

```ts title="auth-client.ts"
import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins: [
        magicLinkClient()
    ]
});
```

---

## 2. Sign In with Magic Link

Call `signIn.magicLink` with the user's email. The `sendMagicLink` function is invoked automatically.

```ts
await authClient.signIn.magicLink({
    email: "user@email.com",
    name: "User Name",              // used only on first-time sign-up
    callbackURL: "/dashboard",
    newUserCallbackURL: "/welcome",
    errorCallbackURL: "/error",
    metadata: { inviteId: "123" },  // forwarded to sendMagicLink
});
```

> If the user has not signed up (and `disableSignUp` is not `true`), they are registered automatically.

---

## 3. Verify Magic Link

Clicking the generated URL authenticates the user and redirects to `callbackURL`.

If an error occurs, the user is redirected to `callbackURL` with an `error` query parameter (unless `errorCallbackURL` is set).

> If no `callbackURL` is provided, the user is redirected to the root URL.

### Manual Verification

To handle verification manually (e.g., custom URL), use the `verify` endpoint:

```ts
await authClient.magicLink.verify({
    token: "123456",
    callbackURL: "/dashboard", // optional; if omitted returns session
});
```

---

## 4. Server API Usage

Both client methods have server-side equivalents via `auth.api`.

### Sign In Magic Link

```ts
const data = await auth.api.signInMagicLink({
    body: {
        email: "user@email.com", // required
        name: "my-name",
        callbackURL: "/dashboard",
        newUserCallbackURL: "/welcome",
        errorCallbackURL: "/error",
        metadata: { inviteId: "123" },
    },
    headers: await headers(), // session cookies required
});
```

### Verify Magic Link

```ts
const data = await auth.api.magicLinkVerify({
    query: {
        token: "123456", // required
        callbackURL: "/dashboard",
    },
    headers: await headers(), // session cookies required
});
```

> Server endpoints require session cookies. Pass `headers` from framework helpers.

---

## 5. Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sendMagicLink` | function | **required** | Called on magic link request. Receives `{ email, token, url, metadata }` and `ctx`. |
| `expiresIn` | number | `300` (5 min) | Token lifetime in seconds. |
| `allowedAttempts` | number | `1` | Max verification attempts. Exceeding deletes token and redirects with `?error=ATTEMPTS_EXCEEDED`. Set to `Infinity` for unlimited. |
| `disableSignUp` | boolean | `false` | Prevent new user registration via magic link. |
| `generateToken` | function | random string | Custom token generator. Receives `email`. Must return cryptographically secure string. |
| `storeToken` | string / object | `"plain"` | Storage transform: `"plain"`, `"hashed"`, or `{ type: "custom-hasher", hash: (token) => Promise<string> }`. |

The storage backend is controlled by the global [`verification`](https://www.better-auth.com/docs/reference/options#verification) config. If `secondaryStorage` is configured, magic link records can be stored there instead of the database.

---

## 6. Gotchas

- **Default redirect**: Omitting `callbackURL` redirects to `/` on success and on error.
- **Allowed attempts**: Default is `1`. Exceeding redirects with `?error=ATTEMPTS_EXCEEDED`.
- **Token security**: If overriding `generateToken`, ensure the output is unguessable. Default is a long cryptographically secure string.
- **Auto sign-up**: Enabled by default. Set `disableSignUp: true` to restrict to existing users only.
- **Email sending**: `sendMagicLink` receives a pre-built `url` containing the token. You may also use the raw `token` to build a custom URL.
