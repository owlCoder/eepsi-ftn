# EEPSI FTN — Academic Web Portal

[![Quality gates](https://github.com/owlCoder/eepsi-ftn/actions/workflows/ci.yml/badge.svg)](https://github.com/owlCoder/eepsi-ftn/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-171717?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?logo=mysql&logoColor=white)

**Savremeni, responzivni portal Katedre za elektroenergetiku i primenjeno softversko inženjerstvo (EEPSI), Fakultet tehničkih nauka, Univerzitet u Novom Sadu.**

Next.js App Router, TypeScript, MySQL, Prisma, server-side RBAC, Clean Architecture i automatizovane provere kvaliteta.

> **Status:** Funkcionalna razvojna osnova. Repozitorijum je prethodno bio prazan; ovaj projekat **nije automatski preuzeo sadržaj** sa starog EEPSI sajta i nije javno deployovan. Nisu sprovedeni produkcioni pentest, E2E i kompletan accessibility audit.

## Šta portal sadrži

- **Javni sajt:** početna, o katedri, katalog/pregled predmeta, detalji predmeta i materijala, pretraga i paginacija novosti.
- **Autentifikacija:** email + lozinka preko NextAuth Credentials, bcrypt, provera aktivnog naloga, opoziv starih JWT sesija preko `sessionVersion` i DB-backed ograničenje neuspešnih pokušaja (5 na 15 minuta za postojeće aktivne naloge).
- **Admin panel:** urednički tok nacrt/objava, upravljanje predmetima, materijalima i korisnicima, pregled audit loga i lični profil sa promenom lozinke.
- **RBAC:** pet globalnih uloga i predmetno ograničene privilegije nastavnika i saradnika; dozvole se proveravaju na serveru.
- **Baza:** tipizovan Prisma model, verzionisane migracije za MySQL, kontrolisan bootstrap administratora.
- **Performanse i SEO:** server-rendered liste sa paginacijom, ISR javnih stranica, optimizovani DB upiti, robots i sitemap.
- **Audit:** administratorske izmene se evidentiraju u istoj transakciji sa upisom.
- **Kvalitet:** Vitest, TypeScript strict, ESLint i GitHub Actions (instalacija, migracije, provere i produkcioni build).

## Tehnološki stack

| Oblast | Rešenje |
| --- | --- |
| UI / rendering | Next.js 16 (App Router), React 19, Server Components |
| Jezik i stil | TypeScript 6 (strict), Tailwind CSS 4, Lucide |
| Persistence | MySQL 8+, Prisma ORM 7, MariaDB driver adapter |
| Auth | NextAuth 4 (stabilna grana), bcryptjs |
| Validacija / testovi | Zod 4, Vitest 5 |
| CI | GitHub Actions |

**Održavanje paketa:** Dependabot jednom nedeljno otvara PR-ove za npm i GitHub Actions izmene; ništa se ne merge-uje automatski bez zelenog CI-ja i pregleda. 

**Verzije:** `package.json` je izvor istine. Prednost imaju najnovije *stabilne i međusobno kompatibilne* verzije. TypeScript 7 još nije kompatibilan sa `typescript-eslint` verzijom koju zahteva aktuelni Next ESLint stack, zato je trenutno TS 6.

## Arhitektura

```text
src/
├── domain/          # Čiste poslovne politike, role, permission pravila, slug
├── application/     # Validacija, use-case autorizacija
├── infrastructure/  # MySQL/Prisma, auth, repositories
├── app/             # App Router, javne/admin rute i Server Actions
├── components/      # Komponente interfejsa
└── lib/             # Pomoćne funkcije
prisma/
├── schema.prisma    # Model
├── migrations/      # Verzionski kontrolisane SQL migracije
└── seed.ts          # Bootstrap admin nalog
```

Zavisnosti treba da idu **prema unutra**: domen ne poznaje HTTP, ORM ili Next.js; autorizacija i business rules nisu sakriveni u komponentama. Za dogovorene standarde razvoja pogledaj [AGENTS.md](./AGENTS.md).

## Lokalno pokretanje

**Preduslovi:** Node.js 24 LTS (ili kompatibilni Node 22.18+), npm i MySQL 8+ instanca.

```bash
git clone https://github.com/owlCoder/eepsi-ftn.git
cd eepsi-ftn
npm install
cp .env.example .env
```

U `.env` podesi:

| Promenljiva | Značenje |
| --- | --- |
| `DATABASE_URL` | MySQL URL za Prisma migracije |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` | Parametri konekcije za runtime driver |
| `NEXTAUTH_URL` | Potpuni URL aplikacije (`http://localhost:3000` lokalno) |
| `NEXTAUTH_SECRET` | Nasumičan secret, najmanje 32 bajta |
| `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`, `BOOTSTRAP_ADMIN_NAME` | Inicijalni admin — *samo za seed* |

Generiši secret naredbom `openssl rand -base64 48`. **Ne commituj `.env`.** Lozinka za bootstrap mora da ima najmanje 12 karaktera; u repou ne postoji podrazumevana administratorska lozinka.

```bash
npm run db:deploy     # Primeni postojeće migracije
npm run db:seed       # Kreiraj prvog SUPER_ADMIN korisnika
npm run dev           # http://localhost:3000
```

Nakon prijave idi na `/admin`. Prisma Studio se pokreće sa `npm run db:studio`.

## RBAC matrica

| Dozvola | Super admin | Urednik | Nastavnik* | Saradnik* | Student |
| --- | :---: | :---: | :---: | :---: | :---: |
| Čitanje javnog sadržaja | ✓ | ✓ | ✓ | ✓ | ✓ |
| Kreiranje i objava novosti | ✓ | ✓ | — | — | — |
| Kreiranje predmeta | ✓ | ✓ | — | — | — |
| Izmena podataka o predmetu | ✓ | ✓ | ✓ | — | — |
| Dodavanje/uklanjanje materijala | ✓ | ✓ | ✓ | ✓ | — |
| Kreiranje naloga, izmene uloga i deaktivacija | ✓ | — | — | — | — |
| Dodela nastavnika i saradnika predmetima | ✓ | — | — | — | — |

\* Nastavnik i saradnik imaju pravo izmene **samo na predmetima kojima su eksplicitno dodeljeni** (`CourseMembership`). Svaka privilegovana server akcija radi kontrolu u aktuelnoj bazi; prikazivanje dugmadi nije bezbednosna kontrola. Promena uloge/deaktivacija briše zastarela članstva i uvećava `sessionVersion`, čime se prethodne JWT sesije odbijaju na serveru. Promena lozinke takođe opoziva stare sesije. Super-admin nalog se ne uređuje kroz standardan formular.

## Razvoj i kvalitet

```bash
npm run typecheck
npm run lint
npm test
npm run test:integration  # Zahteva MySQL bazu sa primenjenim migracijama
npm run build
```

GitHub Actions (akcije vezane za proverene commit SHA-ove, umesto promenljivih tagova) za svaki push na `main` i PR proverava instalaciju, Prisma šemu, primenu migracija na izolovanom MySQL servisu, tipove, lint, unit i integracione testove baze, optimizovani produkcioni build i runtime smoke-test ruta (uključujući zaštitu /admin). Prati [CI status](https://github.com/owlCoder/eepsi-ftn/actions/workflows/ci.yml).

### Zdravlje aplikacije i održavanje

- `GET /api/health` vraća `200` kada baza odgovara ili `503` kada je nedostupna. Ne izlaže connection stringove ni detalje izuzetka.
- `npm run db:cleanup-throttles` briše istekle HMAC-bazirane zapise neuspešnih prijava. Pokretati periodično kroz pouzdan scheduler/cron. Ne briše audit log.
- Za audit log napraviti posebnu politiku čuvanja/retencije pre produkcije.

### Izmena šeme

Ne menjati već primenjenu migraciju. Napravi novu:

```bash
npm run db:migrate -- --name opis_promene
```

Zatim commituj `prisma/schema.prisma` i novu SQL migraciju. Za CI/produkciju koristi `npm run db:deploy`.

## Bezbednost i priprema za produkciju

- Svi credentials i produkcione vrednosti konfigurišu se kroz environment variables/secrets — nikada kroz git.
- Endpointi koji menjaju podatke moraju imati serversku validaciju, autentifikaciju i RBAC proveru.
- Za javni deploy obezbedi HTTPS, pravilne `NEXTAUTH_URL` / `NEXTAUTH_SECRET`, dodatni IP/edge rate limiter (DB zaštita je po nalogu i može privremeno blokirati tuđi nalog), backup i restore procedure.
- Audit zapisi čuvaju aktera, akciju, tip/ID resursa i vreme — bez lozinki i tela novosti. Definisati politiku retencije, redovno čistiti istekle login throttle zapise.
- Proveri stvarnu politiku upravljanja korisnicima, retenciju podataka, dozvole za objavljivanje dokumenata i bezbednosni review pre produkcije.
- Trenutni materijali su **HTTPS linkovi**, ne sistem privatnog upload-a ili upravljanja fajlovima; tekst novosti je običan tekst.
- Trenutno ne postoji integracija sa starim CMS-om niti migracija stvarnih kurseva, zaposlenih i novosti.
- Javni SEO URL-ovi i sitemap preuzimaju osnovni URL iz `NEXTAUTH_URL`; u produkciji on mora biti stvarni HTTPS domen.

## Doprinosi i licenca

Pogledaj [AGENTS.md](./AGENTS.md) pre izmene koda. Promene treba da budu fokusirane, testirane i bez osetljivih podataka.

**Licenca:** Za sada nije dodat `LICENSE` fajl. Javno dostupan kod nije automatski open-source licenciran; prava upotrebe ostaju kod nosioca autorskih prava dok se licenca ne odredi.
