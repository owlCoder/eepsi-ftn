"use server";

import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/application/authorization";
import { passwordChangeInput, profileInput } from "@/application/validation";
import { db } from "@/infrastructure/db/prisma";
import { clearLoginFailures, isLoginThrottled, recordLoginFailure } from "@/infrastructure/auth/login-throttle";

type PasswordState = { status: "idle" | "error" | "success"; message: string };

export async function updateProfileAction(data: FormData) {
  const actor = await currentUser();
  if (!actor) redirect("/prijava");
  const { name } = profileInput.parse({ name: String(data.get("name") ?? "") });
  const originalName = String(data.get("originalName") ?? "");
  if (!originalName || originalName.length > 120) throw new Error("Neispravna verzija profila. Osvežite stranicu.");
  if (name === originalName) redirect("/admin/profil?unchanged=1");
  const updated = await db.$transaction(async (tx) => {
    const result = await tx.user.updateMany({
      where: { id: actor.id, active: true, sessionVersion: actor.sessionVersion, name: originalName },
      data: { name },
    });
    if (result.count !== 1) return false;
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "user.profile.update", subjectType: "User", subjectId: actor.id },
    });
    return true;
  });
  if (!updated) redirect("/admin/profil?stale=1");
  revalidatePath("/admin");
  revalidatePath("/admin/profil");
  revalidatePath("/nastavnici");
  revalidatePath("/predmeti/[slug]", "page");
  revalidatePath("/novosti/[slug]", "page");
  redirect("/admin/profil?updated=1");
}

export async function changePasswordAction(_state: PasswordState, data: FormData): Promise<PasswordState> {
  const actor = await currentUser();
  if (!actor) return { status: "error", message: "Sesija je istekla. Prijavite se ponovo." };

  const parsed = passwordChangeInput.safeParse({
    currentPassword: String(data.get("currentPassword") ?? ""),
    newPassword: String(data.get("newPassword") ?? ""),
    confirmPassword: String(data.get("confirmPassword") ?? ""),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Proverite unete lozinke." };

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return { status: "error", message: "Promena lozinke trenutno nije dostupna." };
  if (await isLoginThrottled(actor.email, secret)) {
    return { status: "error", message: "Previše pokušaja. Pokušajte ponovo za 15 minuta." };
  }

  const saved = await db.user.findUnique({
    where: { id: actor.id },
    select: { passwordHash: true, active: true, sessionVersion: true },
  });
  if (!saved?.active || saved.sessionVersion !== actor.sessionVersion) {
    return { status: "error", message: "Sesija je istekla. Prijavite se ponovo." };
  }
  if (!(await compare(parsed.data.currentPassword, saved.passwordHash))) {
    await recordLoginFailure(actor.email, secret);
    return { status: "error", message: "Trenutna lozinka nije ispravna." };
  }

  const passwordHash = await hash(parsed.data.newPassword, 12);
  const result = await db.$transaction(async (tx) => {
    const updated = await tx.user.updateMany({
      where: {
        id: actor.id,
        active: true,
        sessionVersion: actor.sessionVersion,
        passwordHash: saved.passwordHash,
      },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    });
    if (updated.count !== 1) return false;
    await tx.auditLog.create({
      data: { actorId: actor.id, action: "user.password.change", subjectType: "User", subjectId: actor.id },
    });
    return true;
  });
  if (!result) return { status: "error", message: "Nalog je u međuvremenu izmenjen. Prijavite se ponovo." };
  await clearLoginFailures(actor.email, secret);
  return { status: "success", message: "Lozinka je promenjena. Preusmeravamo vas na ponovnu prijavu." };
}
