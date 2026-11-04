import { describe, expect, it } from "vitest";
import { groupMaterialsByKind, materialKinds, materialKindLabels } from "./material-kinds";

describe("material organization", () => {
  it("keeps a stable academic ordering and drops empty sections", () => {
    const materials = [
      { id: "1", kind: "OTHER" as const },
      { id: "2", kind: "LECTURE" as const },
      { id: "3", kind: "EXERCISE" as const },
      { id: "4", kind: "LECTURE" as const },
    ];
    const groups = groupMaterialsByKind(materials);
    expect(groups.map((group) => group.kind)).toEqual(["LECTURE", "EXERCISE", "OTHER"]);
    expect(groups[0]?.items.map((item) => item.id)).toEqual(["2", "4"]);
    expect(groupMaterialsByKind([])).toEqual([]);
  });
  it("has a label for every persisted kind", () => {
    expect(materialKinds.every((kind) => Boolean(materialKindLabels[kind]))).toBe(true);
  });
});
