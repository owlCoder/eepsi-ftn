# AGENTS.md — EEPSI FTN contributor instructions

This file is guidance for AI coding agents and human contributors working in this repository. Follow it alongside the existing code, CI, and security requirements. **The repository is public.**

## Project goals

Build a maintainable, accessible, high-performance academic portal for the Faculty of Technical Sciences (Novi Sad), with Serbian-language UI, robust role-based access control (RBAC), and MySQL persistence.

- Use the latest **stable, mutually compatible** dependencies. Avoid prereleases unless explicitly approved.
- Dependabot opens update PRs weekly. Review major version migrations and require green CI; never blindly merge major upgrades.
- Preserve the Clean Architecture boundary and SOLID principles; prefer focused, testable changes.
- Do not claim an implementation is production-ready merely because it builds.
- Keep public-facing copy accurate. Never invent real faculty, course, contact, or student details.

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

## Performance, accessibility, UX

- Use Server Components and small client-side islands.
- Select only required database fields; paginate lists; index frequently used filters.
- Keep public pages cacheable with safe revalidation when possible. After writes, invalidate affected routes.
- Support keyboard navigation, semantic headings, accessible labels, and mobile layouts.
- User-facing UI text is Serbian (Latin script); documentation may be in Serbian/English.

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

This is a newly built portal foundation, **not a verified migration of the original EEPSI website**. It currently supports public pages, authenticated administration, news, courses and material links. Production deployment, full historical content migration, backups, advanced asset storage, accessibility auditing, and end-to-end tests require separate verification.
