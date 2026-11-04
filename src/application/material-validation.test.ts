import { describe, expect, it } from "vitest";
import { materialInput, materialEditInput } from "./validation";

describe("external material validation", () => {
  const valid = { courseId: "course12345", title: "Vežbe 2026", url: "https://example.org/files/test.pdf" };
  it("accepts HTTPS material links", () => {
    const created = materialInput.parse(valid);
    expect(created.kind).toBe("OTHER");
    expect(materialInput.parse({ ...valid, kind: "LECTURE" }).kind).toBe("LECTURE");
    expect(materialEditInput.safeParse({ materialId: "material1234", title: valid.title, url: valid.url }).success).toBe(true);
  });
  it("rejects unknown material categories", () => {
    expect(materialInput.safeParse({ ...valid, kind: "PRIVATE" }).success).toBe(false);
    expect(materialEditInput.safeParse({ materialId: "material1234", ...valid, kind: "LECTURES" }).success).toBe(false);
  });
  it("rejects HTTP, JavaScript and embedded login credentials", () => {
    for (const url of ["http://example.org/x", "javascript:alert(1)", "https://user:password@example.org/path"]) {
      expect(materialInput.safeParse({ ...valid, url }).success).toBe(false);
    }
  });
});
