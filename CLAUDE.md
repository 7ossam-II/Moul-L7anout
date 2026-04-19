# Moul7anout — Claude Code Context File
> Claude Code reads this file automatically at the start of every session. Do not delete it.

---

## What This Project Is

**Moul7anout** (مول الحانوت) is a Moroccan local marketplace app — a mix of 闲鱼 (peer-to-peer selling), Meituan (map-based store discovery), and a local souk. Target market: Casablanca, Morocco. Currency: MAD (Moroccan Dirham). Languages: Arabic, French, Darija (Moroccan Arabic).

**Repo:** `https://github.com/7ossam-II/Moul-L7anout`

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 |
| Backend | Node.js + Express 4 + TypeScript |
| Database | MongoDB + Mongoose 8 |
| Cache / Queue | Redis + BullMQ |
| Auth | JWT (access + refresh tokens) |
| Payments | Stripe + LKRIDI (Moroccan installment system) |
| Real-time | Socket.io |
| Media | Cloudinary |
| SMS | Twilio |

---

## Repository Structure

```
Moul-L7anout/
├── frontend/                    ← Next.js App Router (your main workspace)
│   ├── app/
│   │   ├── page.tsx             ← Root redirect (→ /buyer/dashboard or /auth/login)
│   │   ├── auth/                ← Login, Register, Verify OTP
│   │   ├── buyer/               ← Buyer screens (dashboard, discover, map, cart, checkout, orders, profile, lkridi)
│   │   ├── seller/              ← Seller screens (dashboard, stores, products, lkridi)
│   │   ├── admin/               ← Admin screens (dashboard, sellers, disputes, ads)
│   │   ├── delivery/            ← Delivery agent screens
│   │   └── worker/              ← Store worker screens
│   ├── components/
│   │   ├── ui/                  ← Base components: Card, Modal, Spinner, button
│   │   ├── shared/              ← BottomTabBar, Navbar, LanguageSwitcher, OfflineIndicator
│   │   ├── buyer/               ← ProductCard, StoreCard
│   │   ├── seller/, chat/, map/, qr/, rating/, delivery/, worker/
│   ├── lib/
│   │   ├── api/                 ← API client + all endpoint functions (endpoints.ts)
│   │   ├── hooks/               ← useAuth, useApi, useGeolocation, useChat, etc.
│   │   ├── types/               ← api.types.ts — all TypeScript interfaces
│   │   ├── providers/           ← QueryProvider (React Query)
│   │   ├── stores/              ← Zustand stores (if any)
│   │   └── config/              ← App config
│   ├── contexts/                ← AuthContext (wraps JWT auth state)
│   └── messages/                ← i18n JSON files (en.json, ar.json, fr.json)
│
├── backend/
│   └── src/
│       ├── controllers/         ← One controller per domain
│       ├── models/              ← Mongoose models (to be created by Yahya)
│       ├── routes/              ← Express routes
│       ├── middleware/          ← Auth, error handling, rate limiting
│       ├── jobs/                ← BullMQ background jobs
│       ├── lib/                 ← Cloudinary, Redis, Socket, Stripe, Twilio
│       └── config/              ← DB, env, payment, redis config
│
└── docs/                        ← Team documentation
```

---

## Branch Rules — CRITICAL

| Branch | Rule |
|---|---|
| `main` | Never touch. Production only. |
| `develop` | Never push directly. Always open a PR. |
| `frontend-mvp` | Interactive prototype. Hossam + Manus work here. |
| `feature/claude-*` | **Your branch prefix.** Always branch off `develop`. |

**Your workflow every session:**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/claude-[what-you-are-doing]
# do your work
git add .
git commit -m "feat(scope): description"
git push origin feature/claude-[what-you-are-doing]
# then open a PR to develop on GitHub
```

**Commit format** (Conventional Commits — enforced by CI):
```
feat(buyer): add product detail page with image gallery
fix(auth): handle expired JWT refresh token edge case
style(seller): apply brand colors to dashboard header
```

---

## Design System — Apply This to Every Screen You Touch

### Brand Colors
```css
--brand-navy:   #0F4C81   /* Primary — headers, active states, CTAs */
--brand-orange: #FF6B35   /* Accent — badges, highlights, price tags */
--brand-white:  #FAFAF8   /* Background */
--brand-gray:   #6B7280   /* Secondary text */
--brand-light:  #F0F4F8   /* Card backgrounds, input fills */
```

### Typography
- **Display / Headings:** Syne (Google Font) — bold, geometric
- **Body / UI:** Inter — clean, readable
- **Arabic text:** Noto Sans Arabic — always use when rendering Arabic strings

### Mobile-First Rules
- All buyer/seller screens are **mobile-first** — max-width 430px, centered on desktop
- Bottom navigation bar height: 56px — always account for this with `pb-14` on page content
- Touch targets: minimum 44×44px
- No hover-only interactions — everything must work on touch

### Component Patterns
- Cards: `rounded-2xl shadow-sm border border-gray-100 bg-white`
- Primary button: `bg-[#0F4C81] text-white rounded-xl font-semibold`
- Price display: always `MAD {amount}` — never just numbers
- Loading state: use the existing `<Spinner />` from `components/ui/Spinner.tsx`
- Empty state: centered illustration + heading + subtext + CTA button

### What Already Exists — Check Before Building
Before creating any new component, check these:
- `components/ui/` — Card, Modal, Spinner, button
- `components/shared/` — BottomTabBar, Navbar, LanguageSwitcher, OfflineIndicator
- `components/buyer/` — ProductCard, StoreCard
- `lib/api/endpoints.ts` — ALL API calls are already defined here, use them
- `lib/hooks/useAuth.ts` — authentication state
- `lib/hooks/useApi.ts` — data fetching wrapper
- `contexts/AuthContext.tsx` — auth context

---

## API Contract

The backend runs at `http://localhost:5000` in development. The frontend API client is at `lib/api/client.ts` — use it for all requests, never use raw `fetch`.

**All API calls go through `lib/api/endpoints.ts`.** If an endpoint you need doesn't exist there, add it to that file — do not inline API calls in page components.

**Auth:** JWT stored in localStorage. The API client automatically attaches the Bearer token. Use `useAuth()` hook to check authentication state.

**Test credentials (development):**
- Buyer: `buyer@example.com` / `password123`
- Seller: `seller@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

---

## Current Screen Status

| Screen | Path | Status |
|---|---|---|
| Login | `/auth/login` | ✅ Working — basic UI, needs design polish |
| Register | `/auth/register` | ✅ Working — basic UI |
| OTP Verify | `/auth/verify-otp` | ✅ Working — basic UI |
| Buyer Dashboard | `/buyer/dashboard` | ⚠️ Placeholder — shows name/role only |
| Discover (Stores) | `/buyer/discover` | ⚠️ Placeholder — needs real store cards |
| Store Detail | `/buyer/discover/storeId` | ⚠️ Placeholder |
| Map | `/buyer/map` | ⚠️ Placeholder — Google Maps not wired |
| Cart | `/buyer/cart` | ⚠️ Placeholder |
| Checkout | `/buyer/checkout` | ⚠️ Placeholder |
| Orders | `/buyer/orders` | ⚠️ Placeholder |
| LKRIDI | `/buyer/lkridi` | ⚠️ Placeholder |
| Buyer Profile | `/buyer/profile` | ⚠️ Placeholder |
| Seller Dashboard | `/seller/dashboard` | ⚠️ Placeholder |
| Seller Stores | `/seller/stores` | ⚠️ Placeholder |
| Seller Products | `/seller/stores/storeId/products` | ⚠️ Placeholder |
| Admin Dashboard | `/admin/dashboard` | ⚠️ Placeholder |

**Priority order for UI work:** Buyer Dashboard → Discover → Store Detail → Map → Seller Dashboard

---

## LKRIDI — The Core Feature

LKRIDI is Moul7anout's built-in installment payment system (like BNPL but for Moroccan local commerce). When a buyer checks out, they can choose to pay in 3× or 6× monthly installments. The seller approves or declines. This is a key differentiator — treat it as a first-class feature, not an afterthought.

**LKRIDI flow:** Buyer selects installment plan at checkout → Seller receives request in `/seller/lkridi/requests` → Seller approves → Monthly payment schedule is created → Background job (`lkridiAutoRepayment.job.ts`) handles automatic deductions.

---

## Tools Available for UI Work

When Hossam asks you to improve the UI, you have access to:

- **Framer Motion** — install with `npm install framer-motion` if not present. Use for: page transitions, card entrance animations, button press feedback, bottom sheet slides.
- **21st.dev MCP** — if configured, use it to pull production-ready components. Always adapt them to the brand colors and mobile-first rules above.
- **Lucide React** — icon library, already available. Import: `import { IconName } from 'lucide-react'`
- **Tailwind CSS 4** — already configured. Use `@theme inline` blocks in globals.css for custom tokens.

**Animation rules:**
- Duration: 150–300ms for micro-interactions, 300–500ms for page transitions
- Easing: `ease-out` for entrances, `ease-in` for exits
- Never animate more than 2 properties simultaneously on mobile
- Respect `prefers-reduced-motion` — wrap all animations in a check

---

## Coordination with Manus

Manus (the other AI working on this project) handles:
- CI/CD fixes and GitHub Actions
- Architecture decisions and complex planning
- The `frontend-mvp` prototype (separate React + Vite app in `/home/ubuntu/moul7anout/`)
- Team documentation

You (Claude) handle:
- Frontend screen implementation in `frontend/app/`
- Component creation in `frontend/components/`
- UI polish and design system application
- API integration (connecting screens to `lib/api/endpoints.ts`)

**To avoid conflicts:** Manus works on `frontend-mvp` branch. You work on `feature/claude-*` branches off `develop`. We never edit the same files at the same time.

If you are unsure whether a file has been recently modified by Manus, check: `git log --oneline -10 -- [filename]`

---

## What Hossam Expects

- **Never break CI.** Before pushing, mentally check: does this TypeScript compile? Are all imports valid?
- **Every page must have `export const dynamic = 'force-dynamic'`** if it uses `useQuery`, `useEffect`, `localStorage`, or any browser API.
- **Every page must have `'use client'`** at the top if it uses any React hooks.
- **No hardcoded English strings** in new screens — use the translation keys from `messages/en.json` via `next-intl`.
- **Mobile first, always.** Test at 390px width mentally before considering desktop.
- **Ask before refactoring.** If you think a file needs to be restructured, describe the change and wait for approval. Do not silently rewrite working code.

---

*Last updated: April 2026 — Moul7anout Team*
