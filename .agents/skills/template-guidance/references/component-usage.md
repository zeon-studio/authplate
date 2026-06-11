# Component Usage

This skill explains how the UI component architecture is structured in this Authplate template and how to use the existing components.

## Component Architecture

Components are grouped into three primary folders within `src/layouts/`:
1. **`src/layouts/components/`**: Smaller, reusable UI elements and custom components.
2. **`src/layouts/partials/`**: Larger page sections or layout wrappers.
3. **`src/layouts/components/ui/`**: shadcn/ui pre-built components (buttons, inputs, dialogs, etc.).

Additional component locations:
- **`src/layouts/components/Form/`**: Auth-related form components (LoginForm, RegistrationForm, OtpVerifyForm, ForgotPasswordForm).
- **`src/layouts/components/payment/`**: Payment-related components.
- **`src/layouts/helpers/`**: Utility components (Announcement bar, etc.).
- **`src/layouts/shortcodes/`**: MDX shortcode components.

**Important for AI Agents:** The exact components available may vary. **Always list the contents of `src/layouts/components/` and `src/layouts/partials/` to discover what components exist in the current project.**

## Key Components

### Content Components

#### `<BlogCard />`
Located in `src/layouts/components/BlogCard.tsx`.
- **Purpose**: Displays a single blog post preview.
- **Props**: Receives a `data` object containing the parsed markdown content and frontmatter.
- **Usage**: Commonly mapped over an array of posts in `src/app/blog/page.tsx`.

#### `<SeoMeta />`
Located in `src/layouts/partials/SeoMeta.tsx`.
- **Purpose**: Injects SEO tags into the `<head>` of the document.
- **Props**: `title`, `meta_title`, `description`, `image`.
- **Usage**: Automatically used by layout and page components to set metadata. Falls back to `config.json` if props are omitted.

### Theme & Navigation

#### `<ThemeSwitcher />`
Located in `src/layouts/components/ThemeSwitcher.tsx`.
- **Purpose**: Toggles between light, dark, and system mode.
- **Usage**: Utilizes `useTheme` from `next-themes`. Embedded inside the `<Header />`.

#### `<Logo />`
Located in `src/layouts/components/Logo.tsx`.
- **Purpose**: Renders the site logo using `next/image` with fallback to text.
- **Usage**: Pulls source URLs from `config.json` (`logo`, `logo_darkmode`).

### Authentication Components

#### `<SignoutButton />`
Located in `src/layouts/components/SignoutButton.tsx`.
- **Purpose**: Triggers `signOut()` from the Better Auth client.
- **Usage**: Placed in the dashboard sidebar or user menu.

#### `<UserProfileMenu />`
Located in `src/layouts/partials/UserProfileMenu.tsx`.
- **Purpose**: Displays user avatar and dropdown menu with profile actions.
- **Usage**: Uses `useSession()` from the Better Auth client.

#### `<PasswordInput />`
Located in `src/layouts/components/PasswordInput.tsx`.
- **Purpose**: Password input field with show/hide toggle.
- **Usage**: Used in login, registration, and password reset forms.

#### `<OtpTimer />`
Located in `src/layouts/components/OtpTimer.tsx`.
- **Purpose**: Countdown timer for OTP expiration with resend functionality.
- **Usage**: Used alongside OTP verification forms.

#### `<SubmitButton />`
Located in `src/layouts/components/SubmitButton.tsx`.
- **Purpose**: Form submit button with loading state.
- **Usage**: Used in auth forms for consistent loading UX.

### Form Components (`src/layouts/components/Form/`)

- **`LoginForm`**: Email/password login with validation.
- **`RegistrationForm`**: User registration with validation and terms acceptance.
- **`OtpVerifyForm`**: 6-digit OTP input with auto-submit and timer.
- **`ForgotPasswordForm`**: Email input to trigger password reset OTP.

### Payment Components

#### `<PricingCard />`
Located in `src/layouts/components/PricingCard.tsx`.
- **Purpose**: Displays a pricing tier with features and checkout button.
- **Usage**: Used in pricing pages and the protected checkout flow.

### shadcn/ui Components (`src/layouts/components/ui/`)

Pre-built, accessible UI primitives managed via `components.json`. Available components include: accordion, alert-dialog, avatar, badge, button, card, checkbox, dropdown-menu, form, input, input-otp, label, separator, sheet, skeleton, sonner (toast), table, tabs, textarea.

To add more: `pnpm dlx shadcn@latest add <component-name>`

## Modifying Components

When extending components:
- **Styling**: Components use Tailwind utility classes in the `className` prop. Complex CSS uses classes defined in `src/styles/components.css`. shadcn/ui components use `class-variance-authority` for variant styling.
- **Data Fetching**: Components in `src/layouts/components/` should ideally remain stateless or rely on props. Data fetching should happen in page-level components (`src/app/**/page.tsx`) for Server Components, or via Better Auth client hooks for auth data.

## Common Mistakes / What NOT to do

- **DO NOT** embed heavy data fetching logic directly inside atomic components (like `BlogCard`). Pass data down from Server Components (pages) to keep the UI components pure.
- **DO NOT** hardcode generic values like the site name into components. They should always pull from `config.json` or props.
- **DO NOT** use `getServerAuth()` in client components. Use `useSession()` from `@/lib/auth/auth-client` instead.
- **DO NOT** import shadcn/ui components from wrong paths. They live at `@/layouts/components/ui/` (or `@/components/ui/` via alias).
