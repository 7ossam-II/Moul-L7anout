"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Download, Store, MapPin, ShoppingBag, CreditCard } from "lucide-react";
import PhoneMockup from "@/components/ui/PhoneMockup";

const trustBadges = [
  { icon: MapPin, label: "15+ Neighborhoods" },
  { icon: Store, label: "500+ Stores" },
  { icon: CreditCard, label: "LKRIDI Payments" },
];

const headlineWords = ["Your", "Neighborhood.", "Your", "Market."];

export default function Hero() {
  const prefersReduced = useReducedMotion();

  const wordVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 32 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: i * 0.1 },
    }),
  };

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const phoneVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 48 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.3 } },
  };

  return (
    <section className="relative min-h-screen bg-cream zellige-bg overflow-hidden flex items-center pt-16">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-navy/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          <div className="order-2 lg:order-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 bg-orange/10 border border-orange/20 rounded-full px-4 py-1.5 mb-6"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-orange" />
              <span className="text-xs font-syne font-semibold text-orange tracking-widest uppercase">
                Moroccan Local Marketplace
              </span>
            </motion.div>

            <h1 className="font-syne font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-charcoal mb-6">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  className={`inline-block mr-3 will-change-transform ${
                    word === "Your" ? "text-navy" : "text-charcoal"
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-mid font-inter leading-relaxed mb-3 max-w-md"
            >
              Discover stores, buy local, pay your way.
            </motion.p>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              className="text-base font-arabic text-gray-mid mb-8 max-w-md text-right"
              dir="rtl"
            >
              اكتشف المتاجر، اشتري محلياً، ادفع كيف تريد.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-orange text-white font-syne font-bold text-base px-7 py-4 rounded-full hover:bg-orange/90 active:scale-95 transition-all will-change-transform min-h-[52px]"
              >
                <Download className="w-4 h-4" />
                Download App
              </a>
              <a
                href="#for-sellers"
                className="inline-flex items-center justify-center gap-2 border-2 border-navy text-navy font-syne font-bold text-base px-7 py-4 rounded-full hover:bg-navy hover:text-white active:scale-95 transition-all will-change-transform min-h-[52px]"
              >
                <Store className="w-4 h-4" />
                Join as Seller
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.85 }}
              className="flex flex-wrap gap-4"
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-inter text-gray-mid">
                  <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-navy" />
                  </div>
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              variants={phoneVariants}
              initial="hidden"
              animate="visible"
              className={`will-change-transform ${prefersReduced ? "" : "animate-float"}`}
            >
              <PhoneMockup />
            </motion.div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#F0F4F8" />
        </svg>
      </div>
    </section>
  );
}
