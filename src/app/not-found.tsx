import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="max-w-[650px]">
        <p className="eyebrow mb-3">Greška 404</p>
        <h1 className="page-title">Stranica nije pronađena</h1>
        <p className="section-copy mt-4">Adresa možda nije ispravna ili stranica više nije dostupna. Do informacija možete doći kroz katalog predmeta ili glavnu navigaciju.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">Početna strana</Link>
          <Link href="/predmeti" className="btn btn-light">Katalog predmeta</Link>
        </div>
      </div>
    </div>
  );
}
