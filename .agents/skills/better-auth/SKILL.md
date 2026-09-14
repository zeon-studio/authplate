---
name: better-auth
description: Complete authentication architecture and implementation guide for Better Auth across TypeScript/JavaScript applications (Next.js, Express, SvelteKit, Nuxt, Astro, Hono). Make sure to use this skill whenever the user mentions Better Auth, betterauth, auth.ts, session management, OAuth/social login (Google, GitHub, Apple), email/password auth, two-factor authentication (2FA/MFA), organizations/teams, multi-tenancy, rate limiting, or database adapters (Prisma, Drizzle, MongoDB/Mongoose, SQLite, PostgreSQL), even if they only ask to "add login" or "set up authentication".
---

# Better Auth Architecture & Implementation Guide

Better Auth is a TypeScript-first, framework-agnostic authentication and authorization library with built-in support for social OAuth, credentials, multi-factor authentication, multi-tenant organizations, and database adapters.

---

## 1. Mental Model & Architecture

Better Auth consists of two interconnected instances:

```
┌──────────────────────────────────────┐       ┌──────────────────────────────────────┐
│       Better Auth Server API         │       │       Better Auth Web Client         │
│  (betterAuth({ database, ... }))     │ ◄───► │      (createAuthClient({ ... }))     │
│  - Database Adapter (Prisma/Mongo)   │ HTTP  │  - React hooks (useSession)          │
│  - Session & Cookie Signing          │ REST  │  - signIn, signUp, signOut methods   │
│  - Plugins (2FA, Organization, etc.) │       │  - Client plugins (organization, 2FA)│
└──────────────────────────────────────┘       └──────────────────────────────────────┘
```

1. **Server (`auth.ts`):** Created with `betterAuth({ ... })`. Mounts on an API endpoint (`/api/auth/*`) in your backend or framework (e.g. Next.js App Router, Express, SvelteKit, Hono). Manages schema migrations, database sessions, password hashing, and token signing.
2. **Client (`auth-client.ts`):** Created with `createAuthClient({ baseURL })`. Provides reactive hooks (`useSession()`) and typed methods (`authClient.signIn.email()`, `authClient.signUp.email()`, `authClient.signIn.social()`).
3. **Database Layer:** Persists `User`, `Session`, `Account`, `Verification`, plus plugin-specific tables (`Organization`, `Member`, `Invitation`, `TwoFactor`). Managed automatically with the CLI:
   - `npx @better-auth/cli@latest migrate` (built-in adapters)
   - `npx @better-auth/cli@latest generate` (Prisma / Drizzle)

---

## 2. Fast Setup Workflow

### Step 1: Environment Variables
Generate a 32-character high-entropy secret:
```bash
# Terminal
openssl rand -base64 32
```
Add to `.env`:
```env
BETTER_AUTH_SECRET="your-32-char-random-secret"
BETTER_AUTH_URL="http://localhost:3000" # Base URL of the app
```

### Step 2: Server Configuration (`auth.ts`)
```ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb"; // or prismaAdapter, drizzleAdapter
import { client } from "@/lib/db";

export const auth = betterAuth({
  database: mongodbAdapter(client.db()), // or database: { provider: "sqlite", url: "..." }
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

### Step 3: Route Handlers
- **Next.js App Router (`app/api/auth/[...all]/route.ts`):**
  ```ts
  import { auth } from "@/lib/auth";
  import { toNextJsHandler } from "better-auth/next-js";

  export const { GET, POST } = toNextJsHandler(auth);
  ```
- **Express / Node (`src/server.ts`):**
  ```ts
  import { toNodeHandler } from "better-auth/node";
  app.all("/api/auth/*", toNodeHandler(auth));
  ```

### Step 4: Client Setup (`auth-client.ts`)
```ts
import { createAuthClient } from "better-auth/react"; // or better-auth/client for vanilla JS

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

### Step 5: Database Migration & Verification
```bash
npx @better-auth/cli@latest migrate
```
Verify the server is running by hitting `GET /api/auth/ok` (returns `{ status: "ok" }`).

---

## 3. Detailed Technical References

Better Auth contains specialized modules for complex auth flows. Consult the dedicated reference guides below as needed:

| Feature / Domain | Reference Document | Description |
| --- | --- | --- |
| **Project Planning & Scaffolding** | 📖 [scaffolding-and-setup.md](references/scaffolding-and-setup.md) | Framework detection, ORM selection, initial questionnaire, and UI scaffold generation. |
| **Core Configuration & Adapters** | 📖 [configuration.md](references/configuration.md) | Database adapters (Prisma, Drizzle, MongoDB, Kysely), secondary storage (Redis), and CLI workflows. |
| **Security & Hardening** | 📖 [security-and-hardening.md](references/security-and-hardening.md) | Rate limiting, secret entropy, CSRF protection, trusted origins, cookie options, and audit logs. |
| **Email & Password Authentication** | 📖 [email-and-password.md](references/email-and-password.md) | Email verification, password reset tokens, password policies, and custom argon2/bcrypt hashing. |
| **Organizations & Multi-Tenancy** | 📖 [organizations-and-teams.md](references/organizations-and-teams.md) | Organization creation, member invitations, custom RBAC permissions, teams, and active org switching. |
| **Two-Factor Authentication (2FA)** | 📖 [two-factor-authentication.md](references/two-factor-authentication.md) | TOTP authenticator apps (QR codes), backup codes, SMS/email OTPs, and trusted devices. |

---

## 4. Key Implementation Rules

1. **Secret Validation:** `BETTER_AUTH_SECRET` must be at least 32 characters long. Better Auth will refuse to boot with weak or placeholder keys in production.
2. **Re-Run CLI on Plugin Changes:** Whenever you add a plugin (e.g. `organization()`, `twoFactor()`), always run `npx @better-auth/cli migrate` (or `generate`) to create the new tables/collections.
3. **Keep Server & Client Plugins in Sync:** If you enable a plugin on the server (e.g. `plugins: [organization()]`), you **must** also enable its counterpart on the client (e.g. `plugins: [organizationClient()]`), otherwise client methods will be missing from TypeScript definitions.
4. **Environment Variables Over Config:** Define `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in `.env` rather than hardcoding `secret` and `baseURL` in code.
