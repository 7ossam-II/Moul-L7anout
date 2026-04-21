"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Download, Store, MapPin, ShoppingBag, CreditCard } from "lucide-react";
import PhoneMockup from "@/components/ui/PhoneMockup";

const trustBadges = [
  { icon: MapPin, label: "15+ Neighborhoods" },
  { icon: Store, label: "500+ Stores" },
  { icon: CreditCard, label: "LKRIDI Payments" },
];

const headlineWords = ["Your", "Neighborhood.", "Your", "Market."];

const spring = { type: "spring", stiffness: 500, damping: 30 };
const softSpring = { type: "spring", stiffness: 200, damping: 20 };

function TiltPhone({ children, reduced }: { children: React.ReactNode; reduced: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), softSpring);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), softSpring);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const prefersReduced = useReducedMotion();

  const wordVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 32 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
    }),
  };

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const phoneVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 56, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.25 } },
  };

  return (
    <section className="relative min-h-screen bg-cream zellige-bg overflow-hidden flex items-center pt-16">
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-navy/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            {/* Eyebrow badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 bg-orange/10 border border-orange/20 rounded-full px-4 py-1.5 mb-6"
            >
              <motion.span
                animate={{ rotate: [0, -10, 10, -6, 0] }}
                transition={{ delay: 1.2, duration: 0.5, ease: "easeInOut" }}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-orange" />
              </motion.span>
              <span className="text-xs font-syne font-semibold text-orange tracking-widest uppercase">
                Moroccan Local Marketplace
              </span>
            </motion.div>

            {/* Headline */}
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

            {/* Subtext */}
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

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <motion.a
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-orange text-white font-syne font-bold text-base px-7 py-4 rounded-full min-h-[52px] shadow-[0_2px_16px_rgba(255,107,53,0.4)] will-change-transform"
                whileHover={{ scale: 1.04, boxShadow: "0 6px 28px rgba(255,107,53,0.5)" }}
                whileTap={{ scale: 0.96, boxShadow: "0 1px 8px rgba(255,107,53,0.3)" }}
                transition={spring}
              >
                <Download className="w-4 h-4" />
                Download App
              </motion.a>
              <motion.a
                href="#for-sellers"
                className="inline-flex items-center justify-center gap-2 border-2 border-navy text-navy font-syne font-bold text-base px-7 py-4 rounded-full min-h-[52px] will-change-transform"
                whileHover={{ scale: 1.04, backgroundColor: "#0F4C81", color: "#FAFAF5" }}
                whileTap={{ scale: 0.96 }}
                transition={spring}
              >
                <Store className="w-4 h-4" />
                Join as Seller
              </motion.a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.85 }}
              className="flex flex-wrap gap-4"
            >
              {trustBadges.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-2 text-sm font-inter text-gray-mid cursor-default"
                  whileHover={{ y: -2, color: "#0F4C81" }}
                  transition={{ delay: i * 0.05, ...spring }}
                >
                  <motion.div
                    className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center"
                    whileHover={{ scale: 1.2, backgroundColor: "rgba(15,76,129,0.18)" }}
                    transition={spring}
                  >
                    <Icon className="w-3 h-3 text-navy" />
                  </motion.div>
                  {label}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Phone with 3D tilt */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              variants={phoneVariants}
              initial="hidden"
              animate="visible"
            >
              <TiltPhone reduced={prefersReduced}>
                <div className={prefersReduced ? "" : "animate-float"}>
                  <PhoneMockup />
                </div>
              </TiltPhone>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#F0F4F8" />
        </svg>
      </div>
    </section>
  );
}
