import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@/actions": path.resolve(import.meta.dirname, "./src/app/actions"),
      "@/components": path.resolve(
        import.meta.dirname,
        "./src/layouts/components",
      ),
      "@/helpers": path.resolve(
        import.meta.dirname,
        "./src/layouts/helpers",
      ),
      "@/partials": path.resolve(
        import.meta.dirname,
        "./src/layouts/partials",
      ),
      "@/shortcodes": path.resolve(
        import.meta.dirname,
        "./src/layouts/shortcodes",
      ),
      "@/layouts": path.resolve(import.meta.dirname, "./src/layouts"),
      "@/lib": path.resolve(import.meta.dirname, "./src/lib"),
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["tests/setup.ts"],
    include: [
      "tests/services/**/*.test.ts",
      "tests/services/**/*.test.tsx",
      "tests/routes/**/*.test.ts",
      "tests/routes/**/*.test.tsx",
      "tests/contract/**/*.test.ts",
      "tests/contract/**/*.test.tsx",
    ],
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://test_user:test_pass@localhost:5432/test_db",
      BETTER_AUTH_SECRET: "test_secret_for_vitest_runner_1234567890abcdef",
      BETTER_AUTH_URL: "http://localhost:3000",
      RATELIMIT_WINDOW: "10",
      RATELIMIT_MAX: "100",
    },
  },
});
