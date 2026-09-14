import readingTime from "@/lib/utils/readingTime";
import similarItems from "@/lib/utils/similarItems";
import taxonomyFilter from "@/lib/utils/taxonomyFilter";
import { TPost } from "@/types";
import assert from "node:assert";
import { describe, it } from "vitest";

const makePost = (
  slug: string,
  categories: string[],
  tags: string[],
): TPost => ({
  frontmatter: {
    title: slug,
    categories,
    author: "Jane Doe",
    tags,
  },
  slug,
});

describe("similarItems", () => {
  const current = makePost("current", ["news"], ["react"]);
  const all: TPost[] = [
    current,
    makePost("shares-category", ["news"], ["vue"]),
    makePost("shares-tag", ["life"], ["react"]),
    makePost("unrelated", ["life"], ["vue"]),
  ];

  it("returns posts sharing a category or a tag, excluding the current post itself", () => {
    const result = similarItems(current, all, "current");
    const slugs = result.map((p) => p.slug);
    assert.ok(slugs.includes("shares-category"));
    assert.ok(slugs.includes("shares-tag"));
    assert.ok(!slugs.includes("unrelated"));
    assert.ok(!slugs.includes("current"));
  });

  it("returns an empty list when nothing else shares a category or tag", () => {
    const lonely = makePost("lonely", ["solo-category"], ["solo-tag"]);
    const result = similarItems(lonely, [lonely, ...all], "lonely");
    assert.deepStrictEqual(result, []);
  });
});

describe("taxonomyFilter", () => {
  const posts: TPost[] = [
    makePost("post-a", ["Web Development"], []),
    makePost("post-b", ["Design"], []),
    makePost("post-c", ["Web Development", "Design"], []),
  ];

  it("filters posts whose slugified category matches the given key", () => {
    const result = taxonomyFilter(posts, "categories", "web-development");
    const slugs = result.map((p) => p.slug);
    assert.deepStrictEqual(slugs.sort(), ["post-a", "post-c"]);
  });
});

describe("readingTime", () => {
  it("rounds up to at least 1 minute for very short content", () => {
    assert.strictEqual(readingTime("just a few words here"), "01 Min read");
  });

  it("pluralizes minutes for content longer than a minute", () => {
    const words = new Array(600).fill("word").join(" ");
    const result = readingTime(words);
    assert.ok(result.endsWith("Mins read"));
    assert.ok(!result.startsWith("00"));
  });

  it("counts embedded images toward the read time", () => {
    const withImages = `${new Array(50).fill("word").join(" ")} <img src="a.png"> <img src="b.png">`;
    const withoutImages = new Array(50).fill("word").join(" ");
    const withImagesMinutes = parseInt(readingTime(withImages), 10);
    const withoutImagesMinutes = parseInt(readingTime(withoutImages), 10);
    assert.ok(withImagesMinutes >= withoutImagesMinutes);
  });
});
