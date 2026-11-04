import { describe, expect, it } from "vitest";
import { isLoginBlocked, LOGIN_WINDOW_MS, MAX_LOGIN_FAILURES } from "./login-policy";

describe("account login throttling policy", () => {
  const now = new Date("2026-11-04T12:00:00.000Z");
  it("blocks after five failures while the window is open", () => {
    expect(isLoginBlocked(MAX_LOGIN_FAILURES, new Date(now.getTime() + LOGIN_WINDOW_MS), now)).toBe(true);
  });
  it("does not block before the threshold", () => {
    expect(isLoginBlocked(MAX_LOGIN_FAILURES - 1, new Date(now.getTime() + LOGIN_WINDOW_MS), now)).toBe(false);
  });
  it("unblocks when the window expires", () => {
    expect(isLoginBlocked(MAX_LOGIN_FAILURES, now, now)).toBe(false);
  });
});
