"use client";

import { useState } from "react";
import { updateUserAccessAction } from "@/app/actions/users";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { SubmitButton } from "@/components/submit-button";
import { roleLabels, type Role } from "@/domain/authorization/permissions";

type AccessRole = Exclude<Role, "SUPER_ADMIN">;
const editableRoles: AccessRole[] = ["STUDENT", "ASSISTANT", "PROFESSOR", "EDITOR"];

export function UserAccessForm({ id, name, initialRole, initialActive }: {
  id: string; name: string; initialRole: AccessRole; initialActive: boolean;
}) {
  const [role, setRole] = useState<AccessRole>(initialRole);
  const [active, setActive] = useState(initialActive);
  const changed = role !== initialRole || active !== initialActive;
  // Changing global roles or deactivating an account revokes all course assignments.
  const removesAssignments = role !== initialRole || !active;
  const needsConfirmation = changed && removesAssignments;

  return <form action={updateUserAccessAction} className="flex flex-wrap items-center gap-2">
    <input type="hidden" name="id" value={id}/>
    <input type="hidden" name="originalRole" value={initialRole}/>
    <input type="hidden" name="originalActive" value={String(initialActive)}/>
    <label htmlFor={"access-role-" + id} className="sr-only">Uloga za {name}</label>
    <select id={"access-role-" + id} name="role" value={role}
      onChange={(event) => setRole(event.target.value as AccessRole)}
      className="input-field !w-auto min-w-32 flex-1">
      {editableRoles.map((item) => <option key={item} value={item}>{roleLabels[item]}</option>)}
    </select>
    <label htmlFor={"access-status-" + id} className="sr-only">Status za {name}</label>
    <select id={"access-status-" + id} name="active" value={String(active)}
      onChange={(event) => setActive(event.target.value === "true")}
      className="input-field !w-auto min-w-28 flex-1">
      <option value="true">Aktivan</option>
      <option value="false">Neaktivan</option>
    </select>
    {needsConfirmation ?
      <ConfirmSubmitButton className="btn btn-light whitespace-nowrap"
        dialogTitle="Potvrdite promenu pristupa" confirmLabel="Primeni promenu"
        warning="Prethodne sesije korisnika biće opozvane. Uklonjena angažovanja potrebno je ponovo dodeliti."
        message={"Promeniti ulogu ili status naloga „" + name + "“? Promena globalne uloge ili deaktivacija uklanja postojeća angažovanja na predmetima."}>
        Sačuvaj
      </ConfirmSubmitButton>
      : <SubmitButton className="btn btn-light whitespace-nowrap" disabled={!changed}>Sačuvaj</SubmitButton>}
  </form>;
}
