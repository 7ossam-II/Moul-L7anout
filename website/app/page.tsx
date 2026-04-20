"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="font-syne text-6xl md:text-8xl font-bold mb-6">
          Moul<span className="text-[#FF6B35]">7anout</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10">
          Le futur du commerce local au Maroc. Connectez-vous avec vos commerçants de quartier en temps réel.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button className="bg-[#0F4C81] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#0d3d68] transition-colors">
            Découvrir la Carte
          </button>
          <button className="border-2 border-[#FF6B35] text-[#FF6B35] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#FF6B35] hover:text-white transition-all">
            Devenir Vendeur
          </button>
        </div>
      </motion.div>
    </main>
  );
}
