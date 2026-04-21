"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "For Sellers", href: "#for-sellers" },
  { label: "Map", href: "#map" },
];

const languages = ["FR", "AR", "EN"];

const spring = { type: "spring", stiffness: 500, damping: 30 };

function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-sm font-inter font-medium text-gray-mid hover:text-navy transition-colors duration-200 py-1"
    >
      {label}
      <motion.span
        className="absolute bottom-0 left-0 h-[1.5px] bg-navy rounded-full"
        initial={{ width: 0 }}
        animate={{ width: hovered ? "100%" : 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </a>
  );
}

function LangSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [lang, setLang] = useState("FR");
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const idx = languages.indexOf(lang);
    const el = refs.current[idx];
    if (el) {
      setPillLeft(el.offsetLeft);
      setPillWidth(el.offsetWidth);
    }
  }, [lang]);

  return (
    <div className={`relative flex items-center bg-gray-light rounded-full ${mobile ? "px-1 py-1" : "px-1 py-1"}`}>
      <motion.span
        className="absolute top-1 bottom-1 bg-navy rounded-full z-0"
        animate={{ left: pillLeft, width: pillWidth }}
        transition={spring}
      />
      {languages.map((l, i) => (
        <button
          key={l}
          ref={(el) => { refs.current[i] = el; }}
          onClick={() => setLang(l)}
          className={`relative z-10 text-xs font-inter font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 min-h-[32px] ${
            lang === l ? "text-white" : "text-gray-mid hover:text-charcoal"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md shadow-sm border-b border-gray-light"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
        >
          <motion.div
            className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center"
            whileHover={{ rotate: -8 }}
            transition={spring}
          >
            <ShoppingBag className="w-4 h-4 text-white" />
          </motion.div>
          <span className="font-syne font-extrabold text-lg text-charcoal">
            Moul<span className="text-orange">7anout</span>
          </span>
        </motion.a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink label={link.label} href={link.href} />
            </li>
          ))}
        </ul>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          <LangSwitcher />
          <motion.a
            href="#for-sellers"
            className="bg-orange text-white text-sm font-syne font-bold px-5 py-2.5 rounded-full shadow-[0_2px_12px_rgba(255,107,53,0.35)]"
            whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(255,107,53,0.45)" }}
            whileTap={{ scale: 0.96 }}
            transition={spring}
          >
            Join as Seller
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-gray-light text-charcoal"
          aria-label="Toggle menu"
          whileTap={{ scale: 0.92 }}
          transition={spring}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden overflow-hidden bg-cream/97 backdrop-blur-md border-b border-gray-light"
          >
            <div className="px-4 pb-6 pt-2">
              <ul className="flex flex-col gap-1 mb-4">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ...spring }}
                  >
                    <motion.a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center py-3 px-4 text-base font-inter font-medium text-charcoal rounded-xl min-h-[52px]"
                      whileHover={{ backgroundColor: "rgba(240,244,248,1)", x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={spring}
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, ...spring }}
              >
                <LangSwitcher mobile />
                <motion.a
                  href="#for-sellers"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 flex items-center justify-center bg-orange text-white text-sm font-syne font-bold px-4 py-3 rounded-full min-h-[52px] shadow-[0_2px_12px_rgba(255,107,53,0.35)]"
                  whileTap={{ scale: 0.96 }}
                  transition={spring}
                >
                  Join as Seller
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
