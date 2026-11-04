import { describe, expect, it } from "vitest";
import { hasGlobalPermission, hasScopedPermission } from "./permissions";

describe("RBAC", () => {
  it("students cannot write or manage users", () => {
    expect(hasGlobalPermission("STUDENT", "news.write")).toBe(false);
    expect(hasGlobalPermission("STUDENT", "users.manage")).toBe(false);
  });
  it("editors cannot provision users", () => {
    expect(hasGlobalPermission("EDITOR", "news.publish")).toBe(true);
    expect(hasGlobalPermission("EDITOR", "users.manage")).toBe(false);
    expect(hasGlobalPermission("EDITOR", "materials.edit")).toBe(true);
  });
  it("only professors edit their own course", () => {
    expect(hasScopedPermission("PROFESSOR", "courses.edit", "PROFESSOR")).toBe(true);
    expect(hasScopedPermission("PROFESSOR", "courses.edit", null)).toBe(false);
    expect(hasScopedPermission("ASSISTANT", "courses.edit", "ASSISTANT")).toBe(false);
  });
  it("assistants can upload material only on assigned courses", () => {
    expect(hasScopedPermission("ASSISTANT", "materials.create", "ASSISTANT")).toBe(true);
    expect(hasScopedPermission("ASSISTANT", "materials.create", null)).toBe(false);
  });
  it("does not elevate a student even with an inconsistent membership", () => {
    expect(hasScopedPermission("STUDENT", "courses.edit", "PROFESSOR")).toBe(false);
    expect(hasScopedPermission("STUDENT", "materials.create", "ASSISTANT")).toBe(false);
  });
  it("scoped material deletion follows the same course membership permissions", () => {
    expect(hasScopedPermission("ASSISTANT", "materials.delete", "ASSISTANT")).toBe(true);
    expect(hasScopedPermission("ASSISTANT", "materials.delete", null)).toBe(false);
    expect(hasGlobalPermission("STUDENT", "materials.delete")).toBe(false);
  });
  it("editing a material is scoped to its assigned course", () => {
    expect(hasScopedPermission("ASSISTANT", "materials.edit", "ASSISTANT")).toBe(true);
    expect(hasScopedPermission("PROFESSOR", "materials.edit", "PROFESSOR")).toBe(true);
    expect(hasScopedPermission("ASSISTANT", "materials.edit", null)).toBe(false);
    expect(hasScopedPermission("STUDENT", "materials.edit", "ASSISTANT")).toBe(false);
  });
  it("super admins can do everything", () => {
    expect(hasGlobalPermission("SUPER_ADMIN", "users.manage")).toBe(true);
    expect(hasScopedPermission("SUPER_ADMIN", "materials.create", null)).toBe(true);
  });
});
