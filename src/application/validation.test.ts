import { describe, expect, it } from "vitest";
import { passwordChangeInput } from "./validation";

describe("password change input", () => {
  const valid = { currentPassword: "old-password-123", newPassword: "new-long-password-123", confirmPassword: "new-long-password-123" };
  it("accepts confirmed strong-length passwords", () => {
    expect(passwordChangeInput.safeParse(valid).success).toBe(true);
  });
  it("rejects mismatched and reused passwords", () => {
    expect(passwordChangeInput.safeParse({ ...valid, confirmPassword: "wrong-password-123" }).success).toBe(false);
    expect(passwordChangeInput.safeParse({ ...valid, newPassword: valid.currentPassword, confirmPassword: valid.currentPassword }).success).toBe(false);
    expect(passwordChangeInput.safeParse({ ...valid, newPassword: "short", confirmPassword: "short" }).success).toBe(false);
  });
});
