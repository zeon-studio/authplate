# Authentication (Better Auth)

This skill explains how authentication is implemented in this Authplate template using **Better Auth** with Prisma, email/password, social OAuth, and OTP email verification.

## Architecture Overview

Authentication is organized into a clean 3-file pattern plus an API route handler:

```text
src/lib/auth/
├── auth.ts                    # Server-side Better Auth instance (configuration hub)
├── auth-client.ts             # Client-side hooks and methods (React components)
├── auth-server.ts             # Server-side session helper (Server Components)
└── server-validation-schema.ts # Server-only Zod schemas for auth middleware
```

```text
src/app/api/auth/
└── [...all]/route.ts     # Catch-all API route exposing all Better Auth endpoints
```

---

## Server Configuration — `src/lib/auth/auth.ts`

This is the **central configuration hub** for Better Auth. It exports a single `auth` instance created with `betterAuth()`.

### Database Adapter
Uses `prismaAdapter` with PostgreSQL:
```ts
database: prismaAdapter(prisma, { provider: "postgresql" }),
```

### Session Configuration
```ts
session: {
  expiresIn: 60 * 60 * 24 * 7,   // 7 days
  updateAge: 60 * 60 * 24,        // Refresh every 1 day
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,               // 5-minute client-side cache
  },
},
```

### Rate Limiting
Configured via environment variables (`RATELIMIT_WINDOW`, `RATELIMIT_MAX`). Auto-enabled in production, disabled in development (v1.6+).

### User Model with Custom Fields
The `name` field is mapped to `firstName`. Additional fields:
- `firstName` (required, string)
- `lastName` (required, string)
- `isTermsAccepted` (boolean, default `true`)
- `provider` (string, default `"Credential"` — tracks auth method)
- `password` (string, for credential auth)

### Email & Password
```ts
emailAndPassword: {
  enabled: true,
  requireEmailVerification: true,
  autoSignIn: true,
  autoSignInAfterVerification: true,
  password: {
    hash: (password) => bcryptjs.hash(password, 10),
    verify: ({ password, hash }) => bcryptjs.compare(password, hash),
  },
},
```

### Social Providers
Two OAuth providers are configured out of the box:

**GitHub:**
```ts
github: {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  mapProfileToUser: (profile) => ({
    name: profile.name.split(" ")[0],
    lastName: profile.name.split(" ")[1],
    provider: "Github",
  }),
},
```

**Google:**
```ts
google: {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  accessType: "offline",
  prompt: "select_account consent",
  mapProfileToUser: (profile) => ({
    name: profile.given_name,
    firstName: profile.given_name,
    lastName: profile.family_name,
    provider: "Google",
  }),
},
```

### Plugins
- **`emailOTP`**: Sends 6-digit OTPs via email for verification. 15-minute expiry, 3 attempts max, hashed storage. Overrides default email verification.
- **`nextCookies()`**: Integrates with Next.js cookie handling.

Commented-out options available: `twoFactor()`, `customSession()`.

### Auth Middleware (Hooks)
Server-side validation runs before endpoints via `createAuthMiddleware`:
- `/sign-up/email` → Validates against `userSchema` (Zod)
- `/email-otp/verify-email` → Validates against `otpVerifySchema` (Zod)

### Database Hooks
`databaseHooks.user.create.before` and `databaseHooks.user.update.before` run before user creation/updates. Currently pass-through but can be extended for custom logic (e.g., creating a Stripe customer after signup).

---

## Client Setup — `src/lib/auth/auth-client.ts`

Creates the client-side auth interface using `createAuthClient()` from `better-auth/react`.

### Exported Methods & Hooks
```ts
export const {
  signIn,            // signIn.email(), signIn.social()
  signUp,            // signUp.email()
  useSession,        // React hook for session data
  signOut,           // Sign out the user
  getSession,        // Imperative session fetch
  sendVerificationEmail,
  emailOtp,          // emailOtp.sendVerificationOtp(), emailOtp.verifyEmail()
  forgetPassword,
  changePassword,
  updateUser,
  changeEmail,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  $Infer,            // Type inference helper
} = createAuthClient({ ... });
```

### Client Plugins
- `emailOTPClient()` — Client-side OTP methods
- `customSessionClient<typeof auth>()` — Infers custom session types from server config
- `inferAdditionalFields<typeof auth>()` — Infers additional user fields (firstName, lastName, etc.)

### Type Export
```ts
export type TSession = typeof $Infer.Session;
```

### Error Handling
Global `fetchOptions.onError` catches rate limit errors (HTTP 429) and shows a toast notification.

---

## Server Helper — `src/lib/auth/auth-server.ts`

Provides a helper function for accessing the session in **Server Components** and **Server Actions**:

```ts
import { headers } from "next/headers";
import { auth } from "./auth";

export const getServerAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};
```

**Usage in Server Components:**
```tsx
import { getServerAuth } from "@/lib/auth/auth-server";

export default async function MyPage() {
  const session = await getServerAuth();
  if (!session) {
    redirect("/signin");
  }
  // session.user.firstName, session.user.email, etc.
}
```

---

## API Route Handler — `src/app/api/auth/[...all]/route.ts`

A minimal catch-all route that exposes all Better Auth API endpoints:
```ts
import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

This single route handles all auth operations: sign-in, sign-up, OAuth callbacks, OTP verification, password reset, session management, etc.

---

## Auth Pages — `src/app/(auth)/`

The `(auth)` route group contains all public authentication pages with a shared centered card layout:

### Layout (`src/app/(auth)/layout.tsx`)
Wraps children in a centered container with `bg-light` card styling.

### Sign In (`src/app/(auth)/signin/page.tsx`)
- Client component (`"use client"`)
- Uses `LoginForm` component with `react-hook-form` + Zod validation
- Social login buttons (Google, GitHub) using `signIn.social()`
- OTP verification flow: if email not verified, switches to `<OtpVerifyForm />`
- Supports `?from=` search param for redirect-after-login

### Sign Up (`src/app/(auth)/signup/page.tsx`)
- Client component
- Uses `RegisterForm` component
- Same social login + OTP flow as signin
- Includes terms acceptance

### Forgot Password (`src/app/(auth)/forgot-password/page.tsx`)
- Client component
- Uses `ForgotPasswordForm` → triggers OTP → `<OtpVerifyForm />`

---

## Route Protection Patterns

### Pattern 1: Layout-Level Protection (Dashboard)
The `(dashboard)` layout automatically protects all child routes:
```tsx
// src/app/(dashboard)/layout.tsx
export default async function DashboardLayout({ children }) {
  const session = await getServerAuth();
  if (!session) {
    redirect("/sign-in");
  }
  return (/* sidebar + children */);
}
```

### Pattern 2: Page-Level Protection
For individual protected pages outside the dashboard:
```tsx
// src/app/(protected)/page.tsx
export default async function Page() {
  const session = await getServerAuth();
  if (!session) {
    return redirect("/signin");
  }
  // Protected content
}
```

---

## Database Schema (Prisma)

Better Auth requires these core models (defined in `prisma/schema.prisma`):

| Model | Purpose |
|-------|---------|
| `User` | User accounts with custom fields (firstName, lastName, isTermsAccepted, provider, customerId) |
| `Session` | Active login sessions with token, expiry, IP, user agent |
| `Account` | OAuth provider accounts (access/refresh tokens, provider IDs) |
| `Verification` | General verification records (used by Better Auth internally) |

Custom application models:

| Model | Purpose |
|-------|---------|
| `OtpVerification` | Stores OTP tokens with expiry, linked to users |
| `Subscription` | User subscriptions (Paddle/Stripe) with status, billing cycle, dates |
| `Payment` | Payment transaction records with amounts, fees, currency |

### After Schema Changes
```bash
pnpm db:migrate    # Create migration + apply
pnpm db:generate   # Regenerate Prisma client
```

---

## Validation Schemas — `src/lib/validation/`

All input validation uses **Zod v4** schemas:

### `user.schema.ts`
- `userSchema` — Full user with all fields
- `registerUserSchema` — Registration (includes confirmPassword, terms)
- `loginUserSchema` — Login (email + password only)
- `updateUserSchema` — Profile updates (no email/terms/provider)
- `forgotPasswordSchema` — Just email
- `resetPasswordSchema` — New password + confirmation
- `updatePasswordSchema` — Old + new + confirmation with mismatch checks
- `passwordSchema` — Password rules: 8+ chars, uppercase, lowercase, digit, special char

### `otp.schema.ts`
- `otpSchema` — 6-digit numeric string validation

---

## Email Sending — `src/app/actions/sender/`

Uses **Nodemailer** with Gmail SMTP. Available senders:
- `mailSender.otpSender(email, otp)` — OTP verification email
- `mailSender.teamInvitation(email)` — Team invite email
- `mailSender.notificationEmail(email, subject, message)` — General notification
- `mailSender.commentNotification(email, itemName, comment)` — Comment alert

Configured via `SENDER_EMAIL` and `EMAIL_PASSWORD` environment variables.

---

## Environment Variables

Required auth-related environment variables (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session signing |
| `BETTER_AUTH_URL` | Base URL of the application (e.g., `http://localhost:3000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth app credentials |
| `SENDER_EMAIL` / `EMAIL_PASSWORD` | Gmail SMTP credentials for OTP emails |
| `RATELIMIT_WINDOW` / `RATELIMIT_MAX` | Rate limiting config (default: 100 req/10s) |

---

## Common Recipes

### Adding a New Social Provider

1. Add credentials to `.env`:
   ```
   DISCORD_CLIENT_ID="..."
   DISCORD_CLIENT_SECRET="..."
   ```
2. Add provider in `src/lib/auth/auth.ts` → `socialProviders`:
   ```ts
   discord: {
     clientId: process.env.DISCORD_CLIENT_ID as string,
     clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
     mapProfileToUser: (profile) => ({
       name: profile.username,
       lastName: "",
       provider: "Discord",
     }),
   },
   ```
3. Add a login button in the signin/signup pages using `signIn.social({ provider: "discord" })`.

### Adding a Custom User Field

1. Add the field to `prisma/schema.prisma` → `User` model.
2. Run `pnpm db:migrate` and `pnpm db:generate`.
3. Add the field in `src/lib/auth/auth.ts` → `user.additionalFields`:
   ```ts
   myField: {
     type: "string",
     required: false,
     input: true,       // true = can be set during signup
     defaultValue: "",
   },
   ```
4. Update the Zod schema in `src/lib/validation/user.schema.ts`.

### Protecting a New Page

Use `getServerAuth()` in Server Components:
```tsx
import { getServerAuth } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";

export default async function SecretPage() {
  const session = await getServerAuth();
  if (!session) return redirect("/signin");
  return <div>Welcome, {session.user.firstName}</div>;
}
```

Or for client components, use the `useSession` hook:
```tsx
"use client";
import { useSession } from "@/lib/auth/auth-client";

export default function ProfileWidget() {
  const { data: session, isPending } = useSession();
  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not logged in</div>;
  return <div>Hello, {session.user.firstName}</div>;
}
```

## Common Mistakes / What NOT to do

- **DO NOT** call `getServerAuth()` in client components. Use `useSession()` instead.
- **DO NOT** call `useSession()` in Server Components. Use `getServerAuth()` instead.
- **DO NOT** create custom auth API routes. Better Auth handles everything through the `[...all]` catch-all route.
- **DO NOT** edit the Prisma-generated client in `src/generated/`. Run `pnpm db:generate` after schema changes.
- **DO NOT** store raw OTP codes in the database. The `emailOTP` plugin uses hashed storage (`storeOTP: "hashed"`).
- **DO NOT** hardcode auth-related URLs. Use `BETTER_AUTH_URL` from environment variables.
- **DO NOT** bypass the Zod validation schemas. Auth middleware automatically validates signups and OTP verifications.
