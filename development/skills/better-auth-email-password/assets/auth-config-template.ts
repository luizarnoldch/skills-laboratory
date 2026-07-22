// auth.ts — Better Auth Email & Password Starter Config
// Copy this template and replace [placeholder] values with your project settings.

import { betterAuth } from "better-auth";
// import { sendEmail } from "./email"; // [placeholder] your email sending function

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    // disableSignUp: false,       // [optional] block new registrations
    // minPasswordLength: 8,       // [optional] default: 8
    // maxPasswordLength: 128,     // [optional] default: 128
    // autoSignIn: true,           // [optional] default: true
    // requireEmailVerification: false, // [optional] default: false
    // revokeSessionsOnPasswordReset: false, // [optional] default: false
    // resetPasswordTokenExpiresIn: 3600, // [optional] default: 3600 (1 hour)

    // sendResetPassword: async ({ user, url, token }, request) => {
    //   void sendEmail({ ... });
    // },

    // onPasswordReset: async ({ user }, request) => {
    //   // post-reset logic
    // },

    // onExistingUserSignUp: async ({ user }, request) => {
    //   void sendEmail({ ... });
    // },

    // password: {
    //   hash: hashPassword,
    //   verify: verifyPassword,
    // },
  },

  emailVerification: {
    // sendOnSignUp: true, // [optional] auto-send at signup
    // sendOnSignIn: false,// [optional] send when sign-in without verify
    // expiresIn: 3600,    // [optional] default: 3600 (1 hour)
    // autoSignInAfterVerification: false, // [optional] skip login after verify

    // sendVerificationEmail: async ({ user, url, token }, request) => {
    //   void sendEmail({ ... });
    // },

    // beforeEmailVerification: async (user, request) => {
    //   // pre-verify logic
    // },

    // afterEmailVerification: async (user, request) => {
    //   // post-verify logic
    // },
  },
});
