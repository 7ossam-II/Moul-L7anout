"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ShoppingBag, Instagram, Twitter, Facebook } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "For Sellers", href: "#for-sellers" },
  { label: "Map", href: "#map" },
];

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

const languages = ["FR", "AR", "EN"];
const spring = { type: "spring", stiffness: 500, damping: 30 };

function FooterNavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-sm font-inter font-medium text-white/70 hover:text-white transition-colors duration-200 py-1 inline-block"
    >
      {label}
      <motion.span
        className="absolute bottom-0 left-0 h-[1.5px] bg-white rounded-full"
        initial={{ width: 0 }}
        animate={{ width: hovered ? "100%" : 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </a>
  );
}

function FooterLangSwitcher() {
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
    <div className="relative inline-flex items-center bg-white/10 rounded-full px-1 py-1">
      <motion.span
        className="absolute top-1 bottom-1 bg-orange rounded-full z-0"
        animate={{ left: pillLeft, width: pillWidth }}
        transition={spring}
      />
      {languages.map((l, i) => (
        <button
          key={l}
          ref={(el) => { refs.current[i] = el; }}
          onClick={() => setLang(l)}
          className={`relative z-10 text-xs font-inter font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 min-h-[32px] ${
            lang === l ? "text-white" : "text-white/60 hover:text-white"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const colVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
    }),
  };

  return (
    <footer ref={ref} className="relative bg-navy border-b-[4px] border-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Col 1: Brand */}
          <motion.div
            custom={0}
            variants={colVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <a href="#" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-orange rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-syne font-extrabold text-xl text-white">
                Moul<span className="text-orange">7anout</span>
              </span>
            </a>
            <p className="text-sm font-inter text-white/60 leading-relaxed mb-2 max-w-[240px]">
              Your neighborhood. Your market.
            </p>
            <p className="text-sm font-arabic text-white/50 text-right max-w-[240px]" dir="rtl">
              سوقك. حيّك.
            </p>
            <p className="text-xs font-inter text-white/40 mt-4 max-w-[240px] leading-relaxed">
              Connecting Casablanca&apos;s neighborhoods with local stores, moving kiosks, and flexible payments.
            </p>
          </motion.div>

          {/* Col 2: Nav links */}
          <motion.div
            custom={1}
            variants={colVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h3 className="font-syne font-bold text-sm text-white/40 uppercase tracking-widest mb-5">
              Navigate
            </h3>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <FooterNavLink label={link.label} href={link.href} />
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Col 3: Connect */}
          <motion.div
            custom={2}
            variants={colVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h3 className="font-syne font-bold text-sm text-white/40 uppercase tracking-widest mb-5">
              Connect
            </h3>
            <div className="flex items-center gap-3 mb-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/60 min-h-[40px]"
                  whileHover={{ scale: 1.15, backgroundColor: "rgba(255,107,53,0.2)", color: "#FF6B35" }}
                  whileTap={{ scale: 0.92 }}
                  transition={spring}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
            <p className="text-xs font-inter text-white/40 mb-3 uppercase tracking-widest">Language</p>
            <FooterLangSwitcher />
          </motion.div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-inter text-white/40">
            © 2026 Moul7anout. All rights reserved.
          </p>
          <p className="text-xs font-inter text-white/40">
            Made with ❤️ in Casablanca
          </p>
        </div>
      </div>
    </footer>
  );
}
