import { PricingTier } from "@/actions/paddle/pricing-tier";
import { cn } from "@/lib/utils/shadcn";
import { humanize, plainify, slugify } from "@/lib/utils/textConverter";
import dateFormat from "@/lib/utils/dateFormat";
import { sortByDate, sortByWeight } from "@/lib/utils/sortFunctions";
import assert from "node:assert";
import { describe, it } from "vitest";

describe("cn — Tailwind class merging", () => {
  it("merges plain class strings", () => {
    assert.strictEqual(cn("px-4", "py-2"), "px-4 py-2");
  });

  it("resolves conflicting Tailwind utilities, keeping the last one", () => {
    assert.strictEqual(cn("p-2", "p-4"), "p-4");
    assert.strictEqual(cn("bg-red-500", "bg-blue-500"), "bg-blue-500");
  });

  it("drops falsy values", () => {
    const isActive = true;
    assert.strictEqual(
      cn("btn", isActive && "btn-active", false && "btn-error"),
      "btn btn-active",
    );
  });
});

describe("textConverter helpers", () => {
  it("humanize capitalizes and normalizes whitespace/underscores", () => {
    assert.strictEqual(humanize("hello_world"), "Hello world");
    assert.strictEqual(humanize("  extra   spaces  "), "Extra spaces");
    assert.strictEqual(humanize("already Capitalized"), "Already Capitalized");
  });

  it("slugify produces a URL-safe slug", () => {
    assert.strictEqual(slugify("Hello World!"), "hello-world");
    assert.strictEqual(slugify("Café & Bar"), "café--bar");
  });

  it("plainify strips markdown/HTML down to plain text", () => {
    const result = plainify("**Bold** and _italic_ text");
    assert.ok(!result.includes("<"));
    assert.ok(result.includes("Bold"));
    assert.ok(result.includes("italic"));
  });
});

describe("dateFormat", () => {
  // Constructed from local year/month/day fields (not an ISO/UTC string) so
  // the exact-day assertions below can't flip across a date boundary
  // depending on the machine's timezone.
  const aug27 = new Date(2026, 7, 27);
  const jan5 = new Date(2026, 0, 5);

  it("formats a date with the default pattern", () => {
    const formatted = dateFormat(aug27);
    assert.ok(formatted.includes("2026"));
    assert.ok(formatted.includes("Aug"));
  });

  it("accepts a custom pattern", () => {
    assert.strictEqual(dateFormat(aug27, "yyyy-MM-dd"), "2026-08-27");
  });

  it("accepts a date string as well as a Date object", () => {
    assert.strictEqual(dateFormat(jan5, "yyyy-MM-dd"), "2026-01-05");
    // No trailing "Z"/offset, so this is parsed as local time, matching
    // `jan5` above rather than shifting across a day boundary.
    assert.strictEqual(
      dateFormat("2026-01-05T00:00:00", "yyyy-MM-dd"),
      "2026-01-05",
    );
  });
});

const makePost = (title: string, date: string) => ({
  frontmatter: {
    title,
    categories: [],
    author: "Jane Doe",
    tags: [],
    date,
  },
  slug: title.toLowerCase().replace(/\s+/g, "-"),
});

describe("sortFunctions", () => {
  it("sortByDate orders posts newest first", () => {
    const posts = [
      makePost("Oldest", "2026-01-01"),
      makePost("Newest", "2026-06-01"),
      makePost("Middle", "2026-03-01"),
    ];
    const sorted = sortByDate(posts as any);
    assert.deepStrictEqual(
      sorted.map((p) => p.frontmatter.title),
      ["Newest", "Middle", "Oldest"],
    );
  });

  it("sortByWeight orders weighted items first, ascending, then unweighted items", () => {
    const items = [
      { frontmatter: { weight: 3, title: "third" } },
      { frontmatter: { weight: undefined, title: "unweighted" } },
      { frontmatter: { weight: 1, title: "first" } },
      { frontmatter: { weight: 2, title: "second" } },
    ];
    const sorted = sortByWeight(items as any);
    assert.deepStrictEqual(
      sorted.map((i: any) => i.frontmatter.title),
      ["first", "second", "third", "unweighted"],
    );
  });
});

describe("PricingTier data integrity", () => {
  it("every tier has the required shape and a non-empty feature list", () => {
    assert.ok(PricingTier.length > 0);
    for (const tier of PricingTier) {
      assert.ok(tier.name, "tier is missing a name");
      assert.ok(tier.id, "tier is missing an id");
      assert.ok(Array.isArray(tier.features));
      assert.ok(tier.features.length > 0, `${tier.name} has no features`);
      assert.ok(
        tier.priceId && Object.keys(tier.priceId).length > 0,
        `${tier.name} has no priceId mapping`,
      );
    }
  });

  it("has exactly one featured tier", () => {
    const featured = PricingTier.filter((t) => t.featured);
    assert.strictEqual(featured.length, 1);
  });
});
