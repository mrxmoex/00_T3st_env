import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/i18n/locale-context";
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
  title: "Du bist was du isst — Food Evaluation Matrix",
  description:
    "Multi-axis biochemical food evaluation matrix. Evidence-based, source-linked, no ideology. Free and public.",
  openGraph: {
    title: "Du bist was du isst",
    description: "Interactive multi-axis food evaluation grounded in biochemistry",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
