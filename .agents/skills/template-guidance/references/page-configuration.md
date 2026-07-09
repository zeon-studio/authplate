# Page and Site Configuration

This skill explains how to configure global settings, navigation, social links, and SEO metadata in this Authplate template.

## Global Configuration Files

The primary configuration files are located in `src/config/`. These are JSON and TypeScript files that control various aspects of the site.

**Important for AI Agents:** The exact schema and available keys may vary. **Always read the contents of the files in `src/config/` to discover what settings are currently available.**

### `src/config/config.json`

This is the master configuration file for the site.

- **`site`**: Contains basic site info like `title`, `base_url`, `favicon`, `logo` paths, `logo_darkmode`, and logo dimensions.
- **`announcement`**: Controls the announcement banner (`enable`, `content` HTML, `expire_days`).
- **`settings`**: Controls feature flags like `search`, `sticky_header`, `theme_switcher`, `default_theme` (dark/light/system), `pagination` limits, `blog_folder`, and `payment` provider (e.g., `"paddle"`).
- **`params`**: Contains global parameters like `contact_form_action` and `copyright` text.
- **`navigation_button`**: Controls the header CTA button (`enable`, `label`, `link`).
- **`metadata`**: Global SEO defaults (`meta_author`, `meta_image`, `meta_description`).

### `src/config/menu.json`

Controls the header, dashboard sidebar, and footer navigation menus.

- **`main`**: Array of objects for the header menu (`name`, `url`). Supports nested menus via `hasChildren` and `children`.
- **`dashboard`**: Array of objects for the dashboard sidebar menu (`name`, `url`, `icon`). Icons map to Lucide icon names.
- **`footer`**: Array of objects for footer links.

### `src/config/social.ts`

A **TypeScript** file (not JSON) that defines social media links and their icons.

- Exports an array of objects with `name`, `icon` (from `@icons-pack/react-simple-icons`), and `link`.
- Used by the `<Social />` component.
- To add or remove a social link, edit this TypeScript file directly.

### `src/config/paddle.ts`

Paddle payment integration configuration (pricing tier IDs, etc.).

### `src/config/stripe.ts`

Stripe payment integration configuration (if using Stripe instead of Paddle).

## SEO Metadata

SEO is handled dynamically, with fallbacks:

1. **Per-Page Basis**: Defined in the frontmatter of individual markdown files (`title`, `meta_title`, `description`, `image`).
2. **Global Fallback**: If a specific page lacks SEO fields, the system falls back to `config.json` → `metadata`.

The `<SeoMeta />` component in `src/layouts/partials/SeoMeta.tsx` orchestrates this metadata injection into the `<head>`.

## Common Mistakes / What NOT to do

- **DO NOT** delete keys from `config.json` or `menu.json` unless you are sure the code doesn't depend on them. If you want to disable a feature, check if there is an `enable: false` toggle instead.
- **DO NOT** hardcode navigation links directly into header or footer components. Always use `menu.json` to keep configuration centralized.
- **DO NOT** use relative paths for `base_url` in `config.json`. It must be a fully qualified URL (e.g., `https://yourdomain.com`).
- **DO NOT** try to edit `social.ts` as if it were JSON. It is a TypeScript file that imports icon components from `@icons-pack/react-simple-icons`.
- **DO NOT** forget to add dashboard routes to `menu.json` → `dashboard` array when creating new dashboard pages.
