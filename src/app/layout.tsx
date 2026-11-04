import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EEPSI FTN | Katedra", template: "%s | EEPSI FTN" },
  description: "Katedra za elektroenergetiku i primenjeno softversko inženjerstvo, Fakultet tehničkih nauka, Novi Sad.",
  metadataBase: new URL("https://www.eepsi.ftn.uns.ac.rs"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr">
      <body className="flex min-h-screen flex-col">
        <SiteHeader/>
        <main className="flex-1">{children}</main>
        <SiteFooter/>
      </body>
    </html>
  );
}
