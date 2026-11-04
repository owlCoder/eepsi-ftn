import { describe, expect, it } from "vitest";
import { isSessionVersionCurrent } from "./session-policy";

describe("JWT revocation counter", () => {
  it("allows only current session revision", () => {
    expect(isSessionVersionCurrent(0, 0)).toBe(true);
    expect(isSessionVersionCurrent(3, 3)).toBe(true);
  });
  it("rejects any stale or missing session", () => {
    expect(isSessionVersionCurrent(1, 2)).toBe(false);
    expect(isSessionVersionCurrent(undefined, 0)).toBe(false);
    expect(isSessionVersionCurrent(-1, 0)).toBe(false);
    expect(isSessionVersionCurrent(1.5, 1)).toBe(false);
  });
});
