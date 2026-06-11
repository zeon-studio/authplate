# Styling and Theming

This template uses **Tailwind CSS v4** with a **two-layer CSS variable system** for theming and **shadcn/ui** for pre-built components.

## Theming Architecture

Colors and fonts are controlled through two CSS files that form a layered variable system:

### Layer 1: `src/styles/theme.css` — Raw Color Palette

This is the primary file to edit for color changes. It defines raw CSS variables for both light and dark modes.

```css
/* Light mode (default) */
:root {
  --body-color: #ffffff;
  --primary-color: #000000;
  --border-color: #a6b0c3;
  --accent-color: #007bff;
  /* ... more color variables */
}

/* Dark mode */
.dark {
  --body-color: #1c1c1c;
  --primary-color: #ffffff;
  --border-color: #3d3d3d;
  --accent-color: #00aaff;
  /* ... dark mode overrides */
}
```

Font size base and scale are also defined here:
```css
:root {
  --font-base: 16;
  --font-scale: 1.2;
  --radius: 0.6rem;
}
```

Font families are configured in `src/app/layout.tsx` using `next/font/google` and exposed as `--font-primary` and `--font-secondary` CSS variables.

### Layer 2: `src/styles/variables.css` — Semantic Tokens & Tailwind Integration

This file maps the raw color palette from `theme.css` into semantic design tokens that Tailwind CSS v4 and shadcn/ui components consume via `@theme inline`.

```css
:root {
  --background: var(--body-color);
  --primary: var(--primary-color);
  --destructive: var(--danger-color);
  /* ... semantic mappings */
}

@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  /* ... Tailwind theme tokens */
  --text-h1: calc(1rem * pow(var(--font-scale), 6));
  /* ... responsive heading sizes using exponential scaling */
}
```

### Changing Colors

1. Edit **`src/styles/theme.css`** to change the raw color values.
2. The semantic mappings in `variables.css` will automatically pick up the changes.
3. Use Tailwind classes like `text-primary`, `bg-background`, `border-border` in your components.

### Changing Fonts

Edit `src/app/layout.tsx` to change Google Font imports:
```tsx
const fontPrimary = Heebo({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-primary",
});
```

## Tailwind CSS v4 Integration

The main Tailwind configuration is entirely CSS-driven. The entry point is `src/styles/main.css`:

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";
@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";
@plugin "tailwind-bootstrap-grid";

@import "./theme.css";
@import "./variables.css";
@import "./safe.css";
@import "./utilities.css";

@layer base { @import "./base.css"; }
@layer components {
  @import "./components.css";
  @import "./navigation.css";
}
```

### `src/styles/` Directory Structure
- `main.css`: Root entry importing Tailwind and all custom layers.
- `theme.css`: Raw color palette and font size variables. **Edit this for color changes.**
- `variables.css`: Maps raw variables to Tailwind `@theme` tokens and shadcn semantic tokens.
- `base.css`: Base HTML element styling (headings, body, etc.).
- `components.css`: Custom component classes.
- `navigation.css`: Navigation-specific styles.
- `utilities.css`: Custom utility classes.
- `safe.css`: Safelist styles for dynamic classes.

## shadcn/ui Components

This template uses **shadcn/ui** for pre-built, accessible UI components. They are located in `src/layouts/components/ui/` and configured via `components.json` at the project root.

To add new shadcn components, use:
```bash
pnpm dlx shadcn@latest add <component-name>
```

## Dark Mode

Dark mode is handled using `next-themes`:
- The `next-themes` provider (in `src/layouts/partials/Providers.tsx`) adds a `.dark` class to the HTML element.
- `theme.css` defines separate color values under the `.dark` selector.
- To use dark mode specific Tailwind classes, prefix them with `dark:` (e.g., `dark:bg-dark`).
- The default theme is set to `"system"` in `config.json` → `settings.default_theme`.

## Common Mistakes / What NOT to do

- **DO NOT** hardcode hex colors in your React components or Tailwind classes (e.g., `text-[#121212]`). Always use the theme variables provided (e.g., `text-primary`, `bg-background`).
- **DO NOT** configure Tailwind in a `tailwind.config.js` file. Tailwind v4 uses CSS for configuration. If you need to add custom utilities, add them to `src/styles/utilities.css` or use the `@theme` directive in `variables.css`.
- **DO NOT** edit `variables.css` to change colors — edit `theme.css` instead. `variables.css` is the mapping layer, not the source of truth for color values.
- **DO NOT** install shadcn components manually by copying files. Always use `pnpm dlx shadcn@latest add` to ensure proper integration.
