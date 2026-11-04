import { describe, expect, it } from "vitest";
import { materialInput, materialEditInput } from "./validation";

describe("external material validation", () => {
  const valid = { courseId: "course12345", title: "Vežbe 2026", url: "https://example.org/files/test.pdf" };
  it("accepts HTTPS material links", () => {
    expect(materialInput.safeParse(valid).success).toBe(true);
    expect(materialEditInput.safeParse({ materialId: "material1234", title: valid.title, url: valid.url }).success).toBe(true);
  });
  it("rejects HTTP, JavaScript and embedded login credentials", () => {
    for (const url of ["http://example.org/x", "javascript:alert(1)", "https://user:password@example.org/path"]) {
      expect(materialInput.safeParse({ ...valid, url }).success).toBe(false);
    }
  });
});
