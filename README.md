# EEPSI FTN — moderni portal Katedre

Moderni Next.js / MySQL portal za Katedru za elektroenergetiku i primenjeno softversko inženjerstvo (FTN Novi Sad). Novi projekat napravljen od početka jer je repozitorijum na `main` bio prazan prilikom pregleda.

## Tehnologije

- Next.js 16, React 19, TypeScript 7, Tailwind CSS 4
- Prisma ORM 7 + MySQL 8, Prisma MariaDB adapter
- Auth.js / NextAuth 4 (poslednja **stabilna** grana), bcrypt
- Zod 4, Vitest 5, GitHub Actions
- Clean Architecture: `domain` → `application` → `infrastructure` → `presentation (app/components)`

## Pokretanje

1. Instaliraj Node.js **24.11+** (ili kompatibilni 22.18+) i MySQL 8.
2. Kopiraj `.env.example` u `.env` i upiši MySQL konekciju i nasumičan `NEXTAUTH_SECRET` (min. 32 bajta).
3. `npm install`
4. `npx prisma migrate dev --name init`
5. `npm run db:seed` — zahteva `BOOTSTRAP_ADMIN_EMAIL` i `BOOTSTRAP_ADMIN_PASSWORD` u `.env`, bez ugrađene podrazumevane lozinke.
6. `npm run dev` i otvori http://localhost:3000.

Komande: `npm run typecheck`, `npm test`, `npm run build`, `npm run db:studio`.

## RBAC model

| Uloga | Dozvole |
| --- | --- |
| SUPER_ADMIN | Sve, uključujući kreiranje, deaktivaciju i izmenu uloga naloga |
| EDITOR | Kreiranje/objavljivanje novosti; kreiranje i uređivanje predmeta i materijala |
| PROFESSOR | Izmena sadržaja i materijala **samo dodeljenih predmeta** |
| ASSISTANT | Dodavanje materijala **samo dodeljenih predmeta** |
| STUDENT | Javni sadržaj (bez administratorskih mutacija) |

Uloge iz sesije se **ne smatraju izvorom istine**: server svaku privilegovanu akciju autorizuje uz trenutne podatke iz baze. UI kontrole nisu sigurnosna granica. Za predmete se proverava članstvo preko `CourseMembership`. API nikada ne uzima ulogu iz forme kao dokaz ovlašćenja.

## Napomene za produkciju

- Promena globalne uloge ili deaktivacija automatski uklanja sva članstva na predmetima. SUPER_ADMIN nalozi su zaštićeni od izmene kroz administratorski formular.
- Bez postojećeg koda u repozitorijumu ovo je nova osnova, a ne refaktor migriranog sajta; sadržaj starog Wix sajta nije automatski preuzet.
- Dokumenta su za sada linkovi ka eksternim HTTPS resursima, ne privatno skladište datoteka.
- Pre javne produkcije: obavezno podesi domen i `NEXTAUTH_URL`, HTTPS, rate limiting na loginu (gateway/WAF), audit logove, backup baze i strategiju migracije sadržaja.
- Nisu upisani ključevi, lozinke, niti pristupni podaci u Git.
