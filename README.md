# Moul7anout — Marketing Website

**Live domain:** [moul7anout.ma](https://moul7anout.ma)  
**Branch:** `website`  
**Stack:** Next.js 14 + Tailwind CSS 3 + Framer Motion + TypeScript

This branch contains the high-end "Clean Digital Souk" marketing site for the Moul7anout platform. It is completely separate from the core application (which lives on the `develop` branch). This is a pure frontend project with no backend, no authentication, and no database.

---

## 🐳 Zero-Config Preview (Docker)

The easiest way for investors, stakeholders, and team members to view the "perfect" version of the website—with all animations and fonts identical to the master design—is by using Docker.

### Prerequisites
- Docker and Docker Compose installed on your machine.

### How to Run Locally

1. **Clone the repository and switch to the website branch**:
   ```bash
   git clone https://github.com/7ossam-II/Moul-L7anout.git
   cd Moul-L7anout
   git checkout website
   ```

2. **Navigate to the website directory**:
   ```bash
   cd website
   ```

3. **Launch the site with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

4. **View the site**:
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

To stop the container, press `Ctrl+C` in your terminal, or run `docker-compose down` from another terminal window in the same directory.

---

## 💻 Local Development (Without Docker)

If you need to make changes to the website code, you can run it locally using Node.js.

### Prerequisites
- Node.js 20+ installed.
- npm or pnpm installed.

### Setup Steps

1. **Navigate to the website directory**:
   ```bash
   cd website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **View the site**:
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```text
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
├── public/              ← Static assets (logo, og-image, etc.)
├── Dockerfile           ← Docker configuration for the Next.js app
└── docker-compose.yml   ← Docker Compose configuration for easy deployment
```

---

## 🎨 Design Specifications

The UI follows the **Clean Digital Souk** design philosophy:

- **Primary Color:** Deep Teal `#0F4C81` (trust, reliability)
- **Accent Color:** Vibrant Orange `#FF6B35` (prices, CTAs, energy)
- **Typography:** Syne (Headlines), Plus Jakarta Sans (Body)
- **Animations:** Powered by Framer Motion for smooth, Apple-style micro-interactions.

---

*Note: For development on the core application logic (Buyer App, Seller Dashboard, Backend API), please switch to the `develop` branch.*
