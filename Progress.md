# AI Receptionist Platform — Progress Tracker

This document tracks the progress of each phase outlined in `PROJECT_SPEC.md`.

---

## Phase Status Summary

- [x] **Phase 1 — Project Setup** (Completed: 2026-07-29)
- [x] **Phase 2 — Routing** (Completed: 2026-07-29)
- [x] **Phase 3 — Supabase** (Completed: 2026-07-30)
- [ ] **Phase 4 — Business Context**
- [ ] **Phase 5 — Chat Widget (UI only)**
- [ ] **Phase 6 — Gemini Integration**
- [ ] **Phase 7 — Lead Capture**
- [ ] **Phase 8 — Dashboard (Authenticated)**
- [ ] **Phase 9 — Widget Embed Script**
- [ ] **Phase 10 — Deployment**

---

## Phase Details & Definition of Done

### Phase 1 — Project Setup
**Goal:** Project foundation, zero-budget-safe from the start.

- **Files Created/Modified:**
  - `package.json` (Next.js 15, TypeScript, Tailwind, `@supabase/supabase-js`, `@supabase/ssr`, `@google/genai`, `zod`, `react-hook-form`, `lucide-react`, `next-themes`)
  - `.env.example` & `.env.local`
  - `.gitignore` (explicit `.env.local` exclusion rule)
  - `components/theme-provider.tsx` & `components/theme-toggle.tsx`
  - `app/layout.tsx` & `app/page.tsx`
- **Definition of Done:**
  - [x] Repo is on GitHub (`git@github.com:Ham-07/ai-receptionist.git`)
  - [x] `.env.local` confirmed absent from the GitHub repo (verified via `git check-ignore` and untracked status)
  - [x] Homepage loads locally and dark mode toggles seamlessly

---

### Phase 2 — Routing
**Goal:** Support dynamic businesses via slug, with reserved slugs excluded.

- **Files Created/Modified:**
  - `lib/constants.ts` (Exported `RESERVED_SLUGS`, `isReservedSlug`, `formatSlugToTitle`)
  - `app/[slug]/page.tsx` (Dynamic tenant page using Next.js 15 `await params` pattern and reserved slug guard calling `notFound()`)
  - `app/not-found.tsx` (Custom 404 page for reserved or non-existent business routes)
- **Definition of Done:**
  - [x] `/smile-dental` (or similar test slug) displays correctly with dynamic tenant branding
  - [x] `/admin`, `/api`, `/dashboard`, `/widget`, etc. do NOT attempt to render as a business (triggers `notFound()` 404 page)

---

### Phase 3 — Supabase
**Goal:** Load a real business dynamically, with RLS on from day one.

- **Files Created/Modified:**
  - `app/globals.css` (Configured Tailwind v4 `@custom-variant dark` for class-based dark mode toggle)
  - `components/theme-toggle.tsx` (Updated to use `resolvedTheme`)
  - `lib/supabase/types.ts` (TypeScript interfaces for `businesses` table, hours, and widget settings)
  - `lib/supabase/server.ts` & `lib/supabase/client.ts` (Supabase client factories using `@supabase/ssr`)
  - `lib/businesses.ts` (Data fetching utility `getBusinessBySlug(slug)` with dev fallback mechanism)
  - `supabase/schema.sql` (Complete SQL DDL script for `businesses` table, unique slug constraint, RLS policy, and seed rows for `smile-dental` and `apex-law`)
  - `app/[slug]/page.tsx` (Updated to render real business name, phone, email, hours, primary brand color, and greeting)
- **Definition of Done:**
  - [x] Two test businesses exist in the schema script (`smile-dental` and `apex-law`)
  - [x] Each slug shows only its own business's data (Phone, Email, Hours, Primary Color, Greeting)
  - [x] RLS policy confirmed in schema script (`ALTER TABLE businesses ENABLE ROW LEVEL SECURITY`, `CREATE POLICY ... FOR SELECT USING (true)`)
