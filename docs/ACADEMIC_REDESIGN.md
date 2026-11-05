# EEPSI — akademski UI/UX plan (verzija 2)

## Cilj

Portal mora da odgovori na tri pitanja bez objašnjavanja: **gde sam, šta tražim i kako dolazim do informacije?** Primarna publika su studenti, nastavnici/saradnici, uredništvo katedre i posetioci iz industrije. Nema reklamnih slogana, generičkih ilustracija, izmišljenih metrika ni dekorativnih kartica.

## Informaciona arhitektura

| Navigacija | Ruta | Korisnikov zadatak | Glavna radnja |
| --- | --- | --- | --- |
| Početna | `/` | Orijentacija i najnovije informacije | Pretraži predmet |
| Predmeti | `/predmeti` | Pronađi predmet, program, semestar i materijale | Filteri i katalog |
| Nastavno osoblje | `/nastavnici` | Pronađi nastavnika i njegove predmete | Pretraga imena ili predmeta |
| Obaveštenja | `/novosti` | Pročitaj aktuelne objave | Pretraga i hronološka lista |
| Istraživanje | `/istrazivanje` | Pogledaj naučne oblasti i publikacije | Zvanični pregled radova |
| O katedri | `/o-katedri` | Razumevanje delatnosti i povezanih oblasti | Laboratorija / saradnja |
| Kontakt | `/kontakt` | Nađi adresu, telefon i e-mail | Kontaktiraj katedru |
| Moj portal | `/admin` | Pristup u skladu sa korisničkom ulogom | Prijava ili radni prostor |

Sekundarne stranice: `/laboratorija` i `/saradnja` dostupne iz istraživanja/o katedri i podnožja. Svi postojeći URL-ovi ostaju važeći. Nema promene modela podataka, RBAC-a ili autorizacije.

## Rasporedi

### Početna
1. Institucionalni zaglavlje: Univerzitet, Fakultet, puni naziv katedre. Bez hero ilustracije i generičkog slogana.
2. Kratko objašnjenje portala uz **pretragu predmeta iz prve zone ekrana**.
3. „Najčešće traženo“: Predmeti i materijali; Nastavno osoblje; Obaveštenja; Kontakt.
4. „Najnovija obaveštenja“: hronološki redovi sa datumom, naslovom i kratkim tekstom. Vidljiva veza do svih obaveštenja.
5. „Predmeti“: ograničeni pregled iz baze; vidljiv link do kompletnog kataloga.
6. „O katedri“: precizan institucionalni uvod, veze ka istraživanju, laboratoriji i saradnji.
7. Kontakt-podaci u podnožju.

### Listing / detalji
- Katalog: naslov → kontekst → filteri → rezultati kao čitljiva lista (šifra, naziv, nivo, semestar), konzistentna paginacija.
- Predmet: povratak na katalog → naziv i šifra → opis → materijali sa pretragom i kategorijama → nastavni tim. Nema praznog dekorativnog panela.
- Nastavno osoblje: pretraga → grupisanje nastavnici/saradnici → imena i angažovanja. Bez javnih e-mail adresa.
- Obaveštenja: vremenski poređani naslovi, opis i datum; tekst pojedinačne vesti u uskoj čitalačkoj koloni.
- Informativne stranice: naslov, sažetak, potpune informacije, povezane stranice, proverljivi izvori; izbegavati tvrđenja o konkretnim projektima bez potvrde.
- Admin: uloga i identitet u zaglavlju, leve radne sekcije, jasne tabele i obrasci; ne menjati postojeće tokove čuvanja i potvrda.

## Dizajn sistem

- Primarna: `#173b63` (akademska tamnoplava). Tekst: `#182b3c`. Površina: `#fff`. Pozadina: `#f5f7fa`. Linije: `#dce3e9`. Sekundarni tekst: `#556777`.
- **Jedna akcentna boja** plus neutralni tonovi. Crveno samo za destruktivne radnje; zeleno samo za uspeh.
- System sans-serif tipografija bez eksternog font zahteva; jasni naslovni nivoi, normalna veličina teksta, 1.5–1.7 prored.
- Maksimalna širina stranice 1180 px, čitalačka kolona 720–780 px. Raspored 12 kolona, ograničen broj prelamanja, jednostavne bordure i mali radijusi (6–8 px).
- Bez gradijenata, serifnih reklamnih naslova, ukrasnih piktograma, geometrijskih šema i „glass“ efekata. Ikonice samo kada objašnjavaju radnju.
- Fokus okvir, skip link, stvarne oznake polja, vidljiv aktivni meni, cilj dodira najmanje 44 px. Mobile first. Navigacija nije skrivena iza desktop-only elemenata.
- Statusi moraju biti tekstualni. Kartice/pločice nisu podrazumevani raspored — koristimo liste, sekcije i tabele.

## Urednička pravila (copy)

- „Predmeti“ umesto „Istražite znanje koje pokreće budućnost“.
- „Pretraži predmete“ umesto „Pronađite svoju putanju“.
- „Nastavno osoblje“, „Obaveštenja“, „Kontakt“, „Materijali“ — terminologija mora biti dosledna kroz meni, naslove i akcije.
- Objašnjenja jednu do dve rečenice; relevantne informacije pre marketinga.
- Ne izmišljati zaposlene, studente, događaje, statistiku, projekte ni referencu da je ovo zvanična migracija istorijskog sajta.

## UX verifikacija

- Student sa početne do predmeta i materijala u najviše dva klika, ako se zna naziv predmeta.
- Posetilac sa svake stranice do kontakta jednim klikom iz glavne navigacije.
- Nastavnik sa radnog prostora do svog predmeta jednim klikom.
- Telefon 390 px: navigacija, pretraga, filteri, tabele, forme i dugmad bez horizontalnog skrolovanja glavne stranice.
- Zadržati sve Playwright selektore / tokove, i po potrebi proširiti test osnovne navigacije.
- Verifikovati `typecheck`, lint, unit/integration, build, browser E2E i produkcioni runtime CI.
