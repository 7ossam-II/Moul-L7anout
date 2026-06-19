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
      {/* Add the button to go to seller dashboard */}
      <div className="flex justify-center my-8">
        <a
          href="http://localhost:3000/seller/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0F4C81] hover:bg-[#1a5c9e] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Go to Seller Dashboard
        </a>
      </div>
      <Footer />
    </main>
  );
}