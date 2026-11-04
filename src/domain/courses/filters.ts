/** Pure parsing for untrusted public search parameters. */
export type CourseLevel = "OAS" | "MAS" | "DAS";
export type CourseFilters = { level: CourseLevel | null; semester: number | null };

export function parseCourseFilters(input: { level?: string; semester?: string }): CourseFilters {
  const level = input.level === "OAS" || input.level === "MAS" || input.level === "DAS"
    ? input.level
    : null;
  const semester = /^[1-8]$/.test(input.semester ?? "") ? Number(input.semester) : null;
  return { level, semester };
}
