import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { getLocale } from "@/lib/locale";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Du bist was du isst — Nahrungsmatrix",
  description:
    "Free public multi-axis food matrix. Quantity without bioavailability is noise. No account required.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="min-h-full bg-bg text-ink antialiased">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
          {children}
        </main>
        <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted">
          Frei und öffentlich. Kein Login. Keine Diät-Werbung. / Free and
          public. No login. No diet advocacy.
        </footer>
      </body>
    </html>
  );
}
