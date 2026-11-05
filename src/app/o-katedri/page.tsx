import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "O katedri",
  description: "Informacije o Katedri za elektroenergetiku i primenjeno softversko inženjerstvo, FTN Novi Sad.",
};

export default function About() {
  return (
    <>
      <header className="portal-page-hero"><div className="container-page">
        <nav aria-label="Putanja" className="breadcrumbs"><Link href="/" className="hover:underline">Početna</Link> / O katedri</nav>
        <p className="section-kicker !mb-2">KATEDRA / O NAMA</p>
        <h1>O katedri</h1>
        <p className="section-copy mt-3 max-w-3xl">Katedra za elektroenergetiku i primenjeno softversko inženjerstvo deo je Fakulteta tehničkih nauka Univerziteta u Novom Sadu.</p>
      </div></header>
      <div className="container-page grid gap-11 py-11 md:grid-cols-[minmax(0,1fr)_310px] md:gap-15 md:py-15">
        <div>
          <section aria-labelledby="about-activity">
            <h2 id="about-activity" className="section-heading">Oblasti rada</h2>
            <p className="section-copy mt-4">Delatnosti katedre obuhvataju nastavu i istraživanje na preseku elektroenergetike, informacionih tehnologija i softverskog inženjerstva. Portal objedinjuje informacije o predmetima, nastavnom osoblju i aktuelnim obaveštenjima.</p>
            <div className="mt-7 academic-info-list">
              <div className="academic-info-item"><h3 className="font-bold">Nastava</h3><p className="mt-1 text-sm leading-7 text-[#586983]">Predmeti, nastavni tim i materijali dostupni studentima.</p><Link href="/predmeti" className="mt-2 inline-block text-sm font-semibold text-[#12396c] underline">Katalog predmeta</Link></div>
              <div className="academic-info-item"><h3 className="font-bold">Istraživanje</h3><p className="mt-1 text-sm leading-7 text-[#586983]">Istraživačke oblasti vezane za energetske sisteme, digitalizaciju i softver.</p><Link href="/istrazivanje" className="mt-2 inline-block text-sm font-semibold text-[#12396c] underline">Istraživačke oblasti</Link></div>
              <div className="academic-info-item"><h3 className="font-bold">Laboratorijski rad</h3><p className="mt-1 text-sm leading-7 text-[#586983]">Simulacija i ispitivanje elektroenergetskih sistema u laboratorijskim uslovima.</p><Link href="/laboratorija" className="mt-2 inline-block text-sm font-semibold text-[#12396c] underline">Smart Grid laboratorija</Link></div>
              <div className="academic-info-item"><h3 className="font-bold">Saradnja sa privredom</h3><p className="mt-1 text-sm leading-7 text-[#586983]">Povezivanje akademskih znanja sa stručnom i industrijskom praksom.</p><Link href="/saradnja" className="mt-2 inline-block text-sm font-semibold text-[#12396c] underline">Informacije o saradnji</Link></div>
            </div>
          </section>
        </div>
        <aside className="h-fit detail-aside">
          <h2 className="mb-4 text-lg font-bold">Osnovne informacije</h2>
          <dl className="space-y-4 text-sm">
            <div><dt className="text-xs text-[#586983]">Univerzitet</dt><dd className="mt-1 font-semibold">Univerzitet u Novom Sadu</dd></div>
            <div className="border-t border-[#dce3ee] pt-4"><dt className="text-xs text-[#586983]">Fakultet</dt><dd className="mt-1 font-semibold">Fakultet tehničkih nauka</dd></div>
            <div className="border-t border-[#dce3ee] pt-4"><dt className="text-xs text-[#586983]">Katedra</dt><dd className="mt-1 font-semibold">Elektroenergetika i primenjeno softversko inženjerstvo</dd></div>
            <div className="border-t border-[#dce3ee] pt-4"><dt className="text-xs text-[#586983]">Lokacija</dt><dd className="mt-1 font-semibold">Novi Sad</dd></div>
          </dl>
          <Link href="/kontakt" className="btn btn-light mt-6 w-full">Kontakt katedre <ArrowRight size={16}/></Link>
        </aside>
      </div>
    </>
  );
}
