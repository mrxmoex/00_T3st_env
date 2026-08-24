import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { LocaleProvider } from "@/components/locale-context";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-loaded",
});

const serif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-serif-loaded",
});

export const metadata: Metadata = {
  title: "Was du isst — Du bist was du isst",
  description:
    "Public, login-free multi-axis food evaluation matrix. Biochemical invariants, sourced claims, visible trade-offs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${sans.variable} ${serif.variable}`}>
      <body className="antialiased">
        <LocaleProvider>
          <SiteHeader />
          <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">{children}</main>
          <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-muted">
            Public core. No account. Quantity without bioavailability is noise.
          </footer>
        </LocaleProvider>
      </body>
    </html>
  );
}
