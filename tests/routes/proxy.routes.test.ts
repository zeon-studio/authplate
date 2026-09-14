import { proxy } from "@/proxy";
import { NextRequest } from "next/server";
import assert from "node:assert";
import { describe, it } from "vitest";

describe("Proxy & Edge Routing Test Suite", () => {
  const baseUrl = "https://authplate.test";

  const publicPages = ["/signin", "/signup", "/forgot-password", "/otp"];
  const protectedPages = ["/", "/checkout", "/dashboard/settings"];

  it("allows unauthenticated access to public auth pages", async () => {
    for (const path of publicPages) {
      const req = new NextRequest(`${baseUrl}${path}`);
      const res = await proxy(req);
      assert.strictEqual(res.status, 200, `Expected pass-through for ${path}`);
      assert.strictEqual(res.headers.get("location"), null);
    }
  });

  it("redirects authenticated users away from public auth pages to home", async () => {
    for (const path of publicPages) {
      const req = new NextRequest(`${baseUrl}${path}`, {
        headers: {
          cookie: "better-auth.session_token=test_session_token_12345",
        },
      });
      const res = await proxy(req);
      assert.strictEqual(res.status, 307);
      assert.strictEqual(res.headers.get("location"), `${baseUrl}/`);
    }
  });

  it("redirects unauthenticated users from protected pages to /signin with a from= callback", async () => {
    for (const path of protectedPages) {
      const req = new NextRequest(`${baseUrl}${path}`);
      const res = await proxy(req);
      assert.strictEqual(res.status, 307, `Expected redirect for ${path}`);
      const location = res.headers.get("location");
      assert.ok(location?.startsWith(`${baseUrl}/signin?from=${path}`));
    }
  });

  it("allows authenticated users through protected pages", async () => {
    for (const path of protectedPages) {
      const req = new NextRequest(`${baseUrl}${path}`, {
        headers: {
          cookie: "better-auth.session_token=test_session_token_12345",
        },
      });
      const res = await proxy(req);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get("location"), null);
    }
  });

  it("recognizes the production __Secure- cookie prefix", async () => {
    const req = new NextRequest(`${baseUrl}/dashboard/settings`, {
      headers: {
        cookie: "__Secure-better-auth.session_token=prod_secure_token",
      },
    });
    const res = await proxy(req);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("location"), null);
  });

  it("treats a cookie-less request to a nested dashboard path as unauthenticated", async () => {
    const req = new NextRequest(`${baseUrl}/dashboard/subscriptions`);
    const res = await proxy(req);
    assert.strictEqual(res.status, 307);
    assert.ok(
      res.headers
        .get("location")
        ?.startsWith(`${baseUrl}/signin?from=/dashboard/subscriptions`),
    );
  });
});
