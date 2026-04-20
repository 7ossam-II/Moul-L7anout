"use client";

import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="bg-cream">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}
