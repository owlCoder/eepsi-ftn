import { test, expect, type Page } from "@playwright/test";
import { createHmac, randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../src/generated/prisma/client";

const password = process.env.E2E_TEST_PASSWORD || "";
const marker = randomUUID().replaceAll("-", "").slice(0, 12);
const title = "E2E Browser Course " + marker;
const code = "E2E-" + marker.slice(0, 8).toUpperCase();
const newsTitle = "E2E vest " + marker;

type TestIdentity = { id: string; email: string; name: string };
let db: PrismaClient | undefined;
let admin: TestIdentity;
let professor: TestIdentity;
let student: TestIdentity;
let course: { id: string; slug: string };

function assertDisposableEnvironment() {
  const host = process.env.DATABASE_HOST;
  const name = process.env.DATABASE_NAME;
  if (process.env.E2E_TEST_MODE !== "true" ||
      process.env.NEXTAUTH_URL !== "http://localhost:3000" ||
      (host !== "127.0.0.1" && host !== "localhost") ||
      !name || !/^eepsi(_[a-z0-9_]+)?$/.test(name) ||
      password.length < 20 || !process.env.NEXTAUTH_SECRET) {
    throw new Error("E2E tests require explicit local-only disposable DB settings and a synthetic password.");
  }
}

async function login(page: Page, email: string) {
  await page.goto("/prijava");
  await page.getByLabel("Email adresa").fill(email);
  await page.getByLabel("Lozinka").fill(password);
  await page.getByRole("button", { name: /Prijavi se/i }).click();
  await expect(page).toHaveURL(/\/admin(?:\/|$|\?)/, { timeout: 20_000 });
}

test.describe("EEPSI browser flows (disposable synthetic accounts)", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    assertDisposableEnvironment();
    db = new PrismaClient({ adapter: new PrismaMariaDb({
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT || "3306"),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      connectionLimit: 3,
    }) });
    const passwordHash = await hash(password, 12);
    admin = await db.user.create({
      data: { email: "e2e-admin-" + marker + "@example.invalid", name: "E2E Admin " + marker, passwordHash, role: "SUPER_ADMIN" },
      select: { id: true, email: true, name: true },
    });
    professor = await db.user.create({
      data: { email: "e2e-prof-" + marker + "@example.invalid", name: "E2E Profesor " + marker, passwordHash, role: "PROFESSOR" },
      select: { id: true, email: true, name: true },
    });
    student = await db.user.create({
      data: { email: "e2e-student-" + marker + "@example.invalid", name: "E2E Student " + marker, passwordHash, role: "STUDENT" },
      select: { id: true, email: true, name: true },
    });
    course = await db.course.create({
      data: {
        slug: "e2e-" + marker,
        code,
        title,
        description: "Sintetički predmet samo za izolovano browser testiranje portala.",
        semester: 2,
        studyLevel: "OAS",
      },
      select: { id: true, slug: true },
    });
    await db.material.create({
      data: { courseId: course.id, title: "E2E predavanje " + marker, kind: "LECTURE", url: "https://example.invalid/e2e.pdf" },
    });
  });

  test.afterAll(async () => {
    if (!db) return;
    try {
      const identities = [admin, professor, student].filter(Boolean);
      const ids = identities.map((person) => person.id);
      if (ids.length) {
        await db.auditLog.deleteMany({ where: { actorId: { in: ids } } });
        const keys = identities.map((person) =>
          createHmac("sha256", process.env.NEXTAUTH_SECRET!).update(person.email, "utf8").digest("hex"));
        await db.loginThrottle.deleteMany({ where: { key: { in: keys } } });
      }
      if (admin) await db.news.deleteMany({ where: { authorId: admin.id } });
      if (course) await db.course.deleteMany({ where: { id: course.id } });
      if (ids.length) await db.user.deleteMany({ where: { id: { in: ids } } });
    } finally {
      await db.$disconnect();
    }
  });

  test("admin assigns a professor to the course through the UI", async ({ page }) => {
    await login(page, admin.email);
    await page.goto("/admin/predmeti/" + course.id);
    await page.getByLabel("Email naloga").fill(professor.email);
    await page.getByLabel("Uloga na predmetu").selectOption("PROFESSOR");
    await page.getByRole("button", { name: "Dodeli predmet" }).click();
    await expect(page).toHaveURL(/team=updated/);
    await expect(page.getByText(professor.name, { exact: true })).toBeVisible();
  });

  test("guest sees course, categorized materials, staff and filters without emails", async ({ page }) => {
    await page.goto("/predmeti?q=" + encodeURIComponent(code) + "&level=OAS&semester=2");
    await expect(page.getByText(title, { exact: true })).toBeVisible();

    await page.goto("/predmeti/" + course.slug);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Predavanja" })).toBeVisible();
    await expect(page.getByRole("link", { name: "E2E predavanje " + marker })).toBeVisible();

    await page.goto("/nastavnici");
    await expect(page.getByRole("heading", { name: professor.name })).toBeVisible();
    await expect(page.locator("body")).not.toContainText(professor.email);

    await page.goto("/novosti?q=" + marker);
    await expect(page.getByText(newsTitle, { exact: true })).toHaveCount(0);
  });

  test("a guest reaches news and course materials directly from student navigation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const studentNav = page.getByRole("navigation", { name: "Brzi pristup studentima" });
    await expect(studentNav.getByRole("link", { name: "Predmeti" })).toBeVisible();
    await expect(studentNav.getByRole("link", { name: "Obaveštenja" })).toBeVisible();

    await studentNav.getByRole("link", { name: "Obaveštenja" }).click();
    await expect(page).toHaveURL(/\/novosti$/);
    await expect(page.getByRole("heading", { name: "Obaveštenja", exact: true })).toBeVisible();

    await studentNav.getByRole("link", { name: "Predmeti" }).click();
    await expect(page.getByRole("heading", { name: "Katalog predmeta" })).toBeVisible();
    await page.getByLabel("Naziv ili šifra predmeta").fill(code);
    await page.getByRole("button", { name: "Prikaži" }).click();
    await expect(page.getByRole("link", { name: title, exact: true })).toBeVisible();
    await page.getByRole("link", { name: /Materijali \(1\)/ }).click();
    await expect(page).toHaveURL(new RegExp("/predmeti/" + course.slug + "#materijali"));
    await expect(page.getByRole("heading", { name: "Nastavni materijali" })).toBeVisible();
    await expect(page.getByRole("link", { name: "E2E predavanje " + marker })).toBeVisible();
  });

  test("student cannot access the protected administration", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/prijava(?:\?|$)/);

    await login(page, student.email);
    await page.goto("/admin/korisnici");
    await expect(page.getByRole("heading", { name: "Korisnici i RBAC" })).toHaveCount(0);
    await expect(page.getByText("Upravljanje pristupom")).toHaveCount(0);
  });

  test("assigned professor can edit course materials but not manage users", async ({ page }) => {
    await login(page, professor.email);
    await page.goto("/admin/predmeti/" + course.id);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();

    // Open a second tab before saving to check that stale editors cannot overwrite changes.
    const staleTab = await page.context().newPage();
    await staleTab.goto("/admin/predmeti/" + course.id);
    const details = page.locator("details").filter({ hasText: "Uredi naziv ili link" }).first();
    await details.locator("summary").click();
    await details.locator('select[name="kind"]').selectOption("EXERCISE");
    await details.getByRole("button", { name: "Sačuvaj materijal" }).click();
    await expect(page).toHaveURL(/material=updated/);

    const staleDetails = staleTab.locator("details").filter({ hasText: "Uredi naziv ili link" }).first();
    await staleDetails.locator("summary").click();
    await staleDetails.locator('select[name="kind"]').selectOption("LAB");
    await staleDetails.getByRole("button", { name: "Sačuvaj materijal" }).click();
    await expect(staleTab).toHaveURL(/material=conflict/);
    await expect(staleTab.getByRole("alert").filter({ hasText: "Zastarela verzija nije sačuvana" })).toBeVisible();
    await staleTab.close();

    await page.goto("/predmeti/" + course.slug);
    await expect(page.getByRole("heading", { name: "Vežbe", exact: true })).toBeVisible();

    await page.goto("/admin/predmeti/" + course.id);
    const staleCourseTab = await page.context().newPage();
    await staleCourseTab.goto("/admin/predmeti/" + course.id);
    await page.locator('#podaci-predmeta textarea[name="description"]').fill("Ažurirani opis sintetičkog predmeta sa novim informacijama.\nDrugi pasus opisa.");
    await page.locator("#podaci-predmeta").getByRole("button", { name: "Sačuvaj izmene" }).click();
    await expect(page).toHaveURL(/saved=1/);
    // The next save must recognize the same multi-paragraph original text.
    await page.locator('#podaci-predmeta textarea[name="description"]').fill("Ponovo ažuriran opis sintetičkog predmeta.\nDodatna uputstva za nastavu.");
    await page.locator("#podaci-predmeta").getByRole("button", { name: "Sačuvaj izmene" }).click();
    await expect(page).toHaveURL(/saved=1/);
    await staleCourseTab.locator('#podaci-predmeta textarea[name="description"]').fill("Zastareli opis koji ne sme da pregazi nove podatke predmeta.");
    await staleCourseTab.locator("#podaci-predmeta").getByRole("button", { name: "Sačuvaj izmene" }).click();
    await expect(staleCourseTab).toHaveURL(/error=stale/);
    await expect(staleCourseTab.getByRole("alert").filter({ hasText: "zastarela verzija nije sačuvana" })).toBeVisible();
    await staleCourseTab.close();

    await page.goto("/admin/korisnici");
    await expect(page.getByRole("heading", { name: "Korisnici i RBAC" })).toHaveCount(0);
  });

  test("admin creates a draft, then publishes the news through the UI", async ({ page }) => {
    await login(page, admin.email);
    await page.goto("/admin/novosti");
    await page.getByLabel("Naslov").fill(newsTitle);
    await page.getByLabel("Kratak opis").fill("Sintetička test novost za proveru objavljivanja u browseru.");
    await page.getByLabel("Tekst novosti").fill("Ovo je sintetički sadržaj E2E testa za validaciju nacrta, objave i javnog prikaza na portalu.");
    await page.getByRole("button", { name: "Sačuvaj nacrt" }).click();
    await expect(page).toHaveURL(/\/admin\/novosti\/[^/?]+/);

    const editUrl = page.url();
    await expect(page.getByText("Status: Nacrt")).toBeVisible();
    await page.goto("/novosti?q=" + marker);
    await expect(page.getByText(newsTitle, { exact: true })).toHaveCount(0);

    await page.goto(editUrl);
    const staleEditor = await page.context().newPage();
    await staleEditor.goto(editUrl);
    const stalePublishTab = await page.context().newPage();
    await stalePublishTab.goto(editUrl);
    await page.getByRole("button", { name: "Objavi sada" }).click();
    await expect(page).toHaveURL(/\/admin\/novosti(?:\?|$)/);

    // Editing an old browser tab after another editor's publication must not overwrite it.
    await staleEditor.getByLabel("Opis").fill("Zastareli opis koji ne sme da pregazi objavljenu novost.");
    await staleEditor.getByRole("button", { name: "Sačuvaj izmene" }).click();
    await expect(staleEditor).toHaveURL(/error=stale/);
    await expect(staleEditor.getByRole("alert").filter({ hasText: "zastarela verzija nije sačuvana" })).toBeVisible();
    await staleEditor.close();

    // An old "Publish" button must not unpublish a story already published in another tab.
    await stalePublishTab.getByRole("button", { name: "Objavi sada" }).click();
    await expect(stalePublishTab).toHaveURL(/unchanged=1/);
    await stalePublishTab.close();

    await page.goto("/novosti?q=" + marker);
    await expect(page.getByRole("heading", { name: newsTitle })).toBeVisible();

    // The same editor flow verifies the confirmation dialog and public removal.
    await page.goto(editUrl);
    const deleteTrigger = page.getByRole("button", { name: "Trajno obriši", exact: true });
    const deleteDialog = page.getByRole("dialog", { name: "Potvrdite brisanje" });
    await deleteTrigger.click();
    await expect(deleteDialog).toBeVisible();
    const cancelDelete = deleteDialog.getByRole("button", { name: "Odustani" });
    await expect(cancelDelete).toBeFocused();

    // Neither Escape nor the Cancel button may submit the destructive form.
    await page.keyboard.press("Escape");
    await expect(deleteDialog).toBeHidden();
    await expect(deleteTrigger).toBeFocused();
    await deleteTrigger.click();
    await expect(cancelDelete).toBeFocused();
    await cancelDelete.click();
    await expect(deleteDialog).toBeHidden();

    await page.goto("/novosti?q=" + marker);
    await expect(page.getByRole("heading", { name: newsTitle })).toBeVisible();
    await page.goto(editUrl);
    await deleteTrigger.click();
    await deleteDialog.getByRole("button", { name: "Potvrdi brisanje" }).click();
    await expect(page).toHaveURL(/\/admin\/novosti\?deleted=1/);
    await page.goto("/novosti?q=" + marker);
    await expect(page.getByRole("heading", { name: newsTitle })).toHaveCount(0);
  });

  test("revoking a professor's course assignment invalidates their existing JWT", async ({ page, browser }) => {
    const oldContext = await browser.newContext();
    try {
      const professorPage = await oldContext.newPage();
      await login(professorPage, professor.email);
      await professorPage.goto("/admin/predmeti/" + course.id);
      await expect(professorPage.getByRole("heading", { name: title })).toBeVisible();

      await login(page, admin.email);
      await page.goto("/admin/predmeti/" + course.id);
      await page.getByRole("button", { name: "Ukloni angažovanje" }).click();
      const revokeDialog = page.getByRole("dialog", { name: "Potvrdite uklanjanje angažovanja" });
      await expect(revokeDialog).toBeVisible();
      await revokeDialog.getByRole("button", { name: "Ukloni angažovanje" }).click();
      await expect(page).toHaveURL(/team=updated/);

      await professorPage.goto("/admin/predmeti/" + course.id);
      await expect(professorPage).toHaveURL(/\/prijava(?:\?|$)/);
      await page.goto("/nastavnici");
      await expect(page.getByRole("heading", { name: professor.name })).toHaveCount(0);
    } finally {
      await oldContext.close();
    }
  });

  test("account permissions are only saved after an explicit change and confirmation", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page, admin.email);
    await page.goto("/admin/korisnici?q=" + encodeURIComponent(student.email));

    const accessForm = page.locator('form:has(select[name="active"]):has(input[name="id"][value="' + student.id + '"])');
    const save = accessForm.getByRole("button", { name: "Sačuvaj" });
    await expect(save).toBeDisabled();
    await accessForm.getByLabel("Status za " + student.name).selectOption("false");
    await expect(save).toBeEnabled();

    await save.click();
    const dialog = page.getByRole("dialog", { name: "Potvrdite promenu pristupa" });
    await expect(dialog.getByRole("button", { name: "Odustani" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    // The staged change must not be persisted after cancelling the modal.
    await page.reload();
    await expect(accessForm.getByLabel("Status za " + student.name)).toHaveValue("true");
    await expect(save).toBeDisabled();

    // Administration should remain within the phone viewport, including edit forms.
    for (const route of ["/admin", "/admin/predmeti", "/admin/predmeti/" + course.id, "/admin/novosti", "/admin/korisnici", "/admin/profil"]) {
      await page.goto(route);
      const dimensions = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(dimensions.content, `Horizontal overflow on ${route}`).toBeLessThanOrEqual(dimensions.viewport);
    }
  });

  test("password rotation invalidates other sessions and old credentials", async ({ page, browser }) => {
    const previousContext = await browser.newContext();
    const updatedPassword = password + "-rotated";
    try {
      const otherSession = await previousContext.newPage();
      await login(otherSession, admin.email);
      await login(page, admin.email);

      await page.goto("/admin/profil");
      await expect(page.getByRole("heading", { name: "Moj profil" })).toBeVisible();
      await expect(page.getByLabel("Nova lozinka", { exact: true })).toHaveAttribute("aria-describedby", "password-requirements");
      await expect(page.getByLabel("Ponovite novu lozinku")).toHaveAttribute("aria-describedby", "password-requirements");
      await expect(page.locator("#password-requirements")).toContainText("najmanje 12 karaktera");

      await page.getByLabel("Trenutna lozinka").fill(password);
      await page.getByLabel("Nova lozinka", { exact: true }).fill(updatedPassword);
      await page.getByLabel("Ponovite novu lozinku").fill(updatedPassword + "-different");
      await page.getByRole("button", { name: "Promeni lozinku" }).click();
      await expect(page.locator('form [role="alert"]')).toContainText("Nove lozinke se ne poklapaju.");

      // A rejected form must remain usable for a corrected, successful submission.
      await page.getByLabel("Trenutna lozinka").fill(password);
      await page.getByLabel("Nova lozinka", { exact: true }).fill(updatedPassword);
      await page.getByLabel("Ponovite novu lozinku").fill(updatedPassword);
      await page.getByRole("button", { name: "Promeni lozinku" }).click();
      await expect(page).toHaveURL(/\/prijava(?:\?|$)/, { timeout: 20_000 });

      await otherSession.goto("/admin");
      await expect(otherSession).toHaveURL(/\/prijava(?:\?|$)/);

      await page.goto("/prijava");
      await page.getByLabel("Email adresa").fill(admin.email);
      await page.getByLabel("Lozinka").fill(password);
      await page.getByRole("button", { name: /Prijavi se/i }).click();
      await expect(page.locator('form [role="alert"]')).toContainText("Pogrešna");

      await page.getByLabel("Lozinka").fill(updatedPassword);
      await page.getByRole("button", { name: /Prijavi se/i }).click();
      await expect(page).toHaveURL(/\/admin(?:\/|$|\?)/);
    } finally {
      await previousContext.close();
    }
  });

  test("mobile menu and public course filters work at phone width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const mobileMenu = page.locator("header details");
    const menuToggle = mobileMenu.locator("summary");
    await expect(menuToggle).toHaveAttribute("aria-label", "Otvori meni");
    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute("aria-label", "Zatvori meni");

    // Escape closes the panel and restores keyboard focus to its trigger.
    await page.keyboard.press("Escape");
    await expect(mobileMenu).not.toHaveAttribute("open", "");
    await expect(menuToggle).toBeFocused();
    await expect(menuToggle).toHaveAttribute("aria-label", "Otvori meni");

    // Tapping outside should also dismiss it without changing the route.
    await menuToggle.click();
    await page.locator(".site-institution").click();
    await expect(mobileMenu).not.toHaveAttribute("open", "");
    await menuToggle.click();
    await expect(mobileMenu.getByRole("link", { name: "Predmeti" })).toBeVisible();
    await mobileMenu.getByRole("link", { name: "Predmeti" }).click();
    await expect(page.getByRole("heading", { name: "Katalog predmeta" })).toBeVisible();

    // A fresh page load resets the expandable mobile navigation before using filters.
    await page.goto("/predmeti");
    await page.getByLabel("Nivo studija").selectOption("OAS");
    await page.getByLabel("Semestar").selectOption("2");
    await page.getByRole("button", { name: "Prikaži" }).click();
    await expect(page).toHaveURL(/level=OAS/);
    await expect(page).toHaveURL(/semester=2/);
    await expect(page.getByText(title, { exact: true })).toBeVisible();

    // Direct course lookup from the homepage and one-tap access to contact.
    await page.goto("/");
    await page.getByLabel("Naziv ili šifra predmeta").fill(title);
    await page.getByRole("button", { name: "Pretraži" }).click();
    await expect(page).toHaveURL(/\/predmeti\?q=/);
    await expect(page.getByText(title, { exact: true })).toBeVisible();

    await page.goto("/");
    await menuToggle.click();
    await mobileMenu.getByRole("link", { name: "Kontakt" }).click();
    await expect(page.locator("main").getByRole("heading", { name: "Kontakt", exact: true })).toBeVisible();
    await expect(page.locator("main").getByRole("link", { name: "eespsi@uns.ac.rs" })).toBeVisible();
  });

  test("public pages fit a 390px viewport without horizontal scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ["/", "/predmeti", "/nastavnici", "/novosti", "/kontakt", "/prijava", "/o-katedri"]) {
      await page.goto(route);
      const dimensions = await page.evaluate(() => ({
        content: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(dimensions.content, `Horizontal overflow on ${route}`).toBeLessThanOrEqual(dimensions.viewport);
    }
  });
});
