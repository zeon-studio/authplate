<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Authplate Boilerplate (`authplate`)

`authplate` is a modern, production-ready full-stack starter boilerplate built on **Next.js 16 (App Router)**, **Better Auth**, **Prisma ORM (PostgreSQL)**, **Tailwind CSS v4**, and **shadcn/ui (Base UI primitives)**, authored by **Zeon Studio** (`zeon.studio`).

> [!IMPORTANT]
> **Complete Architecture & Template Skill Reference:**
> All architectural patterns, component usage, routing conventions, content collections, theming rules, script execution order, and authentication workflows are documented in the progressive disclosure skill:
> 📖 [`.agents/skills/template-guidance/SKILL.md`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/SKILL.md)
> Always refer to this skill guide and its reference documents before creating new pages, refactoring auth, or modifying styles.

---

## 🧭 Template Guidance Skill & Reference Map

The [`template-guidance`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/SKILL.md) skill organizes boilerplate documentation into focused reference guides in `.agents/skills/template-guidance/references/`:

- **Adding Pages & Routes:** [`references/adding-new-pages.md`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/references/adding-new-pages.md) — App Router conventions, route groups (`(auth)`, `(dashboard)`, `(protected)`, `[regular]`), and navigation registration.
- **Component Architecture:** [`references/component-usage.md`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/references/component-usage.md) — UI primitives (`src/layouts/components/ui/`), auth form components, layouts, and helpers.
- **Content Collections (Git-based CMS):** [`references/content-management.md`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/references/content-management.md) — Markdown/MDX frontmatter schemas, file naming, and images in `src/content/`.
- **Global Configuration:** [`references/page-configuration.md`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/references/page-configuration.md) — Site settings, menus, social links, and SEO in `src/config/`.
- **System Architecture & Data Flow:** [`references/project-architecture.md`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/references/project-architecture.md) — Directory layout, build pipeline, safe vs protected files.
- **Script Run Precedence:** [`references/script-usage.md`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/references/script-usage.md) — Command execution order (`pnpm install` ➔ `pnpm db:generate` ➔ `pnpm db:push`/`migrate` ➔ `pnpm dev`).
- **Styling & Theming:** [`references/styling-and-theming.md`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/references/styling-and-theming.md) — Tailwind v4 CSS-driven configuration, two-layer CSS variables (`theme.css` and `variables.css`), and dark mode via `next-themes`.
- **Authentication & Security:** [`references/authentication.md`](file:///Users/somrat/Development/Boilerplates/authplate/.agents/skills/template-guidance/references/authentication.md) — Better Auth server setup, client hooks, Server Component helpers, and OTP verification.

*Additional specialized skills in `.agents/skills/` include:* `better-auth-best-practices`, `better-auth-security-best-practices`, `email-and-password-best-practices`, `two-factor-authentication-best-practices`, `paddle-*`, and `shadcn`.

---

## 🛠️ Core Tech Stack & Rules

- **Framework & Runtime:** Next.js 16 (App Router, Turbopack, React 19, TypeScript strict).
- **Authentication (Better Auth):**
  - **Server Config:** [`src/lib/auth/auth.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/lib/auth/auth.ts) — Configures Prisma adapter, email/password (with bcrypt), OTP verification plugin, Next.js cookies, and Google/GitHub OAuth providers.
  - **Client Interface:** [`src/lib/auth/auth-client.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/lib/auth/auth-client.ts) — Exports hooks and client methods (`useSession`, `signIn`, `signUp`, `signOut`, `emailOtp`, etc.).
  - **Server Helper:** [`src/lib/auth/auth-server.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/lib/auth/auth-server.ts) — Exports `getServerAuth()` for Server Components and Server Actions.
  - **API Catch-All Route:** [`src/app/api/auth/[...all]/route.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/app/api/auth/[...all]/route.ts) — Serves all Better Auth endpoints via `toNextJsHandler(auth)`.
  - **Validation Schemas:** [`src/lib/validation/user.schema.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/lib/validation/user.schema.ts) & [`otp.schema.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/lib/validation/otp.schema.ts) via Zod.
- **Database & Prisma ORM:**
  - **Database:** PostgreSQL (Neon / Supabase / standard PostgreSQL) configured via `DATABASE_URL` in `.env`.
  - **Schema:** [`prisma/schema.prisma`](file:///Users/somrat/Development/Boilerplates/authplate/prisma/schema.prisma) with models for `User`, `Session`, `Account`, `Verification`, `OtpVerification`, `Subscription`, and `Payment`.
  - **Client Singleton:** [`src/lib/prisma.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/lib/prisma.ts) using `@prisma/adapter-pg`.
  - **Generated Output:** `src/generated/prisma/` — **NEVER edit files in `src/generated/` manually.** Run `pnpm db:generate` to regenerate after schema edits.
- **Billing & Subscriptions:**
  - **Paddle Billing V2:** Integration with `@paddle/paddle-node-sdk` and `@paddle/paddle-js`.
  - Webhook listener at [`src/app/api/paddlehooks/route.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/app/api/paddlehooks/route.ts).
  - Configuration in [`src/config/paddle.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/config/paddle.ts) (and [`src/config/stripe.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/config/stripe.ts) for optional Stripe support).
- **Content Engine (Git-based CMS):**
  - Content collections located in `src/content/` (`about`, `blog`, `contact`, `homepage`, `pages`, `pricing`, `sections`).
  - Rendered dynamically via catch-all `src/app/[regular]/page.tsx` and `src/app/blog/` using `gray-matter`, `next-mdx-remote`, and `marked`.
- **Environment Variables:** Validated at runtime using Zod in [`src/lib/env.ts`](file:///Users/somrat/Development/Boilerplates/authplate/src/lib/env.ts).

---

## 🎨 Mandatory UI/UX Standards: shadcn/ui & Base UI

- **Strict Component Primitives Rule (shadcn & Base UI):** Strictly and exclusively use the project's standard **shadcn/ui** components built on **Base UI** (`@base-ui/react`) primitives located in [`src/layouts/components/ui/`](file:///Users/somrat/Development/Boilerplates/authplate/src/layouts/components/ui/). Do not introduce unvetted third-party UI libraries or raw HTML replacements.
- **Two-Layer CSS Variable Theming:**
  - **Layer 1 (Raw Palette):** [`src/styles/theme.css`](file:///Users/somrat/Development/Boilerplates/authplate/src/styles/theme.css) defines raw color variables under `:root` and `.dark`. Edit this file to adjust colors.
  - **Layer 2 (Semantic Tokens):** [`src/styles/variables.css`](file:///Users/somrat/Development/Boilerplates/authplate/src/styles/variables.css) maps raw palette values to Tailwind `@theme inline` tokens (`--color-background`, `--color-primary`, `--color-muted`, `--color-border`, etc.).
  - **Zero Hardcoded Colors:** Never use raw hex codes (e.g. `text-[#121212]`) or arbitrary color utilities. Always use semantic design tokens: `bg-background`, `bg-card`, `bg-primary`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-destructive`, etc.
- **Dark Mode:** Powered by `next-themes` via `<ThemeProvider>` in [`src/layouts/partials/Providers.tsx`](file:///Users/somrat/Development/Boilerplates/authplate/src/layouts/partials/Providers.tsx). Default theme is set in [`src/config/config.json`](file:///Users/somrat/Development/Boilerplates/authplate/src/config/config.json) (`settings.default_theme`).
- **Typography:** Headings and text use responsive exponential scaling via `--font-scale` and `@theme` tokens (`text-h1` through `text-h6`). Primary and secondary fonts are configured in [`src/app/layout.tsx`](file:///Users/somrat/Development/Boilerplates/authplate/src/app/layout.tsx) via `next/font/google`.
- **Component Placement Conventions:**
  - `src/layouts/components/`: Reusable standalone components (`Logo`, `ThemeSwitcher`, `SubmitButton`, `PasswordInput`, `OtpTimer`, `PricingCard`).
  - `src/layouts/components/Form/`: Authentication forms (`LoginForm`, `RegistrationForm`, `OtpVerifyForm`, `ForgotPasswordForm`).
  - `src/layouts/partials/`: Major layout wrappers (`Header`, `Footer`, `SeoMeta`, `Providers`, `UserProfileMenu`).
  - `src/layouts/components/ui/`: Base UI / shadcn primitives (`button`, `card`, `input`, `table`, `tabs`, `dialog`, `badge`, `avatar`, etc.).

---

## 📁 Route Topology & Access Control

- **Public Auth Routes (`src/app/(auth)/`):**
  - Sign In: `/signin` (email/password, OTP switch, Google/GitHub OAuth)
  - Sign Up: `/signup` (user registration, validation, terms acceptance)
  - Forgot Password: `/forgot-password` (triggers OTP email dispatch)
  - Uses shared centered card layout in `src/app/(auth)/layout.tsx`.
- **Protected Dashboard Routes (`src/app/(dashboard)/`):**
  - Subscriptions: `/dashboard/subscriptions`
  - Billing & Invoices: `/dashboard/billing`
  - Account Settings: `/dashboard/settings`
  - *Layout Guard:* [`src/app/(dashboard)/layout.tsx`](file:///Users/somrat/Development/Boilerplates/authplate/src/app/(dashboard)/layout.tsx) automatically invokes `getServerAuth()` and redirects unauthenticated users to `/signin`.
  - *Sidebar Menu:* Configured centrally in [`src/config/menu.json`](file:///Users/somrat/Development/Boilerplates/authplate/src/config/menu.json) under the `dashboard` array.
- **Protected Standalone Routes (`src/app/(protected)/`):**
  - Checkout flow (`/checkout`) requiring auth but using a dedicated full-width container rather than the dashboard sidebar.
- **Content & Marketing Routes:**
  - Blog: `src/app/blog/` (blog listing and dynamic post reader)
  - About: `src/app/about/`
  - Contact: `src/app/contact/`
  - Catch-All Dynamic Pages: `src/app/[regular]/page.tsx` (renders standalone pages from `src/content/pages/`).

---

## ⚡ Server Actions vs API Routes

- **Server Actions (`src/app/actions/`):** Primary mechanism for mutations and form handling:
  - User updates and profile management: `src/app/actions/user/`
  - OTP creation and verification: `src/app/actions/otp/`
  - Email dispatching via Nodemailer: `src/app/actions/sender/`
  - Paddle subscriptions and checkout: `src/app/actions/paddle/`, `src/app/actions/subscriptions/`
- **API Route Handlers (`src/app/api/`):** Reserved for external webhooks and auth:
  - Better Auth catch-all: `src/app/api/auth/[...all]/route.ts`
  - Paddle webhook processing: `src/app/api/paddlehooks/route.ts`

---

## 🔄 Script Precedence & Database Protocol

When setting up or modifying database models, follow this exact sequence:

1. **Initial Setup:**
   ```bash
   pnpm install
   pnpm db:generate
   pnpm db:push       # or pnpm db:migrate
   pnpm dev
   ```
2. **Schema Changes:**
   - Edit [`prisma/schema.prisma`](file:///Users/somrat/Development/Boilerplates/authplate/prisma/schema.prisma)
   - Apply migration: `pnpm db:migrate` (or `pnpm db:push` for fast prototyping)
   - Regenerate Prisma client: `pnpm db:generate`
3. **Content Indexing:**
   - Run `pnpm generate-json` when updating or adding markdown content collections.

---

## 🧪 Testing Suite & Architecture (Vitest)

The test suite is powered by **Vitest** configured in [`vitest.config.mts`](file:///Users/somrat/Development/Boilerplates/authplate/vitest.config.mts) with Node environment simulation, path alias resolution, and Next.js mock headers in [`tests/setup.ts`](file:///Users/somrat/Development/Boilerplates/authplate/tests/setup.ts).

The test suite is partitioned into three key domains:
- **Contract & Schema Tests (`tests/contract/`):**
  - [`validation.contract.test.ts`](file:///Users/somrat/Development/Boilerplates/authplate/tests/contract/validation.contract.test.ts) — Validates Zod schemas (`userSchema`, `passwordSchema`, `loginUserSchema`, `registerUserSchema`, `otpSchema`, `otpVerifySchema`).
  - [`utils.contract.test.ts`](file:///Users/somrat/Development/Boilerplates/authplate/tests/contract/utils.contract.test.ts) — Tests slugification, string utilities, and date formatting helpers.
- **Route & Middleware Tests (`tests/routes/`):**
  - [`proxy.routes.test.ts`](file:///Users/somrat/Development/Boilerplates/authplate/tests/routes/proxy.routes.test.ts) — Tests proxy/middleware route access guards, public routes, and redirect flows.
- **Service & Integration Tests (`tests/services/`):**
  - [`paddle.service.test.ts`](file:///Users/somrat/Development/Boilerplates/authplate/tests/services/paddle.service.test.ts) — Tests Paddle payment SDK initialization and customer portal generation.
  - [`content.service.test.ts`](file:///Users/somrat/Development/Boilerplates/authplate/tests/services/content.service.test.ts) — Tests markdown parser, frontmatter extraction, and taxonomy helpers.

### Available Test Commands:
- `pnpm test` — Run all test suites once (`vitest run`).
- `pnpm test:watch` — Interactive watch mode for TDD.
- `pnpm test:contract` — Run only contract and validation schema tests.
- `pnpm test:routes` — Run only proxy and route protection tests.
- `pnpm test:services` — Run only service and content parser tests.

---

## 🚦 Quality Gates

Always run and verify before submitting changes:

- `pnpm test` (Vitest test suite — 5 test files across `tests/contract/`, `tests/routes/`, `tests/services/`)
- `pnpm lint` (ESLint code quality check)
- `pnpm format` (Prettier code formatting)
- `pnpm db:generate` (Prisma client compilation)
- `pnpm build` (Next.js production build)

