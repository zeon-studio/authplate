# Script Usage

This skill explains the custom Node.js scripts and `pnpm` commands available in this Authplate template.

## Available pnpm Commands (`package.json`)

### Development & Build

#### `pnpm dev`
Starts the local development server.
- **What it does**: Runs `next dev` to start the Next.js development server with hot module replacement.

#### `pnpm build`
Compiles the application for production.
- **What it does**: Runs `next build` to produce an optimized production build.

#### `pnpm start`
Starts the production server.
- **What it does**: Runs `next start` to serve the previously built application.

### Database (Prisma)

#### `pnpm db:generate`
Generates the Prisma client.
- **What it does**: Runs `prisma generate`, which outputs the type-safe database client to `src/generated/prisma/`. **Must be run after any changes to `prisma/schema.prisma`.**

#### `pnpm db:push`
Pushes schema changes directly to the database.
- **What it does**: Runs `prisma db push`. Best for prototyping — applies schema changes without creating migration files.

#### `pnpm db:migrate`
Creates and applies a database migration.
- **What it does**: Runs `prisma migrate dev`. Creates a migration file in `prisma/migrations/` and applies it. **Use this for production-ready schema changes.**

#### `pnpm db:migrate:prod`
Applies pending migrations in production.
- **What it does**: Runs `prisma migrate deploy`. Applies existing migration files without creating new ones. **Use this in CI/CD pipelines.**

#### `pnpm db:studio`
Opens the Prisma Studio database GUI.
- **What it does**: Runs `prisma studio`, which opens a browser-based UI to inspect and edit database records directly.

### Code Quality

#### `pnpm lint`
Lints the source code.
- **What it does**: Runs ESLint across all `.js`, `.jsx`, `.ts`, `.tsx` files in `src/`.

#### `pnpm format`
Formats the source code.
- **What it does**: Runs Prettier to auto-format all files in `src/`.

### Utility Scripts

#### `pnpm generate-json`
Generates content index JSON files.
- **What it does**: Runs `node scripts/jsonGenerator.js` to scan markdown content and compile indexes.

#### `pnpm remove-darkmode`
Strips dark mode capabilities from the template.
- **What it does**: Runs `scripts/removeDarkmode.mjs` to remove dark mode classes and styles, then auto-formats the code.

## The `scripts/` Directory

- **`jsonGenerator.mjs`**: Scans the markdown content and compiles it into JSON index files used for content rendering.
- **`removeDarkmode.mjs`**: A utility that removes all dark mode related code (CSS classes, theme variants) from the template.

## Common Mistakes / What NOT to do

- **DO NOT** manually edit `src/generated/prisma/`. Run `pnpm db:generate` after changing the Prisma schema instead.
- **DO NOT** use `pnpm db:push` in production. Use `pnpm db:migrate` to create proper migration files that can be tracked in version control.
- **DO NOT** forget to run `pnpm db:generate` after `pnpm db:migrate`. The Prisma client needs to be regenerated to reflect schema changes.
- **DO NOT** manually edit generated output files. Edit the source content or configuration files instead.
