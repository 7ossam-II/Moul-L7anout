# Moul7anout — Website CLAUDE.md
> Claude Code reads this automatically. This file covers the **marketing website only** (`website/` folder, `website` branch). The app lives on the `app` branch — do not touch it here.

---

## What You Are Building

**moul7anout.ma** — the public marketing website for Moul7anout, a Moroccan local marketplace app. This is a pure frontend, single-page marketing site. No backend, no auth, no database. The goal is to be visually stunning enough to impress investors, convince local store owners to sign up, and support the Grab/Agoda internship application.

Think of the reference bar as: **Glovo's website** meets **a Moroccan souk** meets **a premium tech startup landing page**.

---

## Branch & Folder Rules

| Branch | What lives here |
|---|---|
| `website` | The marketing website — your workspace |
| `app` | The Next.js app (buyer/seller screens) — do not touch |
| `main` | Production — never touch directly |
| `develop` | Integration — never push directly |

**Your branch naming:** Always create `feature/website-[task]` off the `website` branch.

```bash
git checkout website
git pull origin website
git checkout -b feature/website-[what-you-are-doing]
# work
git add .
git commit -m "feat(website): description"
git push origin feature/website-[what-you-are-doing]
# open PR → base: website
```

**Your working directory is always `website/`.** Never edit anything outside it.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS 3 |
| Animations | **Framer Motion 11** — already in package.json |
| Icons | Lucide React |
| Language | TypeScript |
| Fonts | Syne (headings) + Inter (body) + Noto Sans Arabic (Arabic text) — load via next/font/google |

---

## Design System — Non-Negotiable

### Brand Colors
```css
--navy:       #0F4C81   /* Primary — headers, CTAs, nav background */
--orange:     #FF6B35   /* Accent — badges, highlights, hover states */
--cream:      #FAFAF5   /* Page background — warm white, not pure white */
--charcoal:   #1A1A2E   /* Dark text — richer than pure black */
--gray-mid:   #6B7280   /* Secondary text, borders */
--gray-light: #F0F4F8   /* Card backgrounds, subtle sections */
```

### Typography
```
Headings (h1–h3):  Syne, 700–800 weight — geometric, confident
Body text:          Inter, 400–500 weight — clean, readable
Arabic strings:     Noto Sans Arabic — always, no exceptions
Accent/labels:      Syne, 600 weight, letter-spacing: 0.05em
```

### Design Principles
1. **Not centered purple gradient** — avoid the generic AI-generated look. Use asymmetric layouts, diagonal section dividers, and off-center compositions.
2. **Moroccan warmth** — the cream background, warm shadows, and occasional geometric Moroccan pattern motifs (zellige-inspired) give it cultural identity without being cliché.
3. **Mobile-first** — 60%+ of Moroccan internet users are on mobile. Every section must look perfect at 390px before you think about desktop.
4. **Depth over flatness** — use layered cards, subtle drop shadows (`shadow-lg`), and background texture (a very subtle noise grain at 3% opacity) rather than flat color blocks.
5. **Motion with purpose** — every animation must have a reason. Scroll-triggered reveals for sections. Hover lifts for cards. No looping decorative animations that distract.

### Section Layout Order (page.tsx imports these in order)
```
1. <Navbar />              ← Sticky, transparent → solid on scroll
2. <Hero />                ← Full-height, phone mockup, animated tagline
3. <HowItWorks />          ← 3-step flow with animated connectors
4. <Features />            ← Feature grid with icon cards
5. <ForSellers />          ← Split layout: text left, form/CTA right
6. <CasablancaMap />       ← Visual map section showing neighborhoods
7. <Footer />              ← Links, social, language switcher
```

---

## Framer Motion — Animation Rules

Install is already in `package.json`. Import: `import { motion, useInView, useScroll, useTransform } from 'framer-motion'`

**Standard variants to reuse across all sections:**

```typescript
// Fade up — use for most text and card entrances
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

// Stagger container — wrap lists of cards
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

// Scale in — use for feature icons and badges
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
}
```

**Rules:**
- Always use `useInView({ once: true, margin: '-80px' })` so animations trigger once as the user scrolls down
- Duration: 0.3–0.5s for most elements, never more than 0.7s
- Never animate `width` or `height` — animate `transform` and `opacity` only (GPU-accelerated)
- Always add `will-change: transform` via Tailwind's `will-change-transform` on animated elements
- Wrap all motion in: `const prefersReduced = useReducedMotion()` — if true, skip animations

---

## 21st.dev MCP — How to Use

When you have the 21st.dev MCP configured, use it to pull components. **Always adapt them:**

1. Replace any blue/purple with `#0F4C81`
2. Replace any red/pink accent with `#FF6B35`
3. Change background from pure white to `#FAFAF5`
4. Remove any `max-w-7xl mx-auto` desktop-only constraints — keep mobile-first
5. Add Framer Motion entrance animation using the standard variants above
6. Place the result in `components/sections/` or `components/ui/` as appropriate

**Best components to pull from 21st.dev for this project:**
- Animated hero with floating elements
- Feature grid with icon cards
- Testimonial / social proof section
- Sticky navigation with blur backdrop
- Animated step/timeline component (for HowItWorks)
- Footer with newsletter input

---

## String Tune — Copy Guidelines

When using String Tune to generate copy, always specify:

- **Tone:** Warm, confident, local — not corporate. Speaks like a trusted neighbor, not a Silicon Valley startup.
- **Language:** Generate in English first, then Arabic (Darija-influenced Modern Standard), then French
- **Brand voice keywords:** Local, trusted, fast, Moroccan, neighborhood, community
- **Avoid:** "Revolutionary", "disruptive", "world-class", "seamless" — too generic

**Key copy that must appear on the site:**

| Element | English | Arabic | French |
|---|---|---|---|
| App name | Moul7anout | مول الحانوت | Moul7anout |
| Tagline | Your neighborhood. Your market. | سوقك. حيّك. | Ton quartier. Ton marché. |
| Hero subtext | Discover stores, buy local, pay your way. | اكتشف المتاجر، اشتري محلياً، ادفع كيف تريد. | Découvrez les commerces, achetez local, payez à votre façon. |
| LKRIDI CTA | Pay in 3× with LKRIDI | ادفع على 3 أقساط مع لكريدي | Payez en 3× avec LKRIDI |
| Seller CTA | List your store for free | أضف متجرك مجاناً | Ajoutez votre boutique gratuitement |

---

## The Hero Section — Most Important

The Hero is the first thing visitors see. It must do 5 things:
1. Communicate what the app is in under 3 seconds
2. Show the app visually (phone mockup — use a realistic iPhone frame SVG or PNG)
3. Have two clear CTAs: **Download App** (orange button) and **Join as Seller** (outlined navy button)
4. Feel Moroccan — warm cream background, subtle zellige-pattern texture in the background at low opacity
5. Animate on load — headline words stagger in, phone mockup slides up from below

**Hero layout (desktop):** Left half = headline + subtext + CTAs + trust badges (e.g., "15+ neighborhoods · 500+ stores · LKRIDI payments"). Right half = phone mockup floating with a subtle shadow and slow floating animation (y: 0 → -12px → 0, 4s loop, ease-in-out).

**Hero layout (mobile):** Phone mockup at top, text below, CTAs stacked full-width.

---

## LKRIDI — Explain It Clearly

LKRIDI is the most unique feature. Many visitors won't know what it is. The website must explain it simply:

> "Can't pay all at once? No problem. LKRIDI lets you split your purchase into 3 or 6 monthly payments — accepted by local stores, no bank required."

Show it as a visual: a product price (e.g., MAD 1,500) split into 3 cards showing MAD 500/month each, with a checkmark on the first one.

---

## Casablanca Neighborhoods to Reference

The site should feel hyper-local. Use these neighborhood names naturally in copy and the map section:
Maarif · Gauthier · Anfa · Ain Diab · Hay Hassani · Derb Sultan · Bourgogne · Sidi Belyout · Oulfa · Bernoussi · Sidi Maarouf · Bouskoura

---

## What NOT to Do

- Do not add any backend API calls — this is a static marketing site
- Do not use `useAuth` or any auth context — not needed here
- Do not add a login/register flow — just a "Join as Seller" form that shows a success toast (no real submission)
- Do not use purple, teal, or any color outside the brand palette
- Do not use Inter for headings — Syne only for h1–h3
- Do not center every section — vary the layout (left-aligned, right-aligned, asymmetric grid)
- Do not add more than 6 sections — keep it focused

---

## Commit Format

```
feat(website): add Hero section with Framer Motion entrance animation
feat(website): add HowItWorks 3-step animated flow
style(website): apply brand colors to Navbar
fix(website): correct mobile layout for Features grid
```

---

*Moul7anout Website — April 2026*
