import type { Metadata } from "next";
import { Syne, Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Moul7anout — Your Neighborhood Market",
  description: "Discover local stores, buy local, pay your way. The Moroccan neighborhood marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${syne.variable} ${inter.variable} ${notoArabic.variable} font-inter antialiased bg-cream text-charcoal`}
      >
        {children}
      </body>
    </html>
  );
}
