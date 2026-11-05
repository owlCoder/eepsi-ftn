# AGENTS.md — EEPSI FTN contributor instructions

This file is guidance for AI coding agents and human contributors working in this repository. Follow it alongside the existing code, CI, and security requirements. **The repository is public.**

## Project goals

Build a maintainable, accessible, high-performance academic portal for the Faculty of Technical Sciences (Novi Sad), with Serbian-language UI, robust role-based access control (RBAC), and MySQL persistence.

- Use the latest **stable, mutually compatible** dependencies. Avoid prereleases unless explicitly approved.
- Dependabot opens update PRs weekly. Review major version migrations and require green CI; never blindly merge major upgrades.
- Preserve the Clean Architecture boundary and SOLID principles; prefer focused, testable changes.
- Do not claim an implementation is production-ready merely because it builds.
- Keep public-facing copy accurate. Never invent real faculty, course, contact, or student details.
- The public teaching-staff directory displays **only active assigned professors/assistants**; never expose their login email addresses in public queries or UI.

## Architecture and module boundaries

```text
src/domain/          Pure policies, types and business rules — no Next.js, Prisma or I/O
src/application/     Use-case orchestration, validation and authorization gates
src/infrastructure/  Prisma / MySQL, auth providers, data access and external adapters
src/app/             Next.js App Router pages, handlers and server actions
src/components/      Reusable presentation components (server-first)
src/lib/             Small framework-agnostic utilities
prisma/              Schema, versioned migrations and explicit seed scripts
```

- Keep domain functions deterministic; add Vitest tests for each meaningful rule change.
- Keep database queries inside infrastructure (or migrate them there as code is touched); application services coordinate use cases.
- Prefer Server Components; use `"use client"` only for browser-dependent behavior.
- Server Actions/route handlers are entry points, **not** authorization boundaries by themselves.

## RBAC — mandatory invariants

Global roles: `SUPER_ADMIN`, `EDITOR`, `PROFESSOR`, `ASSISTANT`, `STUDENT`.

- `SUPER_ADMIN`: all content and user management.
- `EDITOR`: news publish/edit; course create/edit and material manage; **not** user/role management.
- `PROFESSOR`: edit courses and materials **only where assigned as PROFESSOR**.
- `ASSISTANT`: create/manage materials **only where assigned as ASSISTANT**.
- `STUDENT`: public content only.

**Every privileged write must call `requirePermission` (or equivalent) on the server, before mutation.** For scoped writes, derive the course ID from validated inputs and re-check `CourseMembership` against the database. Never trust client-side hidden inputs, JWT role claims, UI visibility or browser routes as proof of permission. Re-read active user status **and current `sessionVersion`** on the server. Password and access changes MUST increment the version to invalidate all preexisting JWT sessions; never let stale sessions preserve permissions.

Protect `SUPER_ADMIN` accounts from editing via ordinary admin forms. Revoke obsolete course memberships when user roles change or users are disabled. Treat concurrent role changes and content mutations as security-sensitive; use transactions where appropriate.

## Database and migrations

- MySQL 8+ through Prisma and `@prisma/adapter-mariadb`.
- All schema changes require a **committed** SQL migration in `prisma/migrations`. Never edit an applied migration.
- Preserve referential integrity, add indexes for filtering/order-by queries, and use `select` to avoid unnecessary data transfer.
- Material category enum must remain consistent across Prisma schema, SQL migration, `domain/content/material-kinds.ts`, and Zod validation. Do not modify an applied migration; create another migration instead.
- Use `npm run db:deploy` for reproducible schema setup; migrations must pass in GitHub Actions.
- Seeds may create an admin only with explicit environment variables. Never add default, hard-coded or sample production passwords.

## Security and privacy

- **Never commit** secrets, real `.env` files, DB dumps, session cookies, access tokens, API keys, personal information or private academic materials.
- Store only safe placeholders in `.env.example`; no sensitive values in logs or audit metadata.
- Validate input with Zod; use explicit `https:` URL schemes for external materials, and safe output encoding.
- Hash passwords with bcrypt; use verified auth sessions for all writes.
- Treat uploaded/user-authored text as untrusted. Do not render HTML from stored text without a reviewed sanitizer.
- Protect login against brute-force abuse. DB-backed per-active-account throttling is present; unknown emails must not create unbounded DB records. Production additionally requires edge/IP rate limiting.
- Privileged content and user mutations must append an audit record **in the same database transaction**. Never log secrets or private content.
- Minimize user data in public pages, logs and error responses.
- Never broaden privileges to make tests pass.

## Session and material safety

- Session authorization must compare the JWT login revision with current `User.sessionVersion`. Password changes, deactivation and role updates invalidate existing revisions.
- A material's parent course ID must come from the database on edit/delete, not from untrusted hidden fields. Keep audit writes atomic with mutations.
- Local MySQL runs via `compose.yaml` bound only to loopback; never expose development credentials publicly.

## Performance, accessibility, UX

- Use Server Components and small client-side islands.
- Select only required database fields; paginate lists; index frequently used filters.
- Keep public pages cacheable with safe revalidation when possible. After writes, invalidate affected routes.
- Support keyboard navigation, semantic headings, accessible labels, and mobile layouts.
- User-facing UI text is Serbian (Latin script); documentation may be in Serbian/English.

## EEPSI academic UI standard (November 2026)

The interface is a modern academic information portal. The design and sitemap are documented in docs/ACADEMIC_REDESIGN.md.

- Use one sober academic accent (#173b63 navy) with white, #f5f7fa backgrounds and gray text/lines. Use green and red only for semantic success, errors, or destructive actions.
- Prefer readable sans-serif UI and headings. Do not introduce multicolor layouts, copper accents, serif slogans, technical network illustrations, gradients, floating panels or decorative icon bubbles.
- Prioritize **Predmeti, Nastavno osoblje, Obaveštenja, Kontakt**. Keep the search for courses prominent on the homepage and preserve the direct-contact route.
- Build for scanning: short labels, descriptive links, direct routes, lists/tables with visible metadata, coherent breadcrumbs and usable filters. Do not invent institutional information or metrics.
- Public content remains readable without login; personal and administrative actions remain behind current RBAC. Public staff pages never expose login email addresses.
- Maintain mobile and keyboard access, labels, focus states, accessible menus and confirmation dialogs. Keep existing user flows and Playwright tests working.
- Centralize CSS rules in src/app/globals.css, reuse site primitives (page-banner, card-surface, input-field, btn, admin-panel) and avoid accumulating conflicting overrides.

## Quality bar

Run these checks locally or verify their success in GitHub Actions:

```bash
npm install
npx prisma validate
npm run db:deploy
npm run typecheck
npm run lint
npm test
npm run test:integration # requires migrated MySQL
npm run build
```

- Prefer small, logically grouped commits with explanatory commit messages.
- Update tests when changing permissions, validators or user flows.
- Update `README.md`, `.env.example` and migrations when setup changes.
- When using a public repository, do not push sample data that resembles real private student/employee records.
- If a check fails, inspect logs, fix the root cause, then verify the newest commit again. CI also boots the production server and smoke-tests public, auth and protected routes.

## Working on main

The project owner currently allows direct commits to `main`. Avoid force pushes, destructive rewrites and history resets. Check the latest remote head before updating a ref, and use compare-and-swap (`expected_sha`) when moving it. Prefer PRs for risky database/security refactors.

## Known scope

This is a newly built portal foundation, **not a verified migration of the original EEPSI website**. It currently supports public pages, authenticated administration, news, courses and material links. Production deployment, full historical content migration, backups, advanced asset storage, and independent accessibility/security audits require separate verification. Browser E2E tests already run in CI against disposable local MySQL.


- Assigning or removing course memberships must atomically bump the affected user's `sessionVersion` so existing JWTs cannot retain old assumptions about access scope.

## Browser E2E test isolation

- New browser tests live under `tests/e2e` and run with the stable Playwright test runner in Chromium. Always seed uniquely named synthetic `example.invalid` accounts on **loopback-only disposable MySQL**, never real accounts or production databases.
- Test setup must require `E2E_TEST_MODE=true`, local `NEXTAUTH_URL`, and an ephemeral password; reject unsafe environments before any database write.
- Cleanup E2E users, materials, news and audit rows in an `afterAll` hook. Do not log passwords.
- CI must perform a production build before browser tests. Browser tests complement, not replace, domain, integration and build checks.
