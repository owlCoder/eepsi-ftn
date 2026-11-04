export const roles = ["SUPER_ADMIN", "EDITOR", "PROFESSOR", "ASSISTANT", "STUDENT"] as const;
export type Role = (typeof roles)[number];
export type Permission =
  | "news.write"
  | "news.publish"
  | "courses.create"
  | "courses.edit"
  | "materials.create"
  | "materials.delete"
  | "users.manage";

const grants: Record<Role, readonly Permission[]> = {
  SUPER_ADMIN: ["news.write", "news.publish", "courses.create", "courses.edit", "materials.create", "materials.delete", "users.manage"],
  EDITOR: ["news.write", "news.publish", "courses.create", "courses.edit", "materials.create", "materials.delete"],
  PROFESSOR: [],
  ASSISTANT: [],
  STUDENT: [],
};

export function hasGlobalPermission(role: Role, permission: Permission): boolean {
  return grants[role].includes(permission);
}

export function hasScopedPermission(
  role: Role,
  permission: Permission,
  courseMembershipRole: "PROFESSOR" | "ASSISTANT" | null,
): boolean {
  if (hasGlobalPermission(role, permission)) return true;
  if (permission === "courses.edit") return role === "PROFESSOR" && courseMembershipRole === "PROFESSOR";
  if (permission === "materials.create" || permission === "materials.delete") return (role === "PROFESSOR" && courseMembershipRole === "PROFESSOR") || (role === "ASSISTANT" && courseMembershipRole === "ASSISTANT");
  return false;
}

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super administrator",
  EDITOR: "Urednik",
  PROFESSOR: "Nastavnik",
  ASSISTANT: "Saradnik",
  STUDENT: "Student",
};
