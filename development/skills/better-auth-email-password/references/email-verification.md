# Email Verification — Advanced Guide

Advanced email verification flows, triggers, callbacks, and manual verification with better-auth.

> Reference for `better-auth-email-password` skill. Load when user asks about email verification setup, SSO behavior, or verification callbacks.

---

## 1. Triggering Email Verification

### A. Automatically at Sign-Up (`sendOnSignUp`)

Send a verification email immediately when a user signs up with email/password:

```ts title="auth.ts"
export const auth = betterAuth({
  emailVerification: {
    sendOnSignUp: true,
  },
});
```

> **SSO behavior:** For social logins, email verification status comes from the identity provider. If the SSO does not claim the email as verified, Better Auth sends a verification email—but verification is **not required** to log in, even if `requireEmailVerification` is enabled.

---

### B. On Sign-In When Unverified (`sendOnSignIn`)

Trigger verification email when an unverified user tries to sign in. Only effective if `requireEmailVerification: true` and `sendVerificationEmail` is configured:

```ts title="auth.ts"
export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      void sendEmail({ ... });
    },
    sendOnSignIn: true,
  },
  emailAndPassword: {
    requireEmailVerification: true,
  },
});
```

> When `requireEmailVerification` is enabled without `sendOnSignIn`, the user simply gets a 403 error. With `sendOnSignIn`, the verification email is dispatched automatically.

---

### C. Manually Triggered

Send a verification link on demand from the client:

```ts
await authClient.sendVerificationEmail({
  email: "user@email.com",
  callbackURL: "/",
});
```

The user clicks the link → verified automatically → redirected to `callbackURL`.

- Valid token → `callbackURL`
- Invalid token → `callbackURL?error=invalid_token`

---

## 2. Manual Verification (Custom Flow)

If you use a custom URL instead of the default verification link, extract the token and call `verifyEmail`:

```ts
await authClient.verifyEmail({
  query: {
    token: "your-token-here",
  },
});
```

---

## 3. Auto Sign-In After Verification

Sign the user in automatically after they successfully verify their email:

```ts title="auth.ts"
export const auth = betterAuth({
  emailVerification: {
    autoSignInAfterVerification: true,
  },
});
```

> Useful when `requireEmailVerification: true` — user clicks link, email is verified, and they're immediately authenticated without re-entering credentials.

---

## 4. Verification Callbacks

### `beforeEmailVerification`

Run custom logic just before the user is marked as verified:

```ts title="auth.ts"
export const auth = betterAuth({
  emailVerification: {
    async beforeEmailVerification(user, request) {
      console.log(`About to verify ${user.email}`);
      // Pre-verification checks: track metrics, validate tokens, etc.
    },
  },
});
```

---

### `afterEmailVerification`

Run side effects immediately after successful verification:

```ts title="auth.ts"
export const auth = betterAuth({
  emailVerification: {
    async afterEmailVerification(user, request) {
      console.log(`${user.email} has been successfully verified!`);
      // Grant access to premium features, update CRM, trigger welcome email, etc.
    },
  },
});
```

> Both callbacks receive the full `user` object and the `request` object. Use `request` for IP logging, user-agent tracking, etc.
