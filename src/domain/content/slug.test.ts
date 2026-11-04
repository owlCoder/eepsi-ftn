import { describe, expect, it } from "vitest";
import { toSlug } from "./slug";

describe("toSlug", () => {
  it("normalizes Serbian words and punctuation", () => {
    expect(toSlug("Elektroenergetika i Đaci!")).toBe("elektroenergetika-i-djaci");
  });
  it("has a safe fallback", () => {
    expect(toSlug("!?")).toBe("stavka");
  });
});
