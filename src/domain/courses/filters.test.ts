import { describe, expect, it } from "vitest";
import { parseCourseFilters } from "./filters";

describe("public course filters", () => {
  it("accepts supported levels and semesters", () => {
    expect(parseCourseFilters({ level: "MAS", semester: "4" })).toEqual({ level: "MAS", semester: 4 });
  });
  it("ignores invalid or manipulative values", () => {
    expect(parseCourseFilters({ level: "ALL", semester: "0" })).toEqual({ level: null, semester: null });
    expect(parseCourseFilters({ level: "OAS", semester: "01" })).toEqual({ level: "OAS", semester: null });
    expect(parseCourseFilters({ level: "DAS", semester: "4 OR 1=1" })).toEqual({ level: "DAS", semester: null });
  });
  it("supports empty query parameters", () => {
    expect(parseCourseFilters({})).toEqual({ level: null, semester: null });
  });
});
