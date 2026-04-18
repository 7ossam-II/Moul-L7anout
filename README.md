# Moul7anout — مول الحانوت

> **A location-based local marketplace for Morocco** — connecting buyers with nearby sellers, moving kiosks, and local stores in real time.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-orange.svg)]()

---

## What Is Moul7anout?

Moul7anout (Arabic: مول الحانوت, "the shop owner") is a mobile-first marketplace platform built for the Moroccan market. It combines the product discovery model of 闲鱼 (Xianyu) with the local store map experience of Meituan, adapted for Moroccan culture and commerce.

**Core features:**

- **Map-based store discovery** — find nearby shops, food stalls, and kiosks on a live map
- **C2C marketplace** — individuals can list and sell second-hand items directly
- **Moving kiosk tracking** — real-time GPS tracking for mobile vendors
- **LKRIDI** — a trust-based micro-loan system between buyers and sellers
- **QR-code fulfillment** — dual-confirmation (buyer + seller scan) for transaction completion
- **Multi-language** — Arabic, Darija, French, and English

---

## Repository Structure

```
Moul-L7anout/
├── frontend/          ← Next.js 16 web app (storefront UI)
├── backend/           ← Node.js + Express API server
└── docs/              ← Architecture diagrams and specs
```

The live interactive prototype (built with React + Vite) lives on the `frontend-mvp` branch.

---

## Branches

| Branch | Purpose | Who works here |
|---|---|---|
| `main` | Stable, reviewed code only. Never commit directly. | Everyone (via PRs) |
| `develop` | Active integration branch. All features merge here first. | Everyone (via PRs) |
| `frontend-mvp` | Live interactive prototype (React + Vite + Tailwind) | Frontend team |
| `feature/*` | Individual feature branches, created from `develop` | Individual contributors |

**Rule:** Never push directly to `main` or `develop`. Always open a Pull Request.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend (prototype) | React 19, Vite, TypeScript, Tailwind CSS 4, shadcn/ui |
| Frontend (production) | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB + Mongoose |
| Real-time | Socket.IO |
| Cache / Queue | Redis, BullMQ |
| Maps | Google Maps JavaScript API |
| Containerization | Docker, Docker Compose |

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Git](https://git-scm.com/)

### Clone the repository

```bash
git clone https://github.com/7ossam-II/Moul-L7anout.git
cd Moul-L7anout
```

### Run the interactive prototype (frontend-mvp branch)

```bash
git checkout frontend-mvp
pnpm install
pnpm dev
# → Open http://localhost:3000
```

### Run the frontend (main branch)

```bash
cd frontend
npm install
npm run dev
# → Open http://localhost:3000
```

### Run the backend (main branch)

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
npm run dev
# → API running at http://localhost:5000
```

---

## Contributing

Please read [CONTRIBUTING.md](https://github.com/7ossam-II/Moul-L7anout/blob/develop/CONTRIBUTING.md) before opening a Pull Request. The short version:

1. Create a branch from `develop`: `git checkout -b feature/your-feature-name`
2. Make your changes and commit with a clear message
3. Push and open a PR targeting `develop`
4. Wait for review before merging

---

## Team

| Name | Role |
|---|---|
| Hossam | Founder, Lead Developer, UI/UX |
| Teammate 2 | Content & Copywriting |
| Teammate 3 | Market Research |
| Teammate 4 | Product Testing & QA |
| Teammate 5 | Social Media & Community |

---

## License

MIT © 2025 Moul7anout Team
