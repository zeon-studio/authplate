# Adding New Pages

This skill explains how to add new pages utilizing the Next.js App Router paradigm combined with this template's custom Markdown architecture and route group system.

## How Routing Works

This project uses the Next.js **App Router** (`src/app/`).
There are multiple ways to add a page, depending on whether the content is static/dynamic and whether it requires authentication.

## Route Groups

This template uses Next.js **route groups** (parenthesized folders) to organize pages by access level:

- **`(auth)`**: Unauthenticated pages — signin, signup, forgot-password. Uses a centered card layout.
- **`(dashboard)`**: Authenticated pages — settings, billing, subscriptions. Uses a sidebar layout and redirects to `/sign-in` if not logged in.
- **`(protected)`**: Other authenticated pages that don't use the dashboard sidebar (e.g., checkout).
- **`[regular]`**: Catch-all for markdown-driven pages from `src/content/pages/`.

### Method 1: Adding a Markdown-Driven Page (Recommended for Content Pages)

If the page is mainly text and images (like an "About" or "Privacy Policy" page):

**Important for AI Agents:** Check which folder represents standard standalone pages (often `src/content/pages/` or similar) before creating the file.

1. **Create the Content File**: Create a new markdown file in `src/content/pages/` (e.g., `src/content/pages/my-new-page.md`).
2. **Add Frontmatter**:
   ```yaml
   ---
   title: "My New Page"
   meta_title: "SEO Title Here"
   description: "Description of the new page"
   draft: false
   ---
   Your markdown content goes here.
   ```
3. **How it renders**: The file `src/app/[regular]/page.tsx` acts as a catch-all route. It automatically detects the slug (e.g., `/my-new-page`), looks for it in `src/content/`, parses it using `next-mdx-remote` or `marked`, and renders it using a default page layout.

### Method 2: Adding a Code-Driven Public Page (App Router)

If the page requires custom React components, complex layouts, or API data fetching:

1. **Create the Route Directory**: Create a folder in `src/app/` (e.g., `src/app/my-custom-page/`).
2. **Create the `page.tsx` file**:

   ```tsx
   import SeoMeta from "@/partials/SeoMeta";

   export const metadata = {
     title: "My Custom Page",
     description: "Custom description",
   };

   export default function MyCustomPage() {
     return (
       <>
         <SeoMeta title="My Custom Page" />
         <section className="section">
           <div className="container">
             <h1 className="text-h2">My Custom Page</h1>
             <p>Custom React code goes here.</p>
           </div>
         </section>
       </>
     );
   }
   ```

3. **Add to Navigation**: To make the page visible in the header, edit `src/config/menu.json` and add an object to the `main` array:
   ```json
   {
     "name": "My Custom Page",
     "url": "/my-custom-page"
   }
   ```

### Method 3: Adding a Protected Dashboard Page

If the page requires authentication and should appear in the dashboard sidebar:

1. **Create the Route Directory**: Create a folder inside `src/app/(dashboard)/dashboard/` (e.g., `src/app/(dashboard)/dashboard/my-page/`).
2. **Create the `page.tsx` file**:

   ```tsx
   import { getServerAuth } from "@/lib/auth/auth-server";

   export default async function MyDashboardPage() {
     const session = await getServerAuth();
     // session is guaranteed non-null because the (dashboard) layout already checks

     return (
       <div>
         <h1>Welcome, {session?.user.firstName}</h1>
         {/* Your dashboard content */}
       </div>
     );
   }
   ```

3. **Add to Dashboard Sidebar**: Edit `src/config/menu.json` and add an object to the `dashboard` array:
   ```json
   {
     "name": "My Page",
     "url": "/dashboard/my-page",
     "icon": "LayoutDashboard"
   }
   ```
   The `icon` value should be a valid Lucide icon name.

4. **Route protection is automatic**: The `(dashboard)` layout (`src/app/(dashboard)/layout.tsx`) calls `getServerAuth()` and redirects unauthenticated users to `/sign-in`. No additional middleware is needed.

### Method 4: Adding a Protected Non-Dashboard Page

If the page requires authentication but should NOT use the dashboard sidebar:

1. **Create inside the `(protected)` route group**: `src/app/(protected)/my-protected-page/page.tsx`.
2. **Check auth manually** since this group does not have an automatic auth-checking layout:

   ```tsx
   import { getServerAuth } from "@/lib/auth/auth-server";
   import { redirect } from "next/navigation";

   export default async function MyProtectedPage() {
     const session = await getServerAuth();
     if (!session) {
       return redirect("/signin");
     }
     // Your protected content
   }
   ```

## Common Mistakes / What NOT to do

- **DO NOT** create a `pages/` directory at the root. This project strictly uses the `app/` router.
- **DO NOT** forget to add `<SeoMeta />` or `export const metadata = {}` when creating a code-driven page. Without it, the page will lack proper SEO tags.
- **DO NOT** manually create routes in `src/app/` for markdown files that are already handled by the `[regular]` catch-all route, as this will cause route conflicts.
- **DO NOT** guess the component structure for layouts. Always verify how existing custom pages implement them to ensure you are using the correct top-level components.
- **DO NOT** place dashboard pages outside of `src/app/(dashboard)/dashboard/`. They will not get the sidebar layout or automatic auth protection.
- **DO NOT** use `useSession()` in Server Components. Use `getServerAuth()` from `@/lib/auth/auth-server` instead.
