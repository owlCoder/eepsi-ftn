import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Saradnja sa privredom",
  description: "Povezivanje akademskog i industrijskog rada na Katedri EEPSI.",
};

export default function CollaborationPage() {
  return (
    <>
      <header className="portal-page-hero"><div className="container-page">
        <nav aria-label="Putanja" className="breadcrumbs"><Link href="/" className="hover:underline">Početna</Link> / <Link href="/o-katedri" className="hover:underline">O katedri</Link> / Saradnja</nav>
        <p className="section-kicker !mb-2">KATEDRA / SARADNJA</p>
        <h1>Saradnja sa privredom</h1>
        <p className="section-copy mt-3 max-w-3xl">Povezivanje istraživačkog i obrazovnog rada sa stručnom praksom u energetici i softverskom inženjerstvu.</p>
      </div></header>
      <div className="container-page grid gap-10 py-11 md:py-15 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section aria-labelledby="collaboration-areas">
          <h2 id="collaboration-areas" className="section-heading">Oblasti saradnje</h2>
          <div className="mt-6 academic-info-list">
            <div className="academic-info-item"><h3 className="font-bold">Industrijski projekti</h3><p className="mt-2 text-sm leading-7 text-[#586983]">Primena inženjerskih metoda na konkretnim izazovima iz oblasti energetike i softverskih sistema.</p></div>
            <div className="academic-info-item"><h3 className="font-bold">Stručno usavršavanje</h3><p className="mt-2 text-sm leading-7 text-[#586983]">Povezivanje akademskog obrazovanja, studentske prakse i profesionalnog razvoja.</p></div>
            <div className="academic-info-item"><h3 className="font-bold">Razmena znanja</h3><p className="mt-2 text-sm leading-7 text-[#586983]">Prenos znanja i iskustava između naučnog i industrijskog rada.</p></div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold">Pregled dosadašnje saradnje</h2>
            <p className="section-copy mt-3">Za primere projekata i partnere pogledajte zvaničan pregled saradnje na sajtu katedre. Podaci o aktuelnim partnerstvima proveravaju se na izvornom sajtu.</p>
            <a href="https://www.eepsi.ftn.uns.ac.rs/saradnja-sa-privredom" target="_blank" rel="noopener noreferrer" className="btn btn-light mt-5">Zvanični pregled saradnje <ExternalLink size={16}/></a>
          </div>
        </section>
        <aside className="h-fit detail-aside">
          <h2 className="text-lg font-bold">Predlog za saradnju?</h2>
          <p className="mt-3 text-sm leading-7 text-[#586983]">Za pitanja i predloge vezane za stručnu i istraživačku saradnju kontaktirajte katedru.</p>
          <a href="mailto:eespsi@uns.ac.rs?subject=Saradnja%20sa%20Katedrom%20EEPSI" className="btn btn-primary mt-5 w-full">Pošaljite email</a>
          <Link href="/kontakt" className="mt-5 flex items-center justify-between gap-2 text-sm font-semibold text-[#12396c]">Kontakt-podaci <ArrowRight size={16}/></Link>
        </aside>
      </div>
    </>
  );
}
