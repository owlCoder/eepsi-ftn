import { describe, expect, it } from "vitest";
import { readPage } from "./pagination";

describe("readPage", () => {
  it("defaults malformed page numbers to page one", () => {
    expect(readPage(undefined)).toBe(1);
    expect(readPage("-1")).toBe(1);
    expect(readPage("NaN")).toBe(1);
    expect(readPage("3.5")).toBe(1);
  });
  it("accepts page numbers while bounding huge offsets", () => {
    expect(readPage("3")).toBe(3);
    expect(readPage("100000")).toBe(10000);
  });
});
