"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/shared/Navbar";

const Hero = dynamic(() => import("@/components/sections/Hero"), { ssr: false });
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: false });

export default function Home() {
  return (
    <main className="bg-cream">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}
