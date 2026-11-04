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

    const details = page.locator("details").filter({ hasText: "Uredi naziv ili link" }).first();
    await details.locator("summary").click();
    await details.locator('select[name="kind"]').selectOption("EXERCISE");
    await details.getByRole("button", { name: "Sačuvaj materijal" }).click();
    await expect(page).toHaveURL(/material=updated/);

    await page.goto("/predmeti/" + course.slug);
    await expect(page.getByRole("heading", { name: "Vežbe", exact: true })).toBeVisible();
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
    await page.getByRole("button", { name: "Objavi sada" }).click();
    await expect(page).toHaveURL(/\/admin\/novosti(?:\?|$)/);

    await page.goto("/novosti?q=" + marker);
    await expect(page.getByRole("heading", { name: newsTitle })).toBeVisible();
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
      await expect(page).toHaveURL(/team=updated/);

      await professorPage.goto("/admin/predmeti/" + course.id);
      await expect(professorPage).toHaveURL(/\/prijava(?:\?|$)/);
      await page.goto("/nastavnici");
      await expect(page.getByRole("heading", { name: professor.name })).toHaveCount(0);
    } finally {
      await oldContext.close();
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
      await expect(page.getByRole("alert")).toContainText("Pogrešna");

      await page.getByLabel("Lozinka").fill(updatedPassword);
      await page.getByRole("button", { name: /Prijavi se/i }).click();
      await expect(page).toHaveURL(/\/admin(?:\/|$|\?)/);
    } finally {
      await previousContext.close();
    }
  });
});
