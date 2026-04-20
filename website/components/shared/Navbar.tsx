"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "For Sellers", href: "#for-sellers" },
  { label: "Map", href: "#map" },
];

const languages = ["FR", "AR", "EN"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState("FR");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md shadow-sm border-b border-gray-light"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="font-syne font-extrabold text-lg text-charcoal">
            Moul<span className="text-orange">7anout</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-inter font-medium text-gray-mid hover:text-navy transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-light rounded-full px-2 py-1">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-inter font-semibold px-2 py-1 rounded-full transition-all ${
                  lang === l ? "bg-navy text-white" : "text-gray-mid hover:text-charcoal"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <a
            href="#for-sellers"
            className="bg-orange text-white text-sm font-syne font-bold px-4 py-2 rounded-full hover:bg-orange/90 transition-colors"
          >
            Join as Seller
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-gray-light text-charcoal"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-cream/95 backdrop-blur-md border-b border-gray-light px-4 pb-6 pt-2"
          >
            <ul className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center py-3 px-4 text-base font-inter font-medium text-charcoal hover:bg-gray-light rounded-xl transition-colors min-h-[48px]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-light rounded-full px-2 py-1">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`text-xs font-inter font-semibold px-3 py-2 rounded-full transition-all min-h-[36px] ${
                      lang === l ? "bg-navy text-white" : "text-gray-mid hover:text-charcoal"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <a
                href="#for-sellers"
                onClick={() => setMenuOpen(false)}
                className="flex-1 flex items-center justify-center bg-orange text-white text-sm font-syne font-bold px-4 py-3 rounded-full hover:bg-orange/90 transition-colors min-h-[48px]"
              >
                Join as Seller
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
