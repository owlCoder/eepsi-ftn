# EEPSI — javni portal, vizuelni sistem v3 (novembar 2026)

## Prioritet

Primarni korisnik je **student koji nije prijavljen**. Početna mora odmah da omogući pretragu predmeta, otvaranje materijala i čitanje najnovijih obaveštenja. Urednički i administratorski tokovi postoje odvojeno iza RBAC-a. Ovaj sajt nije potvrđena migracija starog EEPSI CMS-a; ne dodavati izmišljene zaposlene, predmete, obaveštenja ili metrike.

## Novi vizuelni jezik

- **Paleta:** midnight `#152341` za glavni početni ekran i podnožje; cobalt `#284cdb` za primarne akcije i aktivne linkove; `#f5f6fa` za podlogu; bele kartice; `#e4e8f0` za granice; duboki slate tonovi za tipografiju.
- **Tipografija:** sistemski sans-serif bez spoljnog font zahteva. Izraženi naslovi, kratki pasusi, konkretne oznake; dobra čitljivost na telefonu. Bez reklamnog jezika, nasumičnih gradijenata i stock fotografija.
- **Komponente:** navigacija sa istaknutim predmetima i obaveštenjima, jedna velika pretraga na početnoj, kartice predmeta sa direktnim materijalima, hronološki feed obaveštenja i jednako stilizovane detaljne stranice.
- **Razmaci:** dovoljno prostora između grupa, ali ne visok prazni blok pre prvog zadatka. Kartice imaju jednostavne ivice i zaobljenje; admin obrasci i tabele ostaju namenski interfejs za rad.
- **Kontrast:** tamni tekst na svetlim površinama, beli tekst na tamnom herou, jasno vidljivi focus-visible obrubi i statusi čitljivi bez oslanjanja na boju.

## Informaciona arhitektura i putanje

| Ruta | Korisnički zadatak | Primarna akcija |
| --- | --- | --- |
| `/` | Pronađi predmet ili proveri šta je novo | Pretraži; otvori najnovije obaveštenje |
| `/predmeti` | Pronađi predmet prema nazivu, šifri, nivou i semestru | Otvori predmet ili direktno materijale |
| `/predmeti/[slug]` | Pristupi nastavnim materijalima | Pregled, filtriranje i otvaranje materijala |
| `/novosti` | Pregledaj objave od najnovijih | Pretraži i otvori objavu |
| `/novosti/[slug]` | Pročitaj obaveštenje | Čitaj, podeli ili nazad na listu |
| `/nastavnici` | Pronađi aktivno angažovano osoblje | Pretraga i prelazak na predmet |
| `/kontakt` | Nađi adresu, email i telefon | Kontaktiraj katedru |
| `/admin` | Pristup korisničkom radnom prostoru | Prijava / rad u okviru uloge |

Sekundarne informativne stranice su `/o-katedri`, `/istrazivanje`, `/laboratorija` i `/saradnja`. Sve postojeće rute i RBAC ostaju stabilni.

## Raspored

### Početna
1. Tanki institucionalni red i kompaktna, prepoznatljiva navigacija.
2. Tamni uvodni ekran sa konkretnim naslovom, velikom pretragom po šifri ili nazivu predmeta i direktnim linkovima ka katalogu, obaveštenjima i nastavnom osoblju.
3. Vidljive najnovije objave u istoj prvoj zoni ekrana na desktopu; bez izmišljenih objava u praznom stanju.
4. Kartice realnih predmeta sa vidljivom šifrom, semestrom i direktnim linkom na `#materijali`.
5. Kratke veze ka osoblju, kontaktu i katedri.

### Katalozi
- Predmeti: jasan naslov → kompaktan filter → mreža kartica → paginacija. Svaka kartica ima dva smisleno različita linka, za detalj i materijale. Materijali prikazuju stvaran broj.
- Obaveštenja: naslov → pretraga → čitljiv feed sa datumom, naslovom i sažetkom, najnovije prvo.
- Osoblje: imena i uloge u karticama, angažovani predmeti kao linkovi. **Nikada ne izlagati prijavne e-mail adrese.**

### Detalji
- Predmet: informacija o predmetu → **nastavni materijali pre opisa** → nastavno osoblje u bočnoj koloni ili ispod na telefonu. Kategorije i pretraga materijala ostaju funkcionalni.
- Obaveštenje: velika naslovna zona, datum i autor, uska čitalačka kolona bez HTML injekcije, povratak na listu.

## Mobilni, tastatura i pristupačnost

- Na manjim ekranima uvek su vidljive prečice „Predmeti“ i „Obaveštenja“; ostale rute su dostupne kroz meni. Otvoreni meni se zatvara klikom van i tasterom Escape, uz povratak fokusa.
- Na širini od 320 px ne sme biti horizontalnog skrolovanja cele stranice. Ciljevi dodira su najmanje 44 px kada su primarne akcije.
- Stvarna oznaka polja, `role="search"` tamo gde je potrebno, relevantne `aria` veze, semantički naslovi i vizuelno istaknuti fokus.
- Testirati kao neprijavljen gost: početna → pretraga → predmet → materijali, kao i početna → obaveštenja → detaljna objava.
- Nakon promena proveriti TypeScript, ESLint, unit/integration, produkcioni build, Chromium Playwright i runtime smoke.

## Granice

Nema promena autorizacije, šeme baze, istorijske migracije, načina izdavanja objava niti javnog deployment-a u okviru ovog vizuelnog redizajna. Produkcija zahteva zasebnu odluku i bezbednosnu reviziju.
