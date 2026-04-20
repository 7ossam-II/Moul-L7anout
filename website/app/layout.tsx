import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Moul7anout — Le Souk Digital Marocain",
  description: "Découvrez les commerçants locaux, les kiosques mobiles et le système Lkridi en temps réel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="${syne.variable} ${jakarta.variable} font-jakarta antialiased bg-white text-[#0F4C81]">
        {children}
      </body>
    </html>
  );
}
