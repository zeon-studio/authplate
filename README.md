# Authplate

A modern authentication boilerplate for Next.js with BetterAuth, PostgreSQL (Prisma), Stripe, and Paddle.

## Features

- **Next.js 16+** with App Router
- **BetterAuth** — credentials, Google, GitHub OAuth
- **PostgreSQL** via Prisma 7 (Neon, Supabase, or any Postgres)
- **Stripe & Paddle** payment integration
- **OTP email verification** via Nodemailer
- **Rate limiting**, dark/light mode, TypeScript, Tailwind CSS

## Requirements

- Node.js v20+
- pnpm v11+
- PostgreSQL database (Neon recommended)

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/zeon-studio/authplate.git
cd authplate
pnpm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
# Better Auth
BETTER_AUTH_SECRET="generate_a_random_secret"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Rate limiting
RATELIMIT_WINDOW=10
RATELIMIT_MAX=100

# Password hashing
SALT_ROUND=10

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Nodemailer
SENDER_EMAIL="your@email.com"
EMAIL_PASSWORD="your_app_password"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Paddle
PADDLE_API_KEY=""
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=""
PADDLE_NOTIFICATION_WEBHOOK_SECRET=""
NEXT_PUBLIC_PADDLE_ENV="sandbox"
```

### 3. Set up the database

Push the Prisma schema to your database and generate the client:

```bash
pnpm dlx dotenv-cli prisma db push
pnpm dlx dotenv-cli prisma generate
```

> `dotenv-cli` is required because Prisma 7's `prisma.config.ts` loads `DATABASE_URL` at config-parse time, before the standard env injection runs.

### 4. Run the dev server

```bash
pnpm dev
```

App runs at [http://localhost:3000](http://localhost:3000).

---

## Database

Authplate uses **PostgreSQL** with Prisma 7. Any Postgres provider works. [Neon](https://neon.tech) is recommended for serverless deployments (free tier available).

### Schema changes

After editing `prisma/schema.prisma`:

```bash
# Push changes (no migration files — good for dev/prototyping)
pnpm dlx dotenv-cli prisma db push

# Regenerate Prisma client
pnpm dlx dotenv-cli prisma generate
```

Or use the package.json scripts (requires `DATABASE_URL` in shell env):

```bash
pnpm db:push
pnpm db:generate
```

---

## Authentication

BetterAuth handles all auth flows. Configure providers in `src/lib/auth/auth.ts`.

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:3000/api/auth/callback/google` as redirect URI

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Register a new OAuth App
3. Set callback URL to `http://localhost:3000/api/auth/callback/github`

### Email / OTP

Uses Nodemailer. For Gmail, create an [App Password](https://support.google.com/accounts/answer/185833) and use it as `EMAIL_PASSWORD`.

---

## Payments

Configure pricing tiers in `src/app/actions/paddle/pricing-tier.ts` (Paddle) or `src/config/stripe.ts` (Stripe).

### Paddle

1. Create a [Paddle account](https://paddle.com)
2. Get `PADDLE_API_KEY` and `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` from the dashboard
3. Set up a webhook pointing to `https://yourdomain.com/api/paddlehooks`
4. Copy the webhook secret to `PADDLE_NOTIFICATION_WEBHOOK_SECRET`
5. Set `NEXT_PUBLIC_PADDLE_ENV=sandbox` for testing, `production` for live

### Stripe

1. Get keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Set up a webhook pointing to `https://yourdomain.com/api/stripe-hooks`
3. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Docker

Build:

```bash
docker build --build-arg DATABASE_URL="your_postgres_url" -t authplate .
```

Run:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e BETTER_AUTH_SECRET="..." \
  -e BETTER_AUTH_URL="https://yourdomain.com" \
  -e GOOGLE_CLIENT_ID="..." \
  -e GOOGLE_CLIENT_SECRET="..." \
  -e GITHUB_CLIENT_ID="..." \
  -e GITHUB_CLIENT_SECRET="..." \
  -e SENDER_EMAIL="..." \
  -e EMAIL_PASSWORD="..." \
  -e PADDLE_API_KEY="..." \
  -e NEXT_PUBLIC_PADDLE_CLIENT_TOKEN="..." \
  -e PADDLE_NOTIFICATION_WEBHOOK_SECRET="..." \
  -e NEXT_PUBLIC_PADDLE_ENV="production" \
  authplate
```

> `DATABASE_URL` is needed at build time (for `prisma generate`) and at runtime. Pass it as both `--build-arg` and `-e`.

---

## License

MIT — see `LICENSE`.

---

Built by [Zeon Studio](https://zeon.studio)
