# Moul7anout — Developer Hub

Welcome to the core development branch of Moul7anout. This is where the magic happens. The `develop` branch contains the core application, including the Buyer App, Seller Dashboard, and Backend API.

This document serves as your one-time onboarding guide. It covers everything from cloning the repository to understanding your specific role for the next 72 hours. Small updates and daily communication will be handled in the WeChat group.

---

## 📦 The Git Orchestration

Follow this exactly to avoid conflicts and lost code. No exceptions.

### 1. The Repo Structure
- **`main`**: Production-only. Stable, tested code.
- **`website`**: Marketing site only. No backend.
- **`develop`**: The core app (Buyer, Seller, Backend). **This is where you will work.**

### 2. Initial Setup (For Everyone)
Open your terminal and run these commands to start fresh:

```bash
# 1. Clone the repository
git clone https://github.com/7ossam-II/Moul-L7anout.git
cd Moul-L7anout

# 2. Switch to the development branch
git checkout develop

# 3. Create your own feature branch (e.g., for Taha)
git checkout -b feature/taha-seller-logic
```

### 3. The "Commit & Push" Cycle
Before you start coding every day, ensure you have the latest changes:
```bash
git pull origin develop
```

When you finish a small task (e.g., one form or one DB table), commit and push your work:
```bash
git add .
git commit -m "feat: [your name] added product upload logic"
git push origin feature/your-branch-name
```

---

## 🚀 The Next 72 Hours: Critical Milestones

| Hour | Milestone | Who is Responsible |
|------|-----------|--------------------|
| **12h** | DB Schema pushed + i18n Setup finished | Yahya & Ibrahim |
| **24h** | Product Upload Form Logic working (no style) | Taha |
| **36h** | Dashboard UI "Pro Max" Styling applied | Abdelouahed |
| **48h** | "Join as Seller" from Website creates a DB entry | Everyone (Integration) |

---

## 🎯 Role Cards: Your Mission

### CARD 1 — LEAD ARCHITECT (DATABASE & BACKEND)
**Assigned to: Yahya**

**Your Mission:** You are the "Foundation Specialist." You will build the core engine that powers everything. If your database is weak, the UI will lag and the app will crash. Your goal is to build a schema that is scalable, secure, and type-safe.

**Tools You Need:**
- **Prisma ORM:** For type-safe database access.
- **MongoDB:** The current database setup on the `develop` branch.
- **TypeScript:** No `any` allowed.

**Step-by-Step Execution:**
1. **Initialize the Schema:** Run `npx prisma init` in the `backend/` directory. Define core models: `User`, `Store`, `Product`, and `LkridiRecord`.
2. **Create the API Contract:** Create `docs/api-contract.md`. Write exactly what the frontend should send and what the backend will return (e.g., POST `/api/products`).
3. **Auth Middleware:** Create `backend/src/middleware/auth.ts`. Use JWT to verify the user. If a seller tries to access an admin route, return `403 Forbidden`.

**Coordination:**
- **With Taha:** You MUST give him the `api-contract.md` before he writes a single line of fetch code.
- **With Ibrahim:** Once you finish the `Store` and `Product` tables, explain the schema to him so he can build the Buyer App filters.

**Avoid These Pitfalls:**
- **Do not hardcode secrets:** Use `.env` for database URLs and JWT secrets.
- **Do not skip validation:** Use Zod to validate all incoming data.

---

### CARD 2 — SELLER ENGINE (FUNCTIONAL LOGIC)
**Assigned to: Taha**

**Your Mission:** You are the "Logic Architect." You build the brains of the Seller Dashboard. You don't care if the buttons are pretty yet; you care that when a seller clicks "Add Product," the data actually reaches Yahya's database.

**Tools You Need:**
- **React Hook Form:** For handling form state.
- **Zod:** For client-side validation.
- **Axios:** For API requests.

**Step-by-Step Execution:**
1. **The Dashboard Skeleton:** Create `frontend/app/seller/dashboard/page.tsx`. Add 4 stat cards: "Total Sales", "Pending Orders", "Active Lkridi", "Product Count". Use dummy data first.
2. **The Product Upload Form:** In `frontend/app/seller/stores/[storeId]/products/page.tsx`, build a form with Name, Category, Price, and Description. Add a toggle for "Enable LKRIDI". Console log the data on submit until Yahya provides the endpoint.
3. **LKRIDI Management Logic:** Create `frontend/app/seller/lkridi/requests/page.tsx`. Map through credit requests and add "Approve" and "Decline" buttons that trigger API calls.

**Coordination:**
- **With Yahya:** Ask him: "What is the exact JSON structure for the product upload?"
- **With Abdelouahed:** Once your form works, tell him: "The logic is ready in `page.tsx`. Now, make it look 'Pro Max'."

**Avoid These Pitfalls:**
- **Do not write complex CSS:** Use basic Tailwind classes. Let Abdelouahed handle the beauty.
- **Do not forget error states:** Show a message if the API call fails.

---

### CARD 3 — VISUAL LEAD (UI/UX PRO MAX)
**Assigned to: Abdelouahed**

**Your Mission:** You are the "Experience Designer." You take Taha's working logic and turn it into a world-class product. Your goal is to make the seller feel like they are using an app designed by Apple, but with a Moroccan soul.

**Tools You Need:**
- **Framer Motion:** For all animations.
- **Lucide React:** For premium icons.
- **Tailwind CSS:** For the "Clean Digital Souk" styling.

**Step-by-Step Execution:**
1. **Design Tokens & Layout:** Ensure `globals.css` has the brand colors: Teal (`#0F4C81`) and Orange (`#FF6B35`). Create a `Sidebar.tsx` with a backdrop-blur effect and smooth hover transitions.
2. **The "Pro Max" Dashboard:** Go to Taha's `dashboard/page.tsx`. Wrap his stat cards in `motion.div`. Add staggerChildren animations. Make the "Active Lkridi" card pulse subtly if there are new requests.
3. **Interactive LKRIDI Slider:** Build a custom component `LkridiSlider.tsx` using a range input. As the user slides, show the "Total Amount" splitting into 3 animated numbers. Use Orange (`#FF6B35`) for the track.

**Coordination:**
- **With Taha:** You are his "finisher." Ask him: "Which files have the working forms so I can style them?"
- **With the Team:** Look at the `website` branch code to see how the 3D phone tilt was done. Use that same logic for the Dashboard cards.

**Avoid These Pitfalls:**
- **Do not break Taha's logic:** Only change the `className` and wrap elements in `motion` divs. Do not change his `useState` or `onSubmit` functions.

---

### CARD 4 — I18N & FEATURE SUPPORT
**Assigned to: Ibrahim**

**Your Mission:** You are the "Bridge Builder." You ensure the app speaks the language of the people (Darija/Arabic/French) and you support the core database growth.

**Tools You Need:**
- **next-intl:** The industry standard for Next.js i18n.
- **JSON:** For translation files.

**Step-by-Step Execution:**
1. **Setup next-intl:** Run `npm install next-intl` in `frontend/`. Create the `messages/` folder and add `en.json`, `fr.json`, and `ar.json`. Fill these files with keys for "Home", "Settings", "Add Product", etc.
2. **RTL Implementation:** Ensure that when the language is Arabic, the entire layout flips. Use `dir={locale === 'ar' ? 'rtl' : 'ltr'}` in your root layout. Use Tailwind's `ps-4` (padding-start) instead of `pl-4` so it works in both directions.
3. **Buyer DB Support:** Coordinate with Yahya to build the query logic for "Find stores within 5km of my location" using the `lat` and `lng` stored in the `Store` table.

**Coordination:**
- **With Everyone:** You must tell the team: "Don't write `<h1>Home</h1>`. Write `<h1>{t('home')}</h1>`."
- **With Yahya:** Ask him for the `Store` table schema so you can start the location filtering logic.

**Avoid These Pitfalls:**
- **Do not use Google Translate:** It sounds robotic. Use Darija terms that real "Moul L7anout" customers use.

---

## 🛠️ Local Development Setup

If you need to run the full stack locally:

1. **Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

*Note: Ensure MongoDB and Redis are running locally or via Docker before starting the backend.*
