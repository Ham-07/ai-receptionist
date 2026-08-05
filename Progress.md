# AI Receptionist Platform — Progress Tracker

This document tracks the progress of each phase outlined in `PROJECT_SPEC.md`.

---

## Phase Status Summary

- [x] **Phase 1 — Project Setup** (Completed: 2026-07-29)
- [x] **Phase 2 — Routing** (Completed: 2026-07-29)
- [x] **Phase 3 — Supabase** (Completed: 2026-07-30)
- [x] **Phase 4 — Business Context** (Completed: 2026-08-02)
- [x] **Phase 5 — Chat Widget (UI only)** (Completed: 2026-08-03)
- [x] **Phase 6 — Gemini Integration** (Completed: 2026-08-04)
- [x] **Phase 7 — Lead Capture** (Completed: 2026-08-05)
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

---

### Phase 4 — Business Context
**Goal:** Load full business context (still no AI).

- **Files Created/Modified:**
  - `supabase/schema_phase4.sql` (DDL for `faqs` & `services` tables, RLS public-read policies, seed rows for both test businesses)
  - `lib/supabase/types.ts` (Added `FAQ`, `Service`, and `BusinessContext` interfaces)
  - `lib/businesses.ts` (Added `getBusinessContextBySlug()` with parallel Supabase queries + mock fallback per business)
  - `components/business-faqs.tsx` (Accordion FAQ display, client component)
  - `components/business-services.tsx` (Service cards grid display)
  - `app/[slug]/page.tsx` (Switched to `getBusinessContextBySlug`, renders services + FAQs alongside branding)
- **Definition of Done:**
  - [x] `faqs` and `services` tables defined with RLS enabled and public read policies in `schema_phase4.sql`
  - [x] Each slug loads only its own FAQs and services (verified via distinct mock seed data per business ID)
  - [x] Business page displays branding, contact, hours, services, and FAQs — all scoped to the current tenant

---

### Phase 5 — Chat Widget (UI only)
**Goal:** Build the widget interface, no AI wired up yet.

- **Files Created/Modified:**
  - `components/chat-widget.tsx` (Floating button, open/close panel, local chat history, typing indicator, config-driven `widget_settings`)
  - `app/[slug]/page.tsx` (Replaced static greeting banner with `<ChatWidget />`)
- **Definition of Done:**
  - [x] Widget opens/closes correctly — toggle button, header close button, responsive panel sizing
  - [x] Two businesses show different widget appearance via `widget_settings` (theme color, greeting, position) with no code changes

---

### Phase 6 — Gemini Integration
**Goal:** Connect AI, scoped strictly to business context, protected from abuse.

- **Files Created/Modified:**
  - `lib/gemini.ts` (Google Gen AI SDK integration, `gemini-1.5-flash` model, 300 maxOutputTokens, strict system prompt enforcing zero general knowledge and fallback response)
  - `lib/rate-limit.ts` (Sliding-window rate limiter using Supabase `rate_limits` table via service-role client)
  - `lib/supabase/service.ts` (Service-role Supabase client bypassing client RLS for rate-limit management)
  - `app/api/chat/[businessId]/route.ts` (Route handler parsing UUID, Zod input validation, server-side context lookup, business rate-limiting, and Gemini streaming/response generation)
  - `components/chat-widget.tsx` (Updated to send user messages to `/api/chat/[businessId]` and render dynamic AI responses)
  - `supabase/schema_phase6.sql` (DDL for `rate_limits` table with RLS enabled and zero public policies)
- **Definition of Done:**
  - [x] Off-topic question to two different businesses' widgets stays strictly scoped to its own data without leaking info
  - [x] Fallback response ("I'll ask our team to contact you.") triggers for unknown questions outside context
  - [x] Rate limiting blocks excessive requests per business (10 req/min cap)

---

### Phase 7 — Lead Capture
**Goal:** Capture and store leads safely.

- **Files Created/Modified:**
  - `supabase/schema_phase7.sql` (DDL for `leads` table, RLS enabled, public INSERT policy only — no public SELECT)
  - `lib/validations/lead.ts` (Shared `LeadSchema` with Zod — name, email, phone, message, business_id)
  - `lib/constants.ts` (Shared `UUID_FORMAT` regex used by chat and lead routes)
  - `lib/supabase/types.ts` (Added `Lead`, `LeadStatus`, `CreateLeadInput` interfaces)
  - `app/api/leads/route.ts` (POST handler — server-side Zod re-validation, business lookup, Supabase insert)
  - `components/lead-form.tsx` (React Hook Form + Zod client validation, success/error states)
  - `components/chat-widget.tsx` (Added "Leave Message" tab with embedded `LeadForm`)
  - `app/api/chat/[businessId]/route.ts` (Refactored to use shared `UUID_FORMAT` from constants)
- **Database migration required:** Run `supabase/schema_phase7.sql` in the Supabase SQL editor before testing inserts.
- **Definition of Done:**
  - [x] Submitting a lead with invalid data (e.g. malformed email) is rejected server-side even if the client check is bypassed
  - [x] Lead insert stores `business_id`, timestamp, and default status `'new'` — verified via API flow (requires `leads` table migration applied in Supabase)

---
