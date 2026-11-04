import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <div className="container-page py-28 text-center"><p className="eyebrow">Greška 404</p><h1 className="mt-4 text-5xl font-extrabold tracking-tight">Stranica nije pronađena.</h1><p className="section-copy mt-5">Tražena stranica ne postoji ili više nije dostupna.</p><Link href="/" className="btn btn-primary mt-8"><ArrowLeft size={17}/> Povratak na početnu</Link></div>;
}
