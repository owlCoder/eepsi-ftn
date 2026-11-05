# EEPSI — odobreni akademski portal, vizuelni sistem v4 (novembar 2026)

## Prioritet

Primarni korisnik je **student koji nije prijavljen**. Početna mora odmah da omogući pretragu predmeta, otvaranje materijala i čitanje najnovijih obaveštenja. Urednički i administratorski tokovi postoje odvojeno iza RBAC-a. Ovaj sajt nije potvrđena migracija starog EEPSI CMS-a; ne dodavati izmišljene zaposlene, predmete, obaveštenja ili metrike.

## Novi vizuelni jezik

- **Paleta:** institucionalna teget `#10294e`, akcije `#12396c`, podloga `#f6f8fc`, bele površine i diskretne linije `#dce3ee`. Bez jarke kobalt-plave dekoracije.
- **Tipografija:** sistemski sans-serif za sav tekst; klasični serif samo za veliki naslov akademskog portala u uvodnoj zoni. Umerena težina, jasna hijerarhija i institucionalni ton.
- **Komponente:** FTN identitet i dvoredna navigacija; jedna velika pretraga u fotografskom uvodu; pet malih prečica; hronološka obaveštenja, izdvojeni predmeti u kompaktnim redovima i proverljive korisne informacije. Katalog je jedna semantička tabela koja se prilagođava telefonu.
- **Fotografija:** originalna fotografija Fakulteta tehničkih nauka (autor Nikolina Šepić, Wikimedia Commons, CC BY-SA 4.0) prikazana je kadrirano, sa atribucijom i licencom u podnožju. Nije dozvoljeno izmišljati izgled zgrade ili dodavati fotografije nepoznatog porekla.
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
1. Institucionalni FTN red sa tačnim nazivom katedre, zatim jasno raspoređena sekundarna navigacija.
2. Jedan kompaktan fotografski uvod sa naslovom „EEPSI — Studentski portal“, velikom pretragom naziva ili šifre predmeta i stvarnom fotografijom FTN-a.
3. Pet kratkih prečica ka postojećim javnim rutama.
4. Neposredno ispod: tri kolone — najnovija stvarna obaveštenja, izdvojeni stvarni predmeti sa materijalima i korisni linkovi.
5. Na telefonu: uvod bez dominantne fotografije, dvokolonske prečice i vertikalno složene liste, bez horizontalnog skrola.

### Katalozi
- Predmeti: jasan naslov → kompaktan filter → jedinstvena semantička tabela sa kolonama šifra, naziv, nivo, semestar, materijali → paginacija. Na telefonu isti DOM redovi postaju vertikalne kartice bez dupliranja elemenata. Svaka stavka ima direktan link do materijala sa stvarnim brojem.
- Obaveštenja: naslov → pretraga → čitljiv feed sa datumom, naslovom i sažetkom, najnovije prvo.
- Osoblje: imena i uloge u karticama, angažovani predmeti kao linkovi. **Nikada ne izlagati prijavne e-mail adrese.**

### Detalji
- Predmet: informacija o predmetu → **nastavni materijali pre opisa** → nastavno osoblje u bočnoj koloni ili ispod na telefonu. Kategorije i pretraga materijala ostaju funkcionalni.
- Obaveštenje: urednički naslov, datum i autor, uska čitalačka kolona bez HTML injekcije i jasna veza nazad ka listi.

## Mobilni, tastatura i pristupačnost

- Na manjim ekranima uvek su vidljive prečice „Predmeti“ i „Obaveštenja“; ostale rute su dostupne kroz meni. Otvoreni meni se zatvara klikom van i tasterom Escape, uz povratak fokusa.
- Na širini od 320 px ne sme biti horizontalnog skrolovanja cele stranice. Ciljevi dodira su najmanje 44 px kada su primarne akcije.
- Stvarna oznaka polja, `role="search"` tamo gde je potrebno, relevantne `aria` veze, semantički naslovi i vizuelno istaknuti fokus.
- Testirati kao neprijavljen gost: početna → pretraga → predmet → materijali, kao i početna → obaveštenja → detaljna objava.
- Nakon promena proveriti TypeScript, ESLint, unit/integration, produkcioni build, Chromium Playwright i runtime smoke.

## Granice

Nema promena autorizacije, šeme baze, istorijske migracije, načina izdavanja objava niti javnog deployment-a u okviru ovog vizuelnog redizajna. Produkcija zahteva zasebnu odluku i bezbednosnu reviziju.
