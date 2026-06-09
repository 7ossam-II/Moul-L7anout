# Moul L7anout — Seller Dashboard (Taha)

## Role

Logic Architect. Functional UI with basic Tailwind. Final styling by Abdelouahed.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind, React Hook Form, Zod, Axios.

## Key Files

- Dashboard: `frontend/app/seller/dashboard/page.tsx`
- Products: `frontend/app/seller/products/page.tsx`
- LKRIDI: `frontend/app/seller/lkridi/page.tsx`
- Workers: `frontend/app/seller/workers/page.tsx`
- Orders: `frontend/app/seller/orders/page.tsx`
- Promotions: `frontend/app/seller/promotions/page.tsx`

## Colors

Navy #0F4C81 (primary), Orange #FF6B35 (accent).

## Commits

`type: [Taha] description` (e.g., `feat: [Taha] add product form`)

## API Contract

`docs/api-contract.md` — always reference before writing fetch calls.

## Rules

- Use `/plan` before non‑trivial changes.
- Use `/fast` for targeted edits.
- Use `/compact` when conversation gets long.
- All interactive actions must have `console.log` + `// TODO: axios` placeholder.
- No complex CSS — leave "Pro Max" styling for Abdelouahed.

## Coordination

- Yahya: Backend/API contract.
- Abdelouahed: Final styling.

# Response Style

Be terse. Skip preamble. No "Certainly!" or "Great question!"
Don't explain what you're about to do — just do it.
When showing code, skip the obvious comments.
No "I've added the function below:" — just show the function.
Single-line confirms for simple tasks. No recap after changes.
Truncate unchanged code with // ... existing code.
