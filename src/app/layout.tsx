import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EEPSI FTN | Katedra", template: "%s | EEPSI FTN" },
  description: "Katedra za elektroenergetiku i primenjeno softversko inženjerstvo, Fakultet tehničkih nauka, Novi Sad.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr">
      <body className="flex min-h-screen flex-col">
        <SiteHeader/>
        <a className="skip-link" href="#glavni-sadrzaj">Preskoči navigaciju</a>
        <main id="glavni-sadrzaj" className="flex-1" tabIndex={-1}>{children}</main>
        <SiteFooter/>
      </body>
    </html>
  );
}
