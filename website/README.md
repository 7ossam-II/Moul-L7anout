# Moul7anout — Marketing Website
**Live domain:** moul7anout.ma
**Branch:** `website`
**Stack:** Next.js 14 + Tailwind CSS 3 + Framer Motion + TypeScript

This is the public-facing marketing website for the Moul7anout app. It is completely separate from the app (which lives in `frontend/` on the `app` branch). No backend, no auth, no database — pure frontend.

## Structure
```
website/
├── app/
│   ├── layout.tsx       ← Root layout, fonts, metadata
│   ├── page.tsx         ← Single page — imports all sections in order
│   └── globals.css      ← Tailwind base + custom CSS variables
├── components/
│   ├── sections/        ← One file per page section
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── ForSellers.tsx
│   │   ├── CasablancaMap.tsx
│   │   └── Footer.tsx
│   ├── ui/              ← Reusable primitives (Button, Badge, etc.)
│   └── shared/          ← Navbar, LanguageSwitcher
├── lib/
│   └── utils.ts         ← cn() helper and utilities
└── public/              ← Static assets (logo, og-image, etc.)
```

## Dev Setup
```bash
cd website
npm install
npm run dev
# → http://localhost:3000
```
