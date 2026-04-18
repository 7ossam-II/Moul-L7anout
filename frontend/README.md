# Moul7anout — Frontend

This is the **production frontend** for Moul7anout, built with Next.js 16 and React 19.

> **Looking for the interactive prototype?** Switch to the `frontend-mvp` branch — it has the full working demo with all 6 screens (Home feed, Map, Store Detail, Product Catalog, Cart, Post & Sell).

---

## Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16 | React framework with App Router |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Utility-first styling |

---

## Getting Started

```bash
# From the repo root
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
frontend/
├── app/              ← Next.js App Router pages
├── components/       ← Reusable UI components
├── contexts/         ← React context providers
├── lib/              ← Utility helpers and API clients
├── public/           ← Static assets (images, icons)
└── tailwind.config.js
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the backend API (e.g., `http://localhost:5000`) |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Maps API key for the map screen |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Design System

The UI follows the **Clean Digital Souk** design philosophy:

- **Primary color:** Deep teal `#0F4C81` (trust, reliability)
- **Accent color:** Vibrant orange `#FF6B35` (prices, CTAs, energy)
- **Typography:** Plus Jakarta Sans
- **Inspiration:** 闲鱼 (Xianyu) feed layout + Meituan store discovery

---

## Contributing

See the root [CONTRIBUTING.md](https://github.com/7ossam-II/Moul-L7anout/blob/develop/CONTRIBUTING.md) for the full workflow. For frontend-specific work:

1. Branch from `develop`: `git checkout -b feature/ui-your-feature`
2. Work in the `frontend/` directory only
3. Open a PR to `develop` when done
