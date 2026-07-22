---
name: better-auth-email-password
description: >
  Implement email and password authentication with Better Auth for web apps.
  Use when the user wants to set up sign-up, sign-in, email verification,
  password reset, or change-password flows with better-auth. Triggers on:
  "email auth", "password login", "better auth email", "verify email",
  "forgot password", "reset password", "custom password hashing", or when
  configuring the emailAndPassword authenticator in a better-auth project.
compatibility: Requires Node.js, better-auth, and a backend framework that supports cookie-based sessions (Express, Next.js, SvelteKit, etc.).
metadata:
  publisher: better-auth-team
---
# Better Auth — Email & Password Authentication

This skill provides step-by-step instructions to configure and use the built-in email/password authenticator in better-auth. It covers setup, sign-up/in/out, email verification, password reset/update, custom hashing, and all `emailAndPassword` configuration options.

> This skill is self-contained. Detailed guides and templates are available in `references/` and `assets/`.

---

## 0. Quick Start

1. Enable email/password: `emailAndPassword: { enabled: true }`
2. Configure `emailVerification.sendVerificationEmail`
3. Add `sendResetPassword` for password reset flows
4. Run `npx @better-auth/cli@latest migrate`
5. Verify: attempt sign-up and confirm verification email triggers

---

## 1. Enable Email & Password

Set `emailAndPassword.enabled: true` in the auth config.

```ts title="auth.ts"
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
});
```

> If not enabled, sign-up and sign-in with email/password will not work.
> For server actions that return cookies (e.g., `signUpEmail`), a plugin for [Next](https://www.better-auth.com/docs/integrations/next) or [SvelteKit](https://www.better-auth.com/docs/integrations/svelte-kit) may be required.

---

## 2. Client API Usage

All sign-up, sign-in, sign-out, password-reset, and change-password examples are in ``references/api-reference.md`` (covers both the client SDK `authClient` and the raw server API `auth.api`).

Short summary below:

| Action | Client Method | API Method |
|--------|---------------|------------|
| Sign Up | `authClient.signUp.email(...)` | `auth.api.signUpEmail(...)` |
| Sign In | `authClient.signIn.email(...)` | `auth.api.signInEmail(...)` |
| Sign Out | `authClient.signOut()` | `auth.api.signOut({ headers })` |
| Request Reset | `authClient.requestPasswordReset(...)` | `auth.api.requestPasswordReset(...)` |
| Reset Password | `authClient.resetPassword(...)` | `auth.api.resetPassword(...)` |
| Change Password | `authClient.changePassword(...)` | `auth.api.changePassword({ body, headers })` |

> Default `minPasswordLength = 8`, `maxPasswordLength = 128`.

### Client-Side Validation

Implement client-side validation for immediate user feedback and reduced server load.

### Absolute Callback URLs

Always use absolute URLs (including the origin) for callback URLs in sign-up and sign-in requests. This prevents Better Auth from needing to infer the origin, which can cause issues when your backend and frontend are on different domains.

```ts
const { data, error } = await authClient.signUp.email({
  callbackURL: "https://example.com/callback", // absolute URL with origin
});
```

---

## 3. Email Verification

### Server Configuration

Provide a `sendVerificationEmail` function.

```ts title="auth.ts"
export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
});
```

> Do **not** `await` the email send inside the callback to prevent timing attacks. On serverless, use `waitUntil` or similar.

### Require Email Verification

```ts
export const auth = betterAuth({
  emailAndPassword: {
    requireEmailVerification: true,
  },
});
```

> With this enabled, signing up with an existing email returns **success** (not 422) to prevent user enumeration. On each sign-in attempt without verified email, `sendVerificationEmail` is triggered.

### Client-Side Trigger

```ts
await authClient.sendVerificationEmail({
  email: "user@email.com",
  callbackURL: "/",
});
```

- Valid token → redirected to `callbackURL`.
- Invalid token → redirected to `callbackURL?error=invalid_token`.

---

## 4. Password Reset

### Server Configuration

```ts title="auth.ts"
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      // Post-reset logic
      console.log(`Password reset for ${user.email}`);
    },
  },
});
```

> Same anti-timing-attack rule as email verification—do not `await` send.

### Client Flow

1. Request reset:
   ```ts
   await authClient.requestPasswordReset({
     email: "john.doe@example.com",
     redirectTo: "https://example.com/reset-password",
   });
   ```

2. User clicks link → lands on `redirectTo`.

3. Read token from query string:
   ```ts
   const token = new URLSearchParams(window.location.search).get("token");
   ```

4. Reset:
   ```ts
   const { data, error } = await authClient.resetPassword({
     newPassword: "newPassword1234",
     token,
   });
   ```

### Revoke Sessions on Reset

By default sessions are **not** revoked. Opt in:

```ts
emailAndPassword: {
  revokeSessionsOnPasswordReset: true,
}
```

### Background Tasks on Serverless

Same anti-timing-attack rule as email verification—do not await send. On serverless platforms, configure a background task handler:

```ts
export const auth = betterAuth({
  advanced: {
    backgroundTasks: {
      handler: (promise) => {
        waitUntil(promise);
      },
    },
  },
});
```

### Token Security

Reset tokens expire after 1 hour by default (configure with `resetPasswordTokenExpiresIn`). Tokens are single-use — deleted immediately after successful reset.

---

## 5. Update Password

```ts
await authClient.changePassword({
  newPassword: "newpassword1234",
  currentPassword: "oldpassword1234",
  revokeOtherSessions?: true,
});
```

> Passwords are stored in the `account` table with `providerId: "credential"`, not in the `user` table.

---

## 6. Custom Password Hashing

Default algorithm is `scrypt` (OWASP-recommended; natively supported by Node.js). To override with Argon2 (or similar):

> **Warning**: If you switch hashing algorithms on an existing system, users with passwords hashed using the old algorithm won't be able to sign in. Plan a migration strategy if needed.

1. Create a hashing module:

```ts title="password.ts"
import { hash, type Options, verify } from "@node-rs/argon2";

const opts: Options = {
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
  outputLen: 32,
  algorithm: 2, // Argon2id
};

export async function hashPassword(password: string) {
  return hash(password, opts);
}

export async function verifyPassword(data: { password: string; hash: string }) {
  return verify(data.hash, data.password, opts);
}
```

2. Wire into auth config:

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { hashPassword, verifyPassword } from "./password";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
});
```

---

## 7. Configuration Reference

All `emailAndPassword` options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable email/password authentication. |
| `disableSignUp` | boolean | false | Disallow new sign-ups. |
| `minPasswordLength` | number | 8 | Minimum password length. |
| `maxPasswordLength` | number | 128 | Maximum password length. |
| `autoSignIn` | boolean | true | Sign in user immediately after sign-up. |
| `requireEmailVerification` | boolean | false | Block sign-in until email is verified. |
| `revokeSessionsOnPasswordReset` | boolean | false | Revoke all sessions after password reset. |
| `resetPasswordTokenExpiresIn` | number | 3600 | Token lifetime in seconds. |
| `sendResetPassword` | function | — | Send password-reset email. Receives `{ user, url, token }` and `request`. |
| `onPasswordReset` | function | — | Callback executed after successful reset. |
| `onExistingUserSignUp` | function | — | Callback when someone signs up with an already-registered email (only when enumeration protection is active). |
| `customSyntheticUser` | function | — | Build a full synthetic user object for email-enumeration protection when plugins add fields to the user table. |
| `password.hash` | function | — | Custom hashing function (`password: string → Promise<string>`). |
| `password.verify` | function | — | Custom verify function (`{ password, hash } → Promise<boolean>`). |

---

## 8. Email Enumeration Protection

| Condition | Protection Active | New Sign-Up With Existing Email |
|-----------|-------------------|--------------------------------|
| `requireEmailVerification: true` | Yes | Returns success (200), no session. |
| `autoSignIn: false` | Yes | Returns success (200), no session. |
| Default (`requireEmailVerification: false` + `autoSignIn: true`) | No | Returns 422 error. |

> `/change-email` always returns success regardless of target email registration status.

### Custom Synthetic User

When plugins add fields (e.g., admin role, two-factor), use `customSyntheticUser` so the fake response matches the real schema.

> Read `references/email-enumeration-protection.md` for a full guide on schema ordering, building blocks (`coreFields`, `additionalFields`, `id`), and plugin-specific examples.

---

## 9. Gotchas

- **Timing attacks**: Never await `sendVerificationEmail` or `sendResetPassword`. Return early and handle sending asynchronously.
- **Cookie propagation**: Server actions that call `signUpEmail` must return cookies to the client framework. Install the appropriate framework plugin if cookies are lost.
- **Password storage**: Passwords live in the `account` table (`providerId: "credential"`), not the `user` table.

---

## 10. References

Load reference files conditionally based on user needs:

- **`references/best-practices.md`** — Quick start checklist, client-side validation, callback URL rules, token security, and migration warnings. Load when user asks for recommended setup or security hardening.
- **`references/error-handling.md`** — Full `onError` examples for unverified email sign-in, `onExistingUserSignUp` callback with email template. Load when user asks about error handling, unverified users, or edge cases.
- **`references/email-enumeration-protection.md`** — Deep dive into `customSyntheticUser`, schema ordering rules, and plugin-specific examples. Load when user adds plugins that modify the user table or asks about enumeration protection in detail.
- **`references/email-verification.md`** — Advanced email verification: `sendOnSignUp`, `sendOnSignIn`, `autoSignInAfterVerification`, `beforeEmailVerification`, `afterEmailVerification`, and manual token verification. Load when user asks about email verification flow, SSO behavior, or verification callbacks.

---

## Progressive Disclosure

| Tier | Content | When |
|------|---------|------|
| 1 — Catalog | Name + description | Session start |
| 2 — Instructions | Full SKILL.md body | On activation |
| 3 — Resources | `scripts/`, `references/`, `assets/` | On demand |
