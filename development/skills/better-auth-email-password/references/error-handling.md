# Error Handling & Edge Cases

Full examples for handling authentication errors with better-auth email/password.

---

## Unverified Email Sign-In Error

When `requireEmailVerification` is enabled, a user without verified email gets a 403 error on sign-in. Handle it on the client:

```ts
import { authClient } from "@/lib/auth-client"

await authClient.signIn.email(
  {
    email: "email@example.com",
    password: "password",
  },
  {
    onError: (ctx) => {
      if (ctx.error.status === 403) {
        alert("Please verify your email address");
      }
      // Also show the original error message
      alert(ctx.error.message);
    },
  }
);
```

> With `sendOnSignIn: true` in the `emailVerification` config, the verification email is dispatched automatically when this 403 occurs. Without it, the user only sees the error and must trigger verification manually.

---

## Existing User Sign-Up Notification

When `requireEmailVerification: true` or `autoSignIn: false`, signing up with an existing email returns success (enumeration protection). Use `onExistingUserSignUp` to notify the real owner:

```ts title="auth.ts"
import { betterAuth } from "better-auth";
import { sendEmail } from "./email"; // your email sending function

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }, request) => {
      void sendEmail({
        to: user.email,
        subject: "Sign-up attempt with your email",
        text: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",
      });
    },
  },
});
```

> This callback only fires when enumeration protection is active. With default settings (`requireEmailVerification: false`, `autoSignIn: true`), an existing email returns a 422 error instead.
