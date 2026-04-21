# Moul7anout Website — 10x Developer Workflow

## 1. Design Philosophy (UI UX PRO MAX)
- **Brand Colors**: Teal Blue (#0F4C81) and Vibrant Orange (#FF6B35).
- **Typography**: Syne (Headings) + Plus Jakarta Sans (Body).
- **Motion**: Every section must use `framer-motion` for entry and scroll animations.
- **Vibe**: "Clean Digital Souk" — modern, premium, and Moroccan.

## 2. Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 3. Development Strategy
1. **Consult Skills**: Always use the `ui-ux-pro-max` skill for UI decisions.
2. **Consult Resources**: Read `website/resources/awesome-design/` for marketplace design patterns.
3. **No Backend**: This branch is for the marketing site ONLY. Do not add auth, database, or API logic.
4. **Sectional Building**: Build one section at a time in `components/sections/` and import them into `app/page.tsx`.

## 4. Required Sections
- **Hero**: Premium intro with Syne font and clear CTA.
- **Features**: Real-time map, Moving Kiosks, and Lkridi system.
- **For Sellers**: Value proposition for local shop owners.
- **Interactive Map**: A visual representation of Casablanca with store pins.
- **How It Works**: Step-by-step guide for users.
