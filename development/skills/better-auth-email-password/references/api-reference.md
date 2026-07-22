# API Reference — Email & Password Authentication

Full sign-up, sign-in, sign-out, password reset, and password change examples using both the client (`authClient`) and raw API (`auth.api`).

## Sign Up

### Client

```ts
const { data, error } = await authClient.signUp.email({
    name: "John Doe", // required
    email: "john.doe@example.com", // required
    password: "password1234", // required
    image: "https://example.com/image.png",
    callbackURL: "https://example.com/callback",
});
```

### API

```ts
const data = await auth.api.signUpEmail({
    body: {
        name: "John Doe", // required
        email: "john.doe@example.com", // required
        password: "password1234", // required
        image: "https://example.com/image.png",
        callbackURL: "https://example.com/callback",
    },
});
```

## Sign In

### Client

```ts
const { data, error } = await authClient.signIn.email({
    email: "john.doe@example.com", // required
    password: "password1234", // required
    rememberMe: true,
    callbackURL: "https://example.com/callback",
});
```

### API

```ts
const data = await auth.api.signInEmail({
    body: {
        email: "john.doe@example.com", // required
        password: "password1234", // required
        rememberMe: true,
        callbackURL: "https://example.com/callback",
    },
    // This endpoint requires session cookies.
    headers: await headers(),
});
```

## Sign Out

### Client

```ts
await authClient.signOut();
```

### API

```ts
await auth.api.signOut({
    // This endpoint requires session cookies.
    headers: await headers(),
});
```

## Request Password Reset

### Client

```ts
const { data, error } = await authClient.requestPasswordReset({
    email: "john.doe@example.com", // required
    redirectTo: "https://example.com/reset-password",
});
```

### API

```ts
const data = await auth.api.requestPasswordReset({
    body: {
        email: "john.doe@example.com", // required
        redirectTo: "https://example.com/reset-password",
    },
});
```

## Reset Password

Token is provided via query string after the user clicks the reset link (`redirectTo`).

### Client

```ts
const token = new URLSearchParams(window.location.search).get("token");

if (!token) {
  // Handle the error
}

const { data, error } = await authClient.resetPassword({
    newPassword: "password1234", // required
    token, // required
});
```

### API

```ts
const token = new URLSearchParams(window.location.search).get("token");

if (!token) {
  // Handle the error
}

const data = await auth.api.resetPassword({
    body: {
        newPassword: "password1234", // required
        token, // required
    },
});
```

## Change Password

### Client

```ts
const { data, error } = await authClient.changePassword({
    newPassword: "newpassword1234", // required
    currentPassword: "oldpassword1234", // required
    revokeOtherSessions: true,
});
```

### API

```ts
const data = await auth.api.changePassword({
    body: {
        newPassword: "newpassword1234", // required
        currentPassword: "oldpassword1234", // required
        revokeOtherSessions: true,
    },
    // This endpoint requires session cookies.
    headers: await headers(),
});
```
