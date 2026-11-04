/** Shared category vocabulary. Keep in sync with Prisma's MaterialKind enum. */
export const materialKinds = ["LECTURE", "EXERCISE", "LAB", "EXAM", "OTHER"] as const;
export type MaterialKind = (typeof materialKinds)[number];

export const materialKindLabels: Record<MaterialKind, string> = {
  LECTURE: "Predavanja",
  EXERCISE: "Vežbe",
  LAB: "Laboratorijske vežbe",
  EXAM: "Ispitni materijali",
  OTHER: "Ostalo",
};

export function groupMaterialsByKind<T extends { kind: MaterialKind }>(
  materials: readonly T[],
): Array<{ kind: MaterialKind; label: string; items: T[] }> {
  return materialKinds.map((kind) => ({
    kind,
    label: materialKindLabels[kind],
    items: materials.filter((material) => material.kind === kind),
  })).filter((group) => group.items.length > 0);
}
